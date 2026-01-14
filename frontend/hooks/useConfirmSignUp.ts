"use client";

import { autoSignIn, confirmSignUp } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/AuthProvider";
import type { ConfirmSignUpFormDataType } from "@/validation/confirmSignup";

export function useConfirmSignUp() {
	const router = useRouter();
	const { setIsAuthenticated, setEmail } = useAuthContext();

	const onSubmit = async ({
		email,
		confirmationCode,
	}: ConfirmSignUpFormDataType) => {
		try {
			const { nextStep } = await confirmSignUp({
				username: email,
				confirmationCode,
			});

			if (nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
				toast.success("アカウントの確認が完了しました。");
				const { nextStep } = await autoSignIn();
				if (nextStep.signInStep === "DONE") {
					setIsAuthenticated(true);
					setEmail(email);
					router.push("/");
				}
			} else if (nextStep.signUpStep === "DONE") {
				toast.success("アカウントの確認が完了しました。");
				router.push("/");
			}
		} catch (error) {
			if (
				error instanceof Error &&
				(error.name === "CodeMismatchException" ||
					error.name === "UserNotFoundException")
			) {
				toast.error("メールアドレス または 確認コードが誤っています。");
			} else {
				toast.error(
					"サインアップ中にエラーが発生しました。もう一度お試しください。",
				);
			}
			console.error("アカウント確認エラー:", error);
		}
	};

	return { onSubmit };
}
