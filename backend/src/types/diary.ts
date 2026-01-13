export type DiaryItems = {
	userId: string;
	diaryId: string;
	date: string;
	context: string;
	feeling?: "happy" | "moved" | "satisfied" | "sad" | "anger" | "surprise";
	createdAt: string;
	updatedAt: string;
};
