import type z from "zod";
import type { feelingList } from "../constants/diary";
import type { CreateDiaryRequestSchema } from "../validators/diary";

export type FeelingList = (typeof feelingList)[number];

export type DiaryItems = {
	userId: string;
	diaryId: string;
	date: string;
	content: string;
	feeling?: FeelingList;
	createdAt: string;
	updatedAt: string;
};

export type CreateDiaryRequest = z.infer<typeof CreateDiaryRequestSchema>;

export type CreateDiaryRequestKeys = keyof CreateDiaryRequest;
