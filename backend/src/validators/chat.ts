import z from "zod";

export const PostChatRequestSchema = z.object({
	message: z
		.string()
		.min(1, "メッセージを入力してください")
		.max(10000, "メッセージは10000字以内で入力してください"),
});
