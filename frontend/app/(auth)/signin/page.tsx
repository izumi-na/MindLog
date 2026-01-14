"use client";

import { SignInForm } from "@/components/auth/SignInForm";
import { useSignIn } from "@/hooks/useSignIn";

export default function SignInPage() {
	const { onSubmit } = useSignIn();

	return (
		<div className="flex min-h-screen w-full items-center justify-center p-4">
			<SignInForm onSubmit={onSubmit} />
		</div>
	);
}
