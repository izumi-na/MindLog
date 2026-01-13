import type { ErrorCode } from "../constants/error";

export type SuccessResponse<T> = {
	success: true;
	data: T;
};

export type ErrorResponse = {
	success: false;
	error: {
		code: ErrorCode;
		message: string;
	};
};

export type ResultResponse<T> = SuccessResponse<T> | ErrorResponse;
