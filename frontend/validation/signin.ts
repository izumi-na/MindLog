import { z } from "zod";

export const SignInSchema = z.object({
	email: z.email("有効なメールアドレスを入力してください"),
	password: z.string().trim().min(1, "パスワードを入力してください"),
});

export type SignInFormDataType = z.infer<typeof SignInSchema>;
