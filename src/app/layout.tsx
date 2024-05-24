import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn, getBaseUrl } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import { TRPCReactProvider } from "@/trpc/react";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export const metadata: Metadata = {
	metadataBase: new URL(getBaseUrl(siteConfig.url)),
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name} - MDA Concert`,
	},
	description: siteConfig.description,
	robots: {
		index: true,
		follow: true,
		nocache: false,
	},
	creator: "Mustang Dance Academy",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: getBaseUrl(siteConfig.url),
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name,
		images: [
			{
				url: siteConfig.ogImage,
				width: 1200,
				height: 628,
				alt: siteConfig.name,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
		images: [siteConfig.ogImage],
	},
	// icons: {
	// 	other: [
	// 		{
	// 			rel: "mask-icon",
	// 			url: "/safari-pinned-tab.svg",
	// 			color: "#274b50",
	// 		},
	// 	],
	// },
	alternates: {
		canonical: getBaseUrl(siteConfig.url),
	},
	// manifest: "/site.webmanifest",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>): JSX.Element {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable,
				)}
			>
				<TRPCReactProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
						<Toaster expand richColors closeButton />
					</ThemeProvider>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
