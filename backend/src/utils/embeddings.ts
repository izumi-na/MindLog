import { toError } from "../utils/error";
import { logger } from "../utils/logger";
import { createOpenAIClient } from "./openAIClient";

export const getEmbedding = async (content: string) => {
	try {
		const client = await createOpenAIClient();
		const result = await client.embeddings.create({
			model: "text-embedding-3-small",
			input: content,
			encoding_format: "float",
		});
		if (!result?.data[0]?.embedding) {
			throw new Error("Not Found getEmbedding result");
		}
		return result.data[0].embedding;
	} catch (error) {
		logger.error("Failed to getEmbedding request:", toError(error));
		throw error;
	}
};
