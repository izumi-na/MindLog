"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthProvider";
import { Loading } from "../common/Loading";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const route = useRouter();
	const { isAuthenticated, isLoading } = useAuthContext();
	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			route.push("/signin");
		}
	}, [isAuthenticated, isLoading, route]);

	if (isLoading) {
		return <Loading />;
	}
	if (!isAuthenticated) {
		return null;
	}

	return <>{children}</>;
}
