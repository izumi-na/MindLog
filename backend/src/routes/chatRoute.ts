import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { ERROR_CODES, ERROR_STATUS_CODE } from "../constants/error";
import { isAuthenticated } from "../middlewares/auth";
import { addMessage, createChatRoom } from "../services/chatServices";
import { getDiaries } from "../services/diaryService";
import type { HonoEnv } from "../types/hono";
import { getHighCosineSimilarityItems } from "../utils/cosineSimilarity";
import { getEmbedding } from "../utils/embeddings";
import { toError } from "../utils/error";
import { logger } from "../utils/logger";
import { openAIChatClient } from "../utils/openAIChatClient";
import { errorResponse } from "../utils/response";
import { PostChatRequestSchema } from "../validators/chat";

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
	});
