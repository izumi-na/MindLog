"use client";

import { Amplify } from "aws-amplify";

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

if (!userPoolId || !userPoolClientId) {
	throw new Error("Cognito configuration is not defined");
}

Amplify.configure(
	{
		Auth: {
			Cognito: {
				userPoolId,
				userPoolClientId,
				loginWith: { email: true },
			},
		},
	},
	{ ssr: true },
);

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
