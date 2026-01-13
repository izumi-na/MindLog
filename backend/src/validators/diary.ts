import { validate as uuidValidate, version as uuidVersion } from "uuid";
import z from "zod";
import { feelingList } from "../constants/diary";

export const CreateDiaryRequestSchema = z.object({
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
	content: z
		.string()
		.min(1, "Content is required")
		.max(10000, "Content too long"),
	feeling: z.enum(feelingList).optional(),
});

export function isUuidValidateV7(uuid: string): boolean {
	return uuidValidate(uuid) && uuidVersion(uuid) === 7;
}
