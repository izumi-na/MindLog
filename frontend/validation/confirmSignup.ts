import { z } from "zod";

export const ConfirmSignUpSchema = z.object({
	email: z.email("登録に使用したメールアドレスを入力してください"),
	confirmationCode: z.string().length(6, "確認コードは6文字です"),
});

export type ConfirmSignUpFormDataType = z.infer<typeof ConfirmSignUpSchema>;
