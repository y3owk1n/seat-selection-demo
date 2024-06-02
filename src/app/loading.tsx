import { Loader } from "lucide-react";

export default function Loading() {
	return (
		<div className="grid h-svh w-svw place-items-center">
			<div>
				<Loader className="mx-auto mb-4 size-10 animate-spin" />
				<p className="text-center">Loading contents</p>
			</div>
		</div>
	);
}
