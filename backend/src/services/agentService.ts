import { createOpenAI } from "@ai-sdk/openai";
import { streamText, stepCountIs } from "ai";
import { createDiaryTools } from "../tools/diaryTools";
import { logger } from "../utils/logger";
import { getSecretValue } from "../utils/secretsManager"; // ← 追加

const apiKeyName = process.env.OPENAI_API_KEY_NAME;
if (!apiKeyName) {
	throw new Error("Environment variables OpenAIAPIKeyName must be set");
}

/**
 * エージェントにメッセージを送信してストリーミングレスポンスを得る
 *
 * @param userId - ユーザーID
 * @param message - ユーザーからのメッセージ
 * @returns streamTextの結果オブジェクト（textStreamなどを含む）
 */
export const callAgentStream = async (userId: string, message: string) => {
	logger.info("🤖 Starting agent call", { userId, message });

	// AWS Secrets ManagerからAPIキーを取得
	const apiKey = await getSecretValue(apiKeyName);
	if (!apiKey) {
		throw new Error(`Failed to get APIKey: ${apiKeyName}`);
	}
	const openai = createOpenAI({ apiKey });

	// ユーザー用のツールを生成
	const tools = createDiaryTools(userId);

	// エージェントを呼び出す（streamTextはawait不要、即座にオブジェクトを返す）
	const result = streamText({
		model: openai("gpt-4o-mini"),
		system:
			"あなたはユーザーの日記を読んで、パーソナライズされた回答をするAIアシスタントです。必要に応じてツールを使ってユーザーの日記を参照してください。一般的な質問には、ツールを使わず直接回答してください。",
		prompt: message,
		tools,
		toolChoice: "auto",
		stopWhen: stepCountIs(5),
		onStepFinish: (step) => {
			// エージェントの各ステップをログ出力
			logger.info("🤖 Agent step finished", {
				stepNumber: step.stepNumber,
				text: step.text ? step.text.substring(0, 100) : undefined,
				toolCalls: step.toolCalls?.map((tc) => ({
					toolCallId: tc.toolCallId,
					toolName: tc.toolName,
					input: tc.input,
				})),
				toolResults: step.toolResults?.map((tr) => ({
					toolCallId: tr.toolCallId,
					toolName: tr.toolName,
					output:
						typeof tr.output === "object"
							? JSON.stringify(tr.output).substring(0, 200)
							: tr.output,
				})),
				finishReason: step.finishReason,
				usage: step.usage,
			});
		},
	});

	return result;
};
