"use client";

import { ConfirmSignUpForm } from "@/components/auth/ConfirmSignUpForm";
import { useConfirmSignUp } from "@/hooks/useConfirmSignUp";

export default function ConfirmSignUpPage() {
	const { onSubmit } = useConfirmSignUp();
	return (
		<div className="flex min-h-screen w-full items-center justify-center p-4">
			<ConfirmSignUpForm onSubmit={onSubmit} />
		</div>
	);
}
