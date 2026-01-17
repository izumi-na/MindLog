import { Trash2 } from "lucide-react";
import { FEELING_DEFINITIONS } from "@/constants/diary";
import type { DiaryItems } from "@/types/diary";
import { formatDate } from "@/utils/date";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";

export function CardItems({
	diaryData,
	handleDeleteClick,
}: {
	diaryData: DiaryItems[];
	handleDeleteClick: (item: DiaryItems) => Promise<void>;
}) {
	return diaryData.map((item) => (
		<Card key={item.diaryId}>
			<CardHeader>
				<CardTitle>
					<div className="flex items-center justify-between">
						<div>{formatDate(item.date)}</div>
						<div className="flex items-center gap-2">
							{item.feeling ? (
								<p>
									{FEELING_DEFINITIONS[item.feeling].label}
									{FEELING_DEFINITIONS[item.feeling].icon}
								</p>
							) : null}
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => handleDeleteClick(item)}
							>
								<Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
							</Button>
						</div>
					</div>
				</CardTitle>
				<CardDescription>{item.title || "タイトルなし"}</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-gray-500 line-clamp-3">{item.content}</p>
			</CardContent>
		</Card>
	));
}
