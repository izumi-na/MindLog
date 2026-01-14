"use client";

import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSignUp } from "@/hooks/useSignup";

export default function SignUpPage() {
	const { onSubmit } = useSignUp();

	return (
		<div className="flex min-h-screen w-full items-center justify-center p-4">
			<SignUpForm onSubmit={onSubmit} />
		</div>
	);
}
