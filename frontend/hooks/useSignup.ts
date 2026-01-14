"use client";

import { signUp } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/AuthProvider";
import type { SignUpFormDataType } from "@/validation/signup";

export function useSignUp() {
	const router = useRouter();
	const { setEmail } = useAuthContext();

	const onSubmit = async ({ email, password }: SignUpFormDataType) => {
		try {
			const { nextStep } = await signUp({
				username: email,
				password,
				options: {
					userAttributes: {
						email: email,
					},
					autoSignIn: {
						authFlowType: "USER_SRP_AUTH",
					},
				},
			});
			setEmail(email);

			if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
				toast.success(
					"メールに確認コードが送信されました。確認コードを使用してアカウントを確認してください。",
				);
				router.push("/confirmsignup");
			} else if (nextStep.signUpStep === "DONE") {
				toast.success("サインアップが完了しました。");
			} else {
				toast.error("予期しないサインアップステップです。");
			}
		} catch {
			toast.error(
				"サインアップ中にエラーが発生しました。もう一度お試しください。",
			);
		}
	};

	return { onSubmit };
}
