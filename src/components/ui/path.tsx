import { cn } from "@/lib/utils";
import * as React from "react";

const PathButton = React.forwardRef<
	SVGPathElement,
	React.ComponentProps<"path">
>(({ className, ...props }, ref) => (
	<path
		tabIndex={0}
		role="button"
		ref={ref}
		className={cn(
			"fill-transparent stroke-primary relative hover:stroke-primary/90",
			className,
		)}
		{...props}
	/>
));

PathButton.displayName = "PathButton";

export { PathButton };
