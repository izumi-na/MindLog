"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
import { type SignInFormDataType, SignInSchema } from "@/validation/signin";

export function SignInForm({
	onSubmit,
}: {
	onSubmit: (data: SignInFormDataType) => Promise<void>;
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInFormDataType>({
		resolver: zodResolver(SignInSchema),
	});

	return (
		<div className="w-full max-w-md">
			<Card>
				<CardHeader>
					<CardTitle>ログイン</CardTitle>
					<CardDescription>
						アカウントにログインしてサービスを利用しましょう。
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
								<FieldLabel htmlFor="password">パスワード</FieldLabel>
								<Input
									id="password"
									type="password"
									required
									{...register("password")}
								/>
								{errors.password && (
									<p className="text-sm text-destructive">
										{errors.password.message}
									</p>
								)}
							</Field>
							<FieldGroup>
								<Field>
									<Button type="submit">ログイン</Button>
									<Button variant="outline" asChild>
										<Link href={`/signup`}>
											<p>サインアップ</p>
										</Link>
									</Button>
								</Field>
							</FieldGroup>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
