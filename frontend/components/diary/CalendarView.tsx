import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { FEELING_DEFINITIONS } from "@/constants/diary";
import { groupDiariesByFeeling } from "@/utils/calendar";
import type { DiaryItems, FeelingList } from "../../../backend/src/types/diary";

export const CalendarView = ({
	diariesByDate,
	handleCalendarItemClick,
}: {
	diariesByDate: Map<string, DiaryItems[]> | undefined;
	handleCalendarItemClick: (date: string) => void;
}) => {
	return (
		<Calendar
			mode="single"
			className="rounded-md border shadow-sm"
			captionLayout="dropdown"
			components={{
				DayButton: ({ children, modifiers, day, ...props }) => {
					const diaryItems = diariesByDate?.get(day.isoDate);
					if (!diaryItems || diaryItems.length === 0) {
						return (
							<CalendarDayButton day={day} modifiers={modifiers} {...props}>
								{children}
							</CalendarDayButton>
						);
					}
					const diaryItemsByFeeling = groupDiariesByFeeling(diaryItems);

					return (
						<CalendarDayButton
							day={day}
							modifiers={modifiers}
							{...props}
							onClick={() => handleCalendarItemClick(day.isoDate)}
						>
							{children}
							{Object.entries(diaryItemsByFeeling).map(
								([feeling, diaryItem]) => {
									if (feeling === "nothing") {
										return (
											<div key={feeling} className="bg-gray-300 w-full">
												その他 {diaryItem.length}個
											</div>
										);
									}
									const definition =
										FEELING_DEFINITIONS[feeling as FeelingList];
									return (
										<div
											key={feeling}
											className={`${definition.bgColor} flex w-full justify-between p-0.5`}
										>
											<div>
												{definition.label}
												{definition.icon}
											</div>
											<div>{diaryItem.length}個</div>
										</div>
									);
								},
							)}
						</CalendarDayButton>
					);
				},
			}}
		/>
	);
};
