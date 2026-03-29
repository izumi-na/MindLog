import { tool } from "ai";
import { z } from "zod";
import { getDiaries } from "../services/diaryService";
import { getHighCosineSimilarityItems } from "../utils/cosineSimilarity";
import { getEmbedding } from "../utils/embeddings";
import { toError } from "../utils/error";
import { logger } from "../utils/logger";

/**
 * ユーザーIDを受け取って、そのユーザー用のツールを生成する関数
 */
export const createDiaryTools = (userId: string) => {
	return {
		search_user_diaries: tool({
			description:
				"ユーザーの過去の日記から関連する内容を検索します。ユーザーの個人的な記録や過去の出来事について質問されたときに使います。例：「最近何考えてた？」「先週何食べた？」",
			inputSchema: z.object({
				query: z.string().describe("検索したい内容やキーワード"),
			}),
			execute: async ({ query }) => {
				// userId はクロージャーでアクセス可能
				logger.info("🤖 Agent called search_user_diaries tool", {
					query,
					userId,
				});

				try {
					// 1. クエリをベクトル化
					const inputEmbedding = await getEmbedding(query);

					// 2. ユーザーの全日記を取得
					const diariesResult = await getDiaries(userId);
					if (!diariesResult.success) {
						throw new Error("Failed to get user diaries");
					}

					// 3. コサイン類似度で関連日記を抽出
					const similarDiaries = getHighCosineSimilarityItems(
						inputEmbedding,
						diariesResult.data,
					);

					logger.info("🤖 search_user_diaries tool result", {
						query,
						foundCount: similarDiaries.length,
						similarities: similarDiaries.map((d) => d.cosineSimilarity),
					});

					// 4. エージェントが理解しやすい形式で返す
					return {
						count: similarDiaries.length,
						diaries: similarDiaries.map((diary) => ({
							date: diary.date,
							feeling: diary.feeling || "記載なし",
							content: diary.content,
							similarity: Math.round(diary.cosineSimilarity * 100) / 100,
						})),
					};
				} catch (error) {
					logger.error("🤖 search_user_diaries tool error", toError(error));
					throw error;
				}
			},
		}),
		get_recent_diaries: tool({
			description:
				"最近の日記を時系列で取得します。ユーザーが「最近どう？」「今週の様子は？」と聞いてきた場合に使用します。検索は使わず、単純に最新のN件を返します。",
			inputSchema: z.object({
				count: z
					.number()
					.default(5)
					.describe("取得する日記の件数（デフォルト5件）"),
			}),
			execute: async ({ count }) => {
				logger.info("🤖 Agent called get_recent_diaries tool", {
					count,
					userId,
				});

				try {
					// 1. ユーザーの全日記を取得
					const diariesResult = await getDiaries(userId);
					if (!diariesResult.success) {
						throw new Error("Failed to get user diaries");
					}

					// 2. 日付順にソート（新しい順）
					const sortedDiaries = diariesResult.data.sort((a, b) =>
						b.date.localeCompare(a.date),
					);

					// 3. 上位count件を取得
					const recentDiaries = sortedDiaries.slice(0, count);

					logger.info("🤖 get_recent_diaries tool result", {
						requestedCount: count,
						actualCount: recentDiaries.length,
					});

					// 4. 結果を整形
					return {
						count: recentDiaries.length,
						diaries: recentDiaries.map((diary) => ({
							date: diary.date,
							feeling: diary.feeling || "記載なし",
							content: diary.content,
						})),
					};
				} catch (error) {
					logger.error("🤖 get_recent_diaries tool error", toError(error));
					throw error;
				}
			},
		}),
	};
};
