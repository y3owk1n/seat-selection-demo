import { Loader } from "lucide-react";

export default function Loading() {
	return (
		<div className="w-svw h-svh grid place-items-center">
			<div>
				<Loader className="size-10 mx-auto mb-4 animate-spin" />
				<p className="text-center">Loading contents</p>
			</div>
		</div>
	);
}
