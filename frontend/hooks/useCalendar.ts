import { useState } from "react";
import type { DiaryItems } from "@/types/diary";
import { groupDiariesByDate } from "@/utils/calendar";

export const useCalendar = () => {
	const [selectCalendarDate, setSelectCalendarDate] = useState("");
	const [calendarDialogOpen, setCalanderDialogOpen] = useState(false);
	const [diariesByDate, setDiariesByDate] =
		useState<Map<string, DiaryItems[]>>();

	const handleCalendarItemClick = (date: string) => {
		setSelectCalendarDate(date);
		setCalanderDialogOpen(true);
	};

	const handleDialogClose = () => {
		setCalanderDialogOpen(false);
	};

	const fetchGroupDiariesByDate = (diaryData: DiaryItems[]) => {
		const diaryList = groupDiariesByDate(diaryData);
		setDiariesByDate(diaryList);
	};

	return {
		selectCalendarDate,
		handleCalendarItemClick,
		calendarDialogOpen,
		handleDialogClose,
		diariesByDate,
		fetchGroupDiariesByDate,
	};
};
