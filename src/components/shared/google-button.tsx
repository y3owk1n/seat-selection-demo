"use client";
import { useState } from "react";

import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { Icons } from "../icons";
import { Button } from "../ui/button";

export function GoogleButton(): JSX.Element {
	const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

	return (
		<Button
			variant="default"
			className="w-full"
			onClick={async () => {
				setIsGoogleLoading(true);
				await signIn("google");
			}}
			disabled={isGoogleLoading}
		>
			{isGoogleLoading ? (
				<Loader2 className="mr-2 h-4 w-4 animate-spin" />
			) : (
				<Icons.Google className="mr-2 h-4 w-4" />
			)}
			Sign in with Google
		</Button>
	);
}
