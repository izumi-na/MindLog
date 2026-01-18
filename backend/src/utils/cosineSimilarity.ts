import type { DiaryItems } from "../types/diary";

export const getCosineSimilarity = (x: number[], y: number[]) => {
	const dot = x.reduce((sum, prev, i) => sum + prev * y[i], 0);
	const normX = Math.sqrt(x.reduce((sum, prev) => sum + prev * prev, 0));
	const normY = Math.sqrt(y.reduce((sum, prev) => sum + prev * prev, 0));
	return dot / (normX * normY);
};

// コサイン類似度が0.5以上の日記上位５個を抽出
export const getHighCosineSimilarityItems = (
	inputEmbedding: number[],
	storedDiaries: DiaryItems[],
) => {
	const similarityDiaries = storedDiaries.map((diary) => {
		const cosineSimilarityValue = getCosineSimilarity(
			inputEmbedding,
			diary.embedding,
		);
		return {
			...diary,
			cosineSimilarity: cosineSimilarityValue,
		};
	});

	return similarityDiaries
		.filter((diary) => diary.cosineSimilarity > 0.5)
		.sort((a, b) => b.cosineSimilarity - a.cosineSimilarity)
		.slice(0, 5);
};
