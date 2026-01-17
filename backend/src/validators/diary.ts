import { validate as uuidValidate, version as uuidVersion } from "uuid";
import z from "zod";
import { feelingList } from "../constants/diary";

export const CreateDiaryRequestSchema = z.object({
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD の形式で入力してください"),
	title: z.string().max(100, "100字以内で入力してください").optional(),
	content: z
		.string()
		.min(1, "内容を入力してください")
		.max(10000, "10000字以内で入力してください"),
	feeling: z.enum(feelingList).optional(),
});

export function isUuidValidateV7(uuid: string): boolean {
	return uuidValidate(uuid) && uuidVersion(uuid) === 7;
}
