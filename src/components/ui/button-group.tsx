"use client";

import { cn } from "@/lib/utils";
import { type HtmlHTMLAttributes, type ReactNode } from "react";

interface ButtonGroupProps extends HtmlHTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

function ButtonGroup({ children, ...props }: ButtonGroupProps): JSX.Element {
	return (
		<div
			className={cn(
				"flex w-full max-w-fit flex-row flex-wrap",
				"[&>*:first-child]:rounded-none [&>*:first-child]:rounded-l-md",
				"[&>*:last-child]:rounded-none [&>*:last-child]:rounded-r-md",
				"[&>*:not(:first-child):not(:last-child)]:rounded-none",
				"[&>*:only-child]:rounded-md",
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export { ButtonGroup };
