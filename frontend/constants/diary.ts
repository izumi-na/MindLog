import { feelingList } from "../../backend/src/constants/diary";
import type { FeelingList } from "../../backend/src/types/diary";

export const FEELING_DEFINITIONS: Record<
	FeelingList,
	{ label: string; icon: string; bgColor: string }
> = {
	happy: { label: "楽しい", icon: "💗", bgColor: "bg-fuchsia-100" },
	moved: { label: "感動", icon: "✨", bgColor: "bg-yellow-100" },
	satisfied: { label: "充実", icon: "🤍", bgColor: "bg-violet-200" },
	sad: { label: "悲しい", icon: "💧", bgColor: "bg-blue-300" },
	anger: { label: "怒り", icon: "💢", bgColor: "bg-rose-300" },
	surprise: { label: "驚き", icon: "💥", bgColor: "bg-lime-200" },
} as const;

export const feelingMap = feelingList.map((feeling) => {
	return {
		value: feeling,
		...FEELING_DEFINITIONS[feeling],
	};
});
