import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { ERROR_CODES, ERROR_STATUS_CODE } from "../constants/error";
import { isAuthenticated } from "../middlewares/auth";
import {
	addMessage,
	createChatRoom,
	getChatMessages,
	getChatRoom,
	getChatRooms,
	updateChatRoom,
} from "../services/chatServices";
import { getDiaries } from "../services/diaryService";
import type { HonoEnv } from "../types/hono";
import { getHighCosineSimilarityItems } from "../utils/cosineSimilarity";
import { getEmbedding } from "../utils/embeddings";
import { toError } from "../utils/error";
import { logger } from "../utils/logger";
import { openAIChatClient, openAITitleClient } from "../utils/openAI";
import { errorResponse } from "../utils/response";
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
			// 入力されたメッセージをベクトル化、既存の日記一覧を取得
			const [inputEmbedding, diaries] = await Promise.all([
				getEmbedding(params.message),
				getDiaries(userId),
			]);
			if (!diaries.success) {
				return c.json(diaries, ERROR_STATUS_CODE[diaries.error.code]);
			}
			// 入力されたメッセージとのコサイン類似度が高い日記を最大５つ取得
			const highCosineSimilarityItems = getHighCosineSimilarityItems(
				inputEmbedding,
				diaries.data,
			);
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
			// OpenAIに入力されたメッセージとのコサイン類似度が高い日記（最大５つ）を送信
			const chatStream = await openAIChatClient(
				params.message,
				highCosineSimilarityItems,
			);
			c.header("X-Room-Id", resultCreateChatRoom.data.roomId);
			return streamText(c, async (stream) => {
				try {
					for await (const event of chatStream) {
						// OpenAIがレスポンス作成中の場合はstreamに書き込む
						if (event.type === "response.output_text.delta") {
							await stream.write(event.delta);
						}
						// OpenAIのレスポンスが完了した場合はdynamoDBにOpenAIのレスポンス全体を保存してreturn
						if (event.type === "response.output_text.done") {
							const content = event.text;
							// dynamoDBにOpenAIのレスポンス全体を保存
							const resultAddOpenAIMessage = await addMessage(
								userId,
								resultCreateChatRoom.data.roomId,
								"assistant",
								content,
							);
							if (!resultAddOpenAIMessage.success) {
								throw resultAddOpenAIMessage;
							}
							// 初回のチャットメッセージ内容からチャットルームタイトルを生成
							const updateTitle = await openAITitleClient(
								params.message,
								content,
							);
							// チャットルームのタイトル更新
							const resultUpdateChatRoom = await updateChatRoom(
								userId,
								resultCreateChatRoom.data.roomId,
								updateTitle,
							);
							if (!resultUpdateChatRoom.success) {
								throw resultUpdateChatRoom;
							}
							return;
						}
					}
				} catch (error) {
					logger.error("Failed to OpenAI API Request:", toError(error));
					await stream.write("エラーが発生しました。もう一度お試しください。");
				} finally {
					stream.close();
				}
			});
		} catch (error) {
			logger.error("Failed to initialize OpenAI client:", toError(error));
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
				// 入力されたメッセージをベクトル化、既存の日記一覧を取得
				const [inputEmbedding, diaries] = await Promise.all([
					getEmbedding(params.message),
					getDiaries(userId),
				]);
				if (!diaries.success) {
					return c.json(diaries, ERROR_STATUS_CODE[diaries.error.code]);
				}
				// 入力されたメッセージとのコサイン類似度が高い日記を最大５つ取得
				const highCosineSimilarityItems = getHighCosineSimilarityItems(
					inputEmbedding,
					diaries.data,
				);
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
				// OpenAIに入力されたメッセージとのコサイン類似度が高い日記（最大５つ）を送信
				const chatStream = await openAIChatClient(
					params.message,
					highCosineSimilarityItems,
				);
				return streamText(c, async (stream) => {
					try {
						for await (const event of chatStream) {
							// OpenAIがレスポンス作成中の場合はstreamに書き込む
							if (event.type === "response.output_text.delta") {
								await stream.write(event.delta);
							}
							// OpenAIのレスポンスが完了した場合はdynamoDBにOpenAIのレスポンス全体を保存してreturn
							if (event.type === "response.output_text.done") {
								const content = event.text;
								// dynamoDBにOpenAIのレスポンス全体を保存
								const resultAddOpenAIMessage = await addMessage(
									userId,
									roomId,
									"assistant",
									content,
								);
								if (!resultAddOpenAIMessage.success) {
									throw resultAddOpenAIMessage;
								}
								// チャットルームのupdateAtを更新
								const resultUpdateChatRoom = await updateChatRoom(
									userId,
									roomId,
								);
								if (!resultUpdateChatRoom.success) {
									// タイムスタンプ更新失敗は致命的ではないため、エラーにはしない
									logger.warn("Failed to update chatRoom updatedAt:", {
										userId,
										roomId,
									});
								}
								return;
							}
						}
					} catch (error) {
						logger.error("Failed to OpenAI API Request:", toError(error));
						await stream.write(
							"エラーが発生しました。もう一度お試しください。",
						);
					} finally {
						stream.close();
					}
				});
			} catch (error) {
				logger.error("Failed to initialize OpenAI client:", toError(error));
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
			return c.json(sortChatRooms, 200);
		} catch (error) {
			logger.error("Failed to getChatRooms request:", toError(error));
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
			return c.json(resultGetChatMessages.data, 200);
		} catch (error) {
			logger.error("Failed to getChatMessages request:", toError(error));
			return c.json(
				errorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR),
				ERROR_STATUS_CODE[ERROR_CODES.INTERNAL_SERVER_ERROR],
			);
		}
	});
