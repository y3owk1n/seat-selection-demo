"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface BackButtonProps {
	title: string;
}

export default function BackButton(props: BackButtonProps) {
	const router = useRouter();

	return (
		<Button variant="link" size="link" onClick={() => router.back()}>
			<ArrowLeft className="mr-2 size-4" /> Back to {props.title}
		</Button>
	);
}
