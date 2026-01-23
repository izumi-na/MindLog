import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ERROR_CODES, ERROR_STATUS_CODE } from "../constants/error";
import { isAuthenticated } from "../middlewares/auth";
import {
	createDiary,
	deleteDiary,
	getDiaries,
	getDiary,
	updateDiary,
} from "../services/diaryService";
import type { HonoEnv } from "../types/hono";
import { toError } from "../utils/error";
import { logger } from "../utils/logger";
import { errorResponse } from "../utils/response";
import { isUuidValidateV7 } from "../validators/common";
import { CreateDiaryRequestSchema } from "../validators/diary";

export const diaryRoute = new Hono<HonoEnv>()
	// 認証ミドルウェアを設定
	.use("*", isAuthenticated)
	// 日記全取得
	.get("/", async (c) => {
		try {
			const userId = c.get("userId");
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
	})
	// 日記新規登録
	.post("/", zValidator("json", CreateDiaryRequestSchema), async (c) => {
		try {
			const userId = c.get("userId");
			const params = c.req.valid("json");
			const result = await createDiary(userId, params);
			if (!result.success) {
				return c.json(result, ERROR_STATUS_CODE[result.error.code]);
			}
			logger.info("Successfully created diary request:", {
				userId,
				diaryId: result.data.diaryId,
			});
			return c.json(result, 201);
		} catch (error) {
			logger.error("Failed to create diary request:", toError(error));
			return c.json(
				errorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR),
				ERROR_STATUS_CODE[ERROR_CODES.INTERNAL_SERVER_ERROR],
			);
		}
	})
	// 日記物理削除
	.delete("/:diaryId", async (c) => {
		try {
			const userId = c.get("userId");
			const diaryId = c.req.param("diaryId");
			const isValid = isUuidValidateV7(diaryId);
			if (!isValid) {
				return c.json(
					errorResponse(ERROR_CODES.INVALID_INPUT_ERROR),
					ERROR_STATUS_CODE[ERROR_CODES.INVALID_INPUT_ERROR],
				);
			}
			const result = await deleteDiary(userId, diaryId);
			if (!result.success) {
				return c.json(result, ERROR_STATUS_CODE[result.error.code]);
			}
			logger.info("Successfully to delete diary request:", {
				userId,
				diaryId: result.data.diaryId,
			});
			return c.json(result, 200);
		} catch (error) {
			logger.error("Failed to delete diary request:", toError(error));
			return c.json(
				errorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR),
				ERROR_STATUS_CODE[ERROR_CODES.INTERNAL_SERVER_ERROR],
			);
		}
	})
	// 特定の日記取得
	.get("/:diaryId", async (c) => {
		try {
			const userId = c.get("userId");
			const diaryId = c.req.param("diaryId");
			const isValid = isUuidValidateV7(diaryId);
			if (!isValid) {
				return c.json(
					errorResponse(ERROR_CODES.INVALID_INPUT_ERROR),
					ERROR_STATUS_CODE[ERROR_CODES.INVALID_INPUT_ERROR],
				);
			}
			const result = await getDiary(userId, diaryId);
			if (!result.success) {
				return c.json(result, ERROR_STATUS_CODE[result.error.code]);
			}
			logger.info("Successfully to get diary request:", {
				userId,
				diaryId: result.data.diaryId,
			});
			return c.json(result, 200);
		} catch (error) {
			logger.error("Failed to get diary request:", toError(error));
			return c.json(
				errorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR),
				ERROR_STATUS_CODE[ERROR_CODES.INTERNAL_SERVER_ERROR],
			);
		}
	})
	// 特定の日記更新
	.put("/:diaryId", zValidator("json", CreateDiaryRequestSchema), async (c) => {
		try {
			const userId = c.get("userId");
			const diaryId = c.req.param("diaryId");
			const isValid = isUuidValidateV7(diaryId);
			if (!isValid) {
				return c.json(
					errorResponse(ERROR_CODES.INVALID_INPUT_ERROR),
					ERROR_STATUS_CODE[ERROR_CODES.INVALID_INPUT_ERROR],
				);
			}
			const params = c.req.valid("json");
			const result = await updateDiary(userId, diaryId, params);
			if (!result.success) {
				return c.json(result, ERROR_STATUS_CODE[result.error.code]);
			}
			logger.info("Successfully to update diary request:", {
				userId,
				diaryId: result.data.diaryId,
			});
			return c.json(result, 200);
		} catch (error) {
			logger.error("Failed to update diary request:", toError(error));
			return c.json(
				errorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR),
				ERROR_STATUS_CODE[ERROR_CODES.INTERNAL_SERVER_ERROR],
			);
		}
	});
