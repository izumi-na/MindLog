"use client";

import { signIn } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/AuthProvider";
import type { SignInFormDataType } from "@/validation/signin";

export function useSignIn() {
	const router = useRouter();
	const { setEmail, setIsAuthenticated } = useAuthContext();

	const onSubmit = async ({ email, password }: SignInFormDataType) => {
		try {
			const { nextStep } = await signIn({
				username: email,
				password,
			});

			if (nextStep.signInStep === "DONE") {
				setEmail(email);
				setIsAuthenticated(true);
				toast.success("ようこそ！");
				router.push("/");
			} else if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
				toast.info("確認コードを入力し、サインアップを完了してください。");
				router.push("/confirmsignup");
			} else {
				toast.error("予期しないサインアップステップです。");
			}
		} catch (error) {
			if (
				error instanceof Error &&
				(error.name === "UserNotFoundException" ||
					error.name === "NotAuthorizedException")
			) {
				toast.error("メールアドレス または パスワードが誤っています。");
			} else {
				toast.error(
					"サインアップ中にエラーが発生しました。もう一度お試しください。",
				);
			}
			console.error("ログインエラー:", error);
		}
	};

	return { onSubmit };
}
