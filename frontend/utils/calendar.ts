import type { DiaryItems } from "@/types/diary";
import type { FeelingList } from "../../backend/src/types/diary";

export const groupDiariesByDate = (
	diaryData: DiaryItems[],
): Map<string, DiaryItems[]> => {
	return diaryData.reduce((acc, item) => {
		const itemList = acc.get(item.date) ?? [];
		itemList.push(item);
		acc.set(item.date, itemList);
		return acc;
	}, new Map<string, DiaryItems[]>());
};

export const groupDiariesByFeeling = (
	diaryData: DiaryItems[],
): Record<FeelingList | "nothing", DiaryItems[]> => {
	return diaryData.reduce(
		(acc, item) => {
			if (!item.feeling) {
				if (!acc.nothing) {
					acc.nothing = [];
				}
				acc.nothing.push(item);
				return acc;
			}
			if (!acc[item.feeling]) {
				acc[item.feeling] = [];
			}
			acc[item.feeling].push(item);
			return acc;
		},
		{} as Record<FeelingList | "nothing", DiaryItems[]>,
	);
};
