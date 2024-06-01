"use client";
import { useState } from "react";

import useCopyToClipboard from "@/hooks/use-copy-to-clipboard";
import useIsWebview from "@/hooks/use-is-webview";
import { AlertCircle, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { Icons } from "../icons";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

export function GoogleButton(): JSX.Element {
	const isWebView = useIsWebview();
	const [, copyToClipboard] = useCopyToClipboard();
	const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

	return (
		<div className="grid gap-2">
			<Button
				variant="default"
				className="w-full"
				onClick={async () => {
					if (isWebView) {
						return;
					}
					setIsGoogleLoading(true);
					await signIn("google");
				}}
				disabled={isGoogleLoading || isWebView}
			>
				{isGoogleLoading ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<Icons.Google className="mr-2 h-4 w-4" />
				)}
				Sign in with Google
			</Button>
			{isWebView ? (
				<Alert variant="destructive-fill">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>
						Why do I not able to Sign in with Google?
					</AlertTitle>
					<AlertDescription>
						Google do not allow to login via apps webview (Browser
						within apps e.g. Instagram, Twitter, etc.) Please
						consider to open this site in your system browser (e.g.
						Chrome, Firefox, Safari, etc.)
					</AlertDescription>
					<AlertDescription className="mt-2">
						<Button
							className="p-0 font-bold underline"
							variant="link"
							onClick={() =>
								copyToClipboard(
									"https://concert.mustangdanceacademy.com",
								)
							}
						>
							Click here to copy the link
						</Button>
					</AlertDescription>
				</Alert>
			) : null}
		</div>
	);
}
