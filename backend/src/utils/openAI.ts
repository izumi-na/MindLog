import OpenAI from "openai";
import { toError } from "../utils/error";
import { logger } from "../utils/logger";
import { getSecretValue } from "./secretsManager";

const apiKeyName = process.env.OPENAI_API_KEY_NAME;
if (!apiKeyName) {
	throw new Error("Environment variables OpenAIAPIKeyName must be set");
}

export const openAIClient = async (message: string) => {
	try {
		const apiKey = await getSecretValue(apiKeyName);
		if (!apiKey) {
			throw new Error(`Failed to get APIKey:${apiKeyName}`);
		}
		const client = new OpenAI({ apiKey });
		return await client.responses.create({
			model: "gpt-4o-mini",
			input: [
				{
					role: "user",
					content: message,
				},
			],
			stream: true,
		});
	} catch (error) {
		logger.error("Failed to get APIKey Request:", toError(error));
		throw error;
	}
};
