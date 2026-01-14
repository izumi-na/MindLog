"use client";

import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/AuthProvider";

export function useSignOut() {
	const router = useRouter();
	const { setIsAuthenticated, setEmail } = useAuthContext();

	const handleSignOut = async () => {
		try {
			await signOut({ global: true });
			toast.success("ログアウトしました。");
			setEmail(null);
			setIsAuthenticated(false);
			router.push("/signin");
		} catch (error) {
			toast.error(
				"ログアウト中にエラーが発生しました。もう一度お試しください。",
			);
			console.error("ログアウトエラー:", error);
			return;
		}
	};
	return { handleSignOut };
}
