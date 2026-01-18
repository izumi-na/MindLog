import { toError } from "./error";
import { logger } from "./logger";
import { createOpenAIClient } from "./openAIClient";

export const openAIChatClient = async (message: string) => {
	try {
		const client = await createOpenAIClient();
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
		logger.error("Failed to create OpenAIChatClient:", toError(error));
		throw error;
	}
};
