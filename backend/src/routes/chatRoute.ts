import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { ERROR_CODES, ERROR_STATUS_CODE } from "../constants/error";
import { isAuthenticated } from "../middlewares/auth";
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
	.post("/", zValidator("json", PostChatRequestSchema), async (c) => {
		const userId = c.get("userId");
		const params = c.req.valid("json");
		try {
			const inputEmbedding = await getEmbedding(params.message);
			const result = await getDiaries(userId);
			if (!result.success) {
				return c.json(result, ERROR_STATUS_CODE[result.error.code]);
			}
			const highCosineSimilarityItems = getHighCosineSimilarityItems(
				inputEmbedding,
				result.data,
			);
			const chatStream = await openAIChatClient(
				params.message,
				highCosineSimilarityItems,
			);
			return streamText(c, async (stream) => {
				try {
					for await (const event of chatStream) {
						if (event.type === "response.output_text.delta") {
							await stream.write(event.delta);
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
