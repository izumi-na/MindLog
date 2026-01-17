import { feelingList } from "../../backend/src/constants/diary";
import type { FeelingList } from "../../backend/src/types/diary";

const FEELING_DEFINITIONS: Record<
	FeelingList,
	{ label: string; icon: string }
> = {
	happy: { label: "楽しい", icon: "💗" },
	moved: { label: "感動", icon: "✨" },
	satisfied: { label: "充実", icon: "🤍" },
	sad: { label: "悲しい", icon: "💧" },
	anger: { label: "怒り", icon: "💢" },
	surprise: { label: "驚き", icon: "💥" },
} as const;

export const feelingMap = feelingList.map((feeling) => {
	return {
		value: feeling,
		...FEELING_DEFINITIONS[feeling],
	};
});
