import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AmplifyProvider } from "@/contexts/AmplifyProvider";
import { AuthProvider } from "@/contexts/AuthProvider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "MindLog - AI日記アプリ",
	description:
		"日々の出来事や気持ちを記録し、AIがパーソナライズされたアドバイスを提供する日記アプリ",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AmplifyProvider>
					<AuthProvider>{children}</AuthProvider>
				</AmplifyProvider>
				<Toaster richColors />
			</body>
		</html>
	);
}
