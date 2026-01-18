import OpenAI from "openai";
import { toError } from "../utils/error";
import { logger } from "../utils/logger";
import { getSecretValue } from "./secretsManager";

const apiKeyName = process.env.OPENAI_API_KEY_NAME;
if (!apiKeyName) {
	throw new Error("Environment variables OpenAIAPIKeyName must be set");
}
let openAIClient: OpenAI | null = null;

export const createOpenAIClient = async () => {
	if (openAIClient) {
		return openAIClient;
	}
	try {
		const apiKey = await getSecretValue(apiKeyName);
		if (!apiKey) {
			throw new Error(`Failed to get APIKey:${apiKeyName}`);
		}
		openAIClient = new OpenAI({ apiKey });
		return openAIClient;
	} catch (error) {
		logger.error("Failed to create OpenAIClient:", toError(error));
		throw error;
	}
};
