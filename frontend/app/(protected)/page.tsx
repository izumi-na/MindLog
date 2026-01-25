"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { CalendarView } from "@/components/diary/CalendarView";
import { DeleteConfirmDialog } from "@/components/diary/DeleteConfirmDialog";
import { DiaryDetailDialog } from "@/components/diary/DiaryDetailDialog";
import { Button } from "@/components/ui/button";
import { useCalendar } from "@/hooks/useCalendar";
import { useDiaries } from "@/hooks/useDiaries";

export default function CalendarPage() {
	const {
		diaryData,
		fetchDiaries,
		handleDeleteClick,
		isDeleteConfirmDialog,
		setIsDeleteConfirmDialog,
		handleDelete,
	} = useDiaries();
	const {
		selectCalendarDate,
		handleCalendarItemClick,
		calendarDialogOpen,
		handleDialogClose,
		diariesByDate,
		fetchGroupDiariesByDate,
	} = useCalendar();

	// biome-ignore lint/correctness/useExhaustiveDependencies: 初回マウント時のみ実行
	useEffect(() => {
		fetchDiaries();
	}, []);

	// biome-ignore　lint/correctness/useExhaustiveDependencies: fetchGroupDiariesByDateは関数であり変更されるものではないため
	useEffect(() => {
		if (diaryData.length > 0) {
			fetchGroupDiariesByDate(diaryData);
		}
	}, [diaryData]);

	return (
		<div className="px-12 py-6">
			<div className="flex justify-between mb-4">
				<Button variant="outline" asChild>
					<Link href={`/chat`}>
						← <Sparkles />
						AIとチャットする
					</Link>
				</Button>
				<Button variant="outline" asChild>
					<Link href={`/diaries/new`}>＋日記登録</Link>
				</Button>
			</div>
			<CalendarView
				diariesByDate={diariesByDate}
				handleCalendarItemClick={handleCalendarItemClick}
			/>
			<DiaryDetailDialog
				calendarDialogOpen={calendarDialogOpen}
				selectCalendarDate={selectCalendarDate}
				handleDialogClose={handleDialogClose}
				diariesByDate={diariesByDate}
				handleDeleteClick={handleDeleteClick}
			/>
			<DeleteConfirmDialog
				isDeleteConfirmDialog={isDeleteConfirmDialog}
				setIsDeleteConfirmDialog={setIsDeleteConfirmDialog}
				handleDelete={handleDelete}
			/>
		</div>
	);
}
