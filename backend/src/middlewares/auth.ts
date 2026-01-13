import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { Context, Next } from "hono";
import { ERROR_CODES, ERROR_STATUS_CODE } from "../constants/error";
import { errorResponse } from "../utils/response";

if (
	!process.env.COGNITO_USERPOOL_ID ||
	!process.env.COGNITO_USERPOOL_CLIENT_ID
) {
	throw new Error(
		"Environment variables COGNITO_USERPOOL_ID and COGNITO_USERPOOL_CLIENT_ID must be set",
	);
}

const verifier = CognitoJwtVerifier.create({
	userPoolId: process.env.COGNITO_USERPOOL_ID,
	tokenUse: "id",
	clientId: process.env.COGNITO_USERPOOL_CLIENT_ID,
});

export const isAuthenticated = async (c: Context, next: Next) => {
	const AuthorizationHeader = c.req.header("Authorization");
	if (
		!AuthorizationHeader ||
		!AuthorizationHeader.startsWith("Bearer ") ||
		!AuthorizationHeader.split(" ")[1]
	) {
		return c.json(
			errorResponse(ERROR_CODES.UNAUTHORIZED),
			ERROR_STATUS_CODE[ERROR_CODES.UNAUTHORIZED],
		);
	}
	const token = AuthorizationHeader.split(" ")[1];

	try {
		const userId = await verifier.verify(token);
		c.set("userId", userId.sub);
		await next();
	} catch {
		return c.json(
			errorResponse(ERROR_CODES.UNAUTHORIZED),
			ERROR_STATUS_CODE[ERROR_CODES.UNAUTHORIZED],
		);
	}
};
