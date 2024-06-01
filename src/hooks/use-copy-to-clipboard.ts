import { useCallback, useState } from "react";
import { toast } from "sonner";

function oldSchoolCopy(text: string) {
	const tempTextArea = document.createElement("textarea");
	tempTextArea.value = text;
	document.body.appendChild(tempTextArea);
	tempTextArea.select();
	document.execCommand("copy");
	document.body.removeChild(tempTextArea);
}

export default function useCopyToClipboard(): [
	string | null,
	(value: string) => void,
] {
	const [state, setState] = useState<string | null>(null);

	const copyToClipboard = useCallback((value: string) => {
		async function handleCopy() {
			try {
				if (navigator?.clipboard?.writeText) {
					await navigator.clipboard.writeText(value);
					setState(value);

					toast.success("Copied!", {
						description: `Copied ${value} to clipboard`,
					});
				} else {
					toast.error("Error", {
						description:
							"writeText is not supported in your system",
					});
				}
			} catch (e) {
				oldSchoolCopy(value);
				setState(value);
				toast.success("Copied!", {
					description: `Copied ${value} to clipboard`,
				});
			}
		}

		void handleCopy();
	}, []);

	return [state, copyToClipboard];
}
