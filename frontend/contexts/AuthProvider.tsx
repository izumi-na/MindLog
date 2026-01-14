"use client";

import { getCurrentUser } from "aws-amplify/auth";
import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [email, setEmail] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const value = {
		isAuthenticated,
		setIsAuthenticated,
		email,
		setEmail,
		isLoading,
		setIsLoading,
	};

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const { signInDetails } = await getCurrentUser();
				if (signInDetails?.loginId) {
					setEmail(signInDetails.loginId);
					setIsAuthenticated(true);
				}
			} catch (error) {
				setEmail(null);
				setIsAuthenticated(false);
				console.log("ユーザー情報の取得に失敗しました:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchUser();
	}, []);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}
	return context;
};
