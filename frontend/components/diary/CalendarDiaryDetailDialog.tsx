import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { DiaryItems } from "@/types/diary";
import { CardItems } from "./DiaryCardItems";

export const CalendarDiaryDetailDialog = ({
	calendarDialogOpen,
	selectCalendarDate,
	handleDialogClose,
	diariesByDate,
	handleDeleteClick,
}: {
	calendarDialogOpen: boolean;
	selectCalendarDate: string;
	handleDialogClose: () => void;
	diariesByDate: Map<string, DiaryItems[]> | undefined;
	handleDeleteClick: (item: DiaryItems) => Promise<void>;
}) => {
	const diaryItems = diariesByDate?.get(selectCalendarDate);

	return (
		<Dialog open={calendarDialogOpen} onOpenChange={handleDialogClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{selectCalendarDate.replaceAll("-", "/")}</DialogTitle>
					<DialogDescription>記録</DialogDescription>
				</DialogHeader>

				<div className="max-h-[80vh] overflow-y-auto flex flex-col gap-4">
					{diaryItems ? (
						<CardItems
							diaryData={diaryItems}
							handleDeleteClick={handleDeleteClick}
						/>
					) : (
						<div>日記がありません</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};
