import type { ContentfulStatusCode } from "hono/utils/http-status";

export const ERROR_CODES = {
	// Bad Request（400）
	INVALID_INPUT_ERROR: "INVALID_INPUT_ERROR",

	// Unauthorized（401）
	UNAUTHORIZED: "UNAUTHORIZED",

	// Not Found（404）
	DIARY_NOT_FOUND: "DIARY_NOT_FOUND",
	CHATROOM_NOT_FOUND: "CHATROOM_NOT_FOUND",

	// Internal Server Error（500）
	INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
	REQUEST_PROCESSING_ERROR: "REQUEST_PROCESSING_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const ERROR_MESSAGES = {
	// Bad Request（400）
	[ERROR_CODES.INVALID_INPUT_ERROR]: "入力データの形式が正しくありません",

	// Unauthorized（401）
	[ERROR_CODES.UNAUTHORIZED]: "認証情報が正しくありません",

	// Not Found（404）
	[ERROR_CODES.DIARY_NOT_FOUND]: "日記が見つかりません",
	[ERROR_CODES.CHATROOM_NOT_FOUND]: "チャットルームが見つかりません",

	// Internal Server Error（500）
	[ERROR_CODES.INTERNAL_SERVER_ERROR]: "内部エラーが発生しました",
	[ERROR_CODES.REQUEST_PROCESSING_ERROR]:
		"リクエスト処理中にエラーが発生しました",
};

export const ERROR_STATUS_CODE: Record<ErrorCode, ContentfulStatusCode> = {
	// Bad Request（400）
	[ERROR_CODES.INVALID_INPUT_ERROR]: 400,

	// Unauthorized（401）
	[ERROR_CODES.UNAUTHORIZED]: 401,

	// Not Found（404）
	[ERROR_CODES.DIARY_NOT_FOUND]: 404,
	[ERROR_CODES.CHATROOM_NOT_FOUND]: 404,

	// Internal Server Error（500）
	[ERROR_CODES.INTERNAL_SERVER_ERROR]: 500,
	[ERROR_CODES.REQUEST_PROCESSING_ERROR]: 500,
};
