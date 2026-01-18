import type { SimilarityDiaryItems } from "../types/diary";
import { toError } from "./error";
import { logger } from "./logger";
import { createOpenAIClient } from "./openAIClient";

export const openAIChatClient = async (
	message: string,
	highCosineSimilarityItems?: SimilarityDiaryItems[],
) => {
	const storedInfoList = highCosineSimilarityItems
		? highCosineSimilarityItems
				.map((item) => {
					return `日付：${item.date}、気分：${item.feeling ? item.feeling : ""}、日記内容：${item.content}`;
				})
				.join("\n")
		: "";

	try {
		const client = await createOpenAIClient();
		return await client.responses.create({
			model: "gpt-4o-mini",
			input: [
				{
					role: "system",
					content:
						"あなたはユーザーの日記を読んで、パーソナライズされた回答をするAIアシスタントです。ユーザーの日記内容を確認し、ユーザーの嗜好に合う回答をします。",
				},
				{
					role: "user",
					content:
						storedInfoList !== ""
							? `以下は私の過去の日記です。${storedInfoList}これらの過去の日記を踏まえた上で、今の私に一番合った最適な回答をしてください。${message}`
							: message,
				},
			],
			stream: true,
		});
	} catch (error) {
		logger.error("Failed to create OpenAIChatClient:", toError(error));
		throw error;
	}
};
