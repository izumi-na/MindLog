import { ERROR_MESSAGES, type ErrorCode } from "../constants/error";
import type { ErrorResponse, SuccessResponse } from "../types/result";

export function successResponse<T>(data: T): SuccessResponse<T> {
	return {
		success: true,
		data,
	};
}

export function errorResponse(code: ErrorCode): ErrorResponse {
	return {
		success: false,
		error: {
			code,
			message: ERROR_MESSAGES[code],
		},
	};
}
