"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/contexts/AuthProvider";
import {
	type ConfirmSignUpFormDataType,
	ConfirmSignUpSchema,
} from "@/validation/confirmSignup";

export function ConfirmSignUpForm({
	onSubmit,
}: {
	onSubmit: (data: ConfirmSignUpFormDataType) => Promise<void>;
}) {
	const { email } = useAuthContext();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ConfirmSignUpFormDataType>({
		resolver: zodResolver(ConfirmSignUpSchema),
		defaultValues: {
			email: email ?? undefined,
		},
	});

	return (
		<div className="w-full max-w-md">
			<Card>
				<CardHeader>
					<CardTitle>アカウントの確認</CardTitle>
					<CardDescription>
						確認コードを入力してアカウントの確認を完了しましょう。
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">メールアドレス</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="yamada@example.com"
									required
									{...register("email")}
								/>
								{errors.email && (
									<p className="text-sm text-destructive">
										{errors.email.message}
									</p>
								)}
							</Field>
							<Field>
								<FieldLabel htmlFor="confirmationCode">確認コード</FieldLabel>
								<Input
									id="confirmationCode"
									required
									{...register("confirmationCode")}
								/>
								{errors.confirmationCode && (
									<p className="text-sm text-destructive">
										{errors.confirmationCode.message}
									</p>
								)}
							</Field>
							<FieldGroup>
								<Field>
									<Button type="submit">アカウントを確認</Button>
								</Field>
							</FieldGroup>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
