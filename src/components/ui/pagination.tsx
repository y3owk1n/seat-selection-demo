import {
	ChevronLeftIcon,
	ChevronRightIcon,
	DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import * as React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
	<nav
		role="navigation"
		aria-label="pagination"
		className={cn("mx-auto flex w-full justify-center", className)}
		{...props}
	/>
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
	HTMLUListElement,
	React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
	<ul
		ref={ref}
		className={cn("flex flex-row items-center gap-1", className)}
		{...props}
	/>
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
	HTMLLIElement,
	React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
	<li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationButtonProps = {
	isActive?: boolean;
} & Pick<ButtonProps, "size"> &
	React.ComponentProps<typeof Button>;

const PaginationButton = ({
	className,
	isActive,
	size = "icon",
	...props
}: PaginationButtonProps) => (
	<Button
		aria-current={isActive ? "page" : undefined}
		variant={isActive ? "outline" : "ghost"}
		size={size}
		className={cn(className)}
		{...props}
	/>
);
PaginationButton.displayName = "PaginationButton";

const PaginationFirst = ({
	className,
	...props
}: React.ComponentProps<typeof PaginationButton>) => (
	<PaginationButton
		aria-label="Go to first page"
		size="icon"
		className={cn("gap-1", className)}
		{...props}
	>
		<ChevronsLeft className="h-4 w-4" />
	</PaginationButton>
);
PaginationFirst.displayName = "PaginationFirst";

const PaginationPrevious = ({
	className,
	...props
}: React.ComponentProps<typeof PaginationButton>) => (
	<PaginationButton
		aria-label="Go to previous page"
		size="icon"
		className={cn("gap-1", className)}
		{...props}
	>
		<ChevronLeftIcon className="h-4 w-4" />
	</PaginationButton>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
	className,
	...props
}: React.ComponentProps<typeof PaginationButton>) => (
	<PaginationButton
		aria-label="Go to next page"
		size="icon"
		className={cn("gap-1", className)}
		{...props}
	>
		<ChevronRightIcon className="h-4 w-4" />
	</PaginationButton>
);
PaginationNext.displayName = "PaginationNext";

const PaginationLast = ({
	className,
	...props
}: React.ComponentProps<typeof PaginationButton>) => (
	<PaginationButton
		aria-label="Go to last page"
		size="icon"
		className={cn("gap-1", className)}
		{...props}
	>
		<ChevronsRight className="h-4 w-4" />
	</PaginationButton>
);
PaginationLast.displayName = "PaginationLast";

const PaginationEllipsis = ({
	className,
	...props
}: React.ComponentProps<"span">) => (
	<span
		aria-hidden
		className={cn("flex h-9 w-9 items-center justify-center", className)}
		{...props}
	>
		<DotsHorizontalIcon className="h-4 w-4" />
		<span className="sr-only">More pages</span>
	</span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationFirst,
	PaginationPrevious,
	PaginationNext,
	PaginationLast,
	PaginationEllipsis,
};
