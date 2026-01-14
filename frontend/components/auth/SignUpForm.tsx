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
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type SignUpFormDataType, SignUpSchema } from "@/validation/signup";

export function SignUpForm({
	onSubmit,
}: {
	onSubmit: (data: SignUpFormDataType) => Promise<void>;
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpFormDataType>({
		resolver: zodResolver(SignUpSchema),
	});

	return (
		<div className="w-full max-w-md">
			<Card>
				<CardHeader>
					<CardTitle>サインアップ</CardTitle>
					<CardDescription>
						アカウントを作成してサービスを始めましょう。
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
								<FieldDescription>
									数字/特殊文字/大文字/小文字を1文字以上含め、8文字以上で設定してください。
								</FieldDescription>
							</Field>
							<FieldGroup>
								<Field>
									<Button type="submit">アカウントを作成</Button>
									<Button variant="outline" asChild>
										<Link href={`/signin`}>
											<p>ログイン</p>
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
