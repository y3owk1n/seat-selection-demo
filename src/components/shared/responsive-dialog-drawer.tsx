"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Button, type buttonVariants } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";

interface BaseProps {
	title: string;
	description?: string;
	children: React.ReactNode;
}

// Props interface when buttonEl exists
interface WithButtonElProps extends BaseProps {
	buttonEl: React.ReactNode;
}

// Props interface when buttonEl does not exist
interface WithoutButtonElProps extends BaseProps {
	buttonStyle?: VariantProps<typeof buttonVariants>["variant"];
	buttonSize?: VariantProps<typeof buttonVariants>["size"];
	buttonClassNames?: string;
	buttonText: string;
}

// Main props interface with conditional typing
type ResponsiveDialogDrawerProps = WithButtonElProps | WithoutButtonElProps;

export function ResponsiveDialogDrawer({
	title,
	description,
	children,
	...props
}: ResponsiveDialogDrawerProps): JSX.Element {
	const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const hasButtonEl = "buttonEl" in props;

	let triggerButton: React.ReactNode;

	if (hasButtonEl) {
		triggerButton = props.buttonEl;
	} else {
		triggerButton = (
			<Button
				variant={props.buttonStyle ?? "default"}
				size={props.buttonSize ?? "default"}
				className={cn(props.buttonClassNames)}
			>
				{props.buttonText}
			</Button>
		);
	}

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>{triggerButton}</DialogTrigger>
				<DialogContent className="sm:max-w-[425px] md:max-w-xl">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						{description ? (
							<DialogDescription>{description}</DialogDescription>
						) : null}
					</DialogHeader>

					<ScrollArea className="max-h-[500px] h-full">
						{children}
					</ScrollArea>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>{title}</DrawerTitle>
					{description ? (
						<DrawerDescription>{description}</DrawerDescription>
					) : null}
				</DrawerHeader>

				<ScrollArea>
					<div className="max-h-[400px] px-4">{children}</div>
				</ScrollArea>
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">Back</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
