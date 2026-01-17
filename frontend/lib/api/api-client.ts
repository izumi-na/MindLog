import { fetchAuthSession } from "aws-amplify/auth";
import { hc } from "hono/client";
import type { AppType } from "../../../backend/src/app";
import { AuthError } from "../errors";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE_URL) {
	throw new Error("Environment variables NEXT_PUBLIC_API_URL must be set");
}

// 認証なしHono RPCクライアント
export const client = hc<AppType>(API_BASE_URL);

// 認証付きHono RPCクライアント
export const getAuthClient = async () => {
	try {
		const session = await fetchAuthSession({ forceRefresh: true });
		const token = session.tokens?.idToken?.toString();

		if (!token) {
			throw new AuthError("IdToken Not Found", true);
		}

		return hc<AppType>(API_BASE_URL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (error) {
		if (error instanceof AuthError) {
			throw error;
		}
		throw new AuthError("Failed to Get Session", true);
	}
};
