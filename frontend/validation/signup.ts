import { z } from "zod";

export const SignUpSchema = z.object({
	email: z.email("有効なメールアドレスを入力してください"),
	password: z
		.string()
		.min(8, "パスワードは8文字以上で入力してください")
		.regex(/[a-z]/, "パスワードには小文字を含めてください")
		.regex(/[A-Z]/, "パスワードには大文字を含めてください")
		.regex(/[0-9]/, "パスワードには数字を含めてください")
		.regex(/[!@#$%^&*(),.?":{}|<>]/, "パスワードには特殊文字を含めてください"),
});

export type SignUpFormDataType = z.infer<typeof SignUpSchema>;
