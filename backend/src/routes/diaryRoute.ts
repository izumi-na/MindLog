import { Hono } from "hono";
import { ERROR_CODES, ERROR_STATUS_CODE } from "../constants/error";
import { isAuthenticated } from "../middlewares/auth";
import { getDiaries } from "../services/diaryService";
import type { HonoEnv } from "../types/hono";
import { toError } from "../utils/error";
import { logger } from "../utils/logger";
import { errorResponse } from "../utils/response";

export const diaryRoute = new Hono<HonoEnv>()
	// 認証ミドルウェアを設定
	.use("*", isAuthenticated)
	// 日記全取得
	.get("/", async (c) => {
		try {
			const userId = c.get("userId");
			if (!userId || userId.trim() === "") {
				return c.json(
					errorResponse(ERROR_CODES.INVALID_INPUT_ERROR),
					ERROR_STATUS_CODE[ERROR_CODES.INVALID_INPUT_ERROR],
				);
			}
			const result = await getDiaries(userId);
			if (!result.success) {
				return c.json(result, ERROR_STATUS_CODE[result.error.code]);
			}
			logger.info("Successfully to get diaries request:", {
				userId,
				count: result.data.length,
			});
			return c.json(result, 200);
		} catch (error) {
			logger.error("Failed to get diaries request:", toError(error));
			return c.json(
				errorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR),
				ERROR_STATUS_CODE[ERROR_CODES.INTERNAL_SERVER_ERROR],
			);
		}
	});
