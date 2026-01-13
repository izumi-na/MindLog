import type z from "zod";
import type { CreateDiaryRequestSchema } from "../validators/diary";

export type DiaryItems = {
	userId: string;
	diaryId: string;
	date: string;
	content: string;
	feeling?: "happy" | "moved" | "satisfied" | "sad" | "anger" | "surprise";
	createdAt: string;
	updatedAt: string;
};

export type CreateDiaryRequest = z.infer<typeof CreateDiaryRequestSchema>;
