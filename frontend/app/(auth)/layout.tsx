import { UnProtectedRoute } from "@/components/auth/UnProtectedRoute";

export default function UnProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <UnProtectedRoute>{children}</UnProtectedRoute>;
}
