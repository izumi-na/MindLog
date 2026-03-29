import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { streamText as honoStreamText } from "hono/streaming";
import { ERROR_CODES, ERROR_STATUS_CODE } from "../constants/error";
import { isAuthenticated } from "../middlewares/auth";
import { callAgentStream } from "../services/agentService";
import {
	addMessage,
	createChatRoom,
	getChatMessages,
	getChatRoom,
	getChatRooms,
	updateChatRoom,
} from "../services/chatServices";
import type { HonoEnv } from "../types/hono";
import { toError } from "../utils/error";
import { logger } from "../utils/logger";
import { openAITitleClient } from "../utils/openAI";
import { errorResponse, successResponse } from "../utils/response";
import { PostChatRequestSchema } from "../validators/chat";
import { isUuidValidateV7 } from "../validators/common";

export const chatRoute = new Hono<HonoEnv>()
	// 認証ミドルウェアを設定
	.use("*", isAuthenticated)
	// チャットルーム新規作成
	.post("/rooms", zValidator("json", PostChatRequestSchema), async (c) => {
		const userId = c.get("userId");
		const params = c.req.valid("json");

		try {
			// チャットルーム新規作成
			const resultCreateChatRoom = await createChatRoom(userId);
			if (!resultCreateChatRoom.success) {
				return c.json(
					resultCreateChatRoom,
					ERROR_STATUS_CODE[resultCreateChatRoom.error.code],
				);
			}

			// dynamoDBにユーザーから入力されたメッセージを保存
			const resultAddUserMessage = await addMessage(
				userId,
				resultCreateChatRoom.data.roomId,
				"user",
				params.message,
			);
			if (!resultAddUserMessage.success) {
				return c.json(
					resultAddUserMessage,
					ERROR_STATUS_CODE[resultAddUserMessage.error.code],
				);
			}

			// ストリーミングレスポンスで返す
			const roomId = resultCreateChatRoom.data.roomId;
			c.header("X-Room-Id", roomId);

			return honoStreamText(c, async (stream) => {
				const result = await callAgentStream(userId, params.message);

				let fullText = "";
				for await (const textPart of result.textStream) {
					await stream.write(textPart);
					fullText += textPart;
				}

				// ストリーム完了後にDB保存・タイトル生成
				await addMessage(userId, roomId, "assistant", fullText);

				const updateTitle = await openAITitleClient(
					params.message,
					fullText,
				);
				await updateChatRoom(userId, roomId, updateTitle);
			});
		} catch (error) {
			logger.error("Failed to process chat request", toError(error));
			return c.json(
				errorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR),
				ERROR_STATUS_CODE[ERROR_CODES.INTERNAL_SERVER_ERROR],
			);
		}
	})
	// 既存チャットルームにメッセージ追加
	.post(
		"/rooms/:roomId",
		zValidator("json", PostChatRequestSchema),
		async (c) => {
			const userId = c.get("userId");
			const roomId = c.req.param("roomId");
			const isValid = isUuidValidateV7(roomId);
			if (!isValid) {
				return c.json(
					errorResponse(ERROR_CODES.INVALID_INPUT_ERROR),
					ERROR_STATUS_CODE[ERROR_CODES.INVALID_INPUT_ERROR],
				);
			}
			const params = c.req.valid("json");

			try {
				// チャットルームが存在するか確認
				const resultGetChatRoom = await getChatRoom(userId, roomId);
				if (!resultGetChatRoom.success) {
					return c.json(
						resultGetChatRoom,
						ERROR_STATUS_CODE[resultGetChatRoom.error.code],
					);
				}

				// dynamoDBにユーザーから入力されたメッセージを保存
				const resultAddUserMessage = await addMessage(
					userId,
					roomId,
					"user",
					params.message,
				);
				if (!resultAddUserMessage.success) {
					return c.json(
						resultAddUserMessage,
						ERROR_STATUS_CODE[resultAddUserMessage.error.code],
					);
				}

				// ストリーミングレスポンスで返す
				return honoStreamText(c, async (stream) => {
					const result = await callAgentStream(userId, params.message);

					let fullText = "";
					for await (const textPart of result.textStream) {
						await stream.write(textPart);
						fullText += textPart;
					}

					// ストリーム完了後にDB保存・タイムスタンプ更新
					await addMessage(userId, roomId, "assistant", fullText);
					await updateChatRoom(userId, roomId);
				});
			} catch (error) {
				logger.error("Failed to process chat request", toError(error));
				return c.json(
					errorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR),
					ERROR_STATUS_CODE[ERROR_CODES.INTERNAL_SERVER_ERROR],
				);
			}
		},
	)
	// チャットルーム一覧取得
	.get("/rooms", async (c) => {
		const userId = c.get("userId");
		try {
			const resultGetChatRooms = await getChatRooms(userId);
			if (!resultGetChatRooms.success) {
				return c.json(
					resultGetChatRooms,
					ERROR_STATUS_CODE[resultGetChatRooms.error.code],
				);
			}
			const sortChatRooms = resultGetChatRooms.data.sort((a, b) =>
				b.updatedAt.localeCompare(a.updatedAt),
			);
			return c.json(successResponse(sortChatRooms), 200);
		} catch (error) {
			logger.error("Failed to getChatRooms request", toError(error));
			return c.json(
				errorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR),
				ERROR_STATUS_CODE[ERROR_CODES.INTERNAL_SERVER_ERROR],
			);
		}
	})
	// チャットルームのメッセージ一覧取得
	.get("/rooms/:roomId/messages", async (c) => {
		const userId = c.get("userId");
		const roomId = c.req.param("roomId");
		const isValid = isUuidValidateV7(roomId);
		if (!isValid) {
			return c.json(
				errorResponse(ERROR_CODES.INVALID_INPUT_ERROR),
				ERROR_STATUS_CODE[ERROR_CODES.INVALID_INPUT_ERROR],
			);
		}
		try {
			// チャットルームが存在するか確認
			const resultGetChatRoom = await getChatRoom(userId, roomId);
			if (!resultGetChatRoom.success) {
				return c.json(
					resultGetChatRoom,
					ERROR_STATUS_CODE[resultGetChatRoom.error.code],
				);
			}
			const resultGetChatMessages = await getChatMessages(roomId);
			if (!resultGetChatMessages.success) {
				return c.json(
					resultGetChatMessages,
					ERROR_STATUS_CODE[resultGetChatMessages.error.code],
				);
			}
			return c.json(resultGetChatMessages, 200);
		} catch (error) {
			logger.error("Failed to getChatMessages request", toError(error));
			return c.json(
				errorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR),
				ERROR_STATUS_CODE[ERROR_CODES.INTERNAL_SERVER_ERROR],
			);
		}
	});
