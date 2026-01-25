"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { CalendarDiaryDetailDialog } from "@/components/diary/CalendarDiaryDetailDialog";
import { CalendarView } from "@/components/diary/CalendarView";
import { DeleteConfirmDialog } from "@/components/diary/DeleteConfirmDialog";
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
			<div className="grid grid-cols-[1fr_auto_1fr] mb-4">
				<div>
					<Button variant="outline" asChild>
						<Link href={`/chat`}>
							← <Sparkles />
							AIとチャットする
						</Link>
					</Button>
				</div>
				<div>
					<Button variant="outline" asChild>
						<Link href={`/diaries`}>日記一覧</Link>
					</Button>
				</div>
				<div className="justify-self-end">
					<Button variant="outline" asChild>
						<Link href={`/diaries/new`}>＋日記登録</Link>
					</Button>
				</div>
			</div>
			<CalendarView
				diariesByDate={diariesByDate}
				handleCalendarItemClick={handleCalendarItemClick}
			/>
			<CalendarDiaryDetailDialog
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
