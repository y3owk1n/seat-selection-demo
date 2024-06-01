import { useEffect, useState } from "react";

interface NavigatorWithStandalone extends Navigator {
	standalone: boolean;
}

export default function useIsWebview(): boolean {
	const [isWebview, setIsWebview] = useState<boolean>(false);

	useEffect(() => {
		const checkIsWebview = (): boolean => {
			if (typeof window === "undefined") {
				return false;
			}

			const { navigator } = window;

			if (!navigator) {
				return false;
			}

			const standalone = (navigator as NavigatorWithStandalone)
				.standalone; // `standalone` is specific to iOS
			const userAgent = navigator.userAgent.toLowerCase();
			const safari =
				/safari/.test(userAgent) && !/crios|fxios/.test(userAgent); // Exclude Chrome and Firefox on iOS
			const ios = /iphone|ipod|ipad/.test(userAgent);
			const android = /android/.test(userAgent);

			if (ios) {
				return !standalone && !safari;
			}

			if (android) {
				return (
					/\bwv\b/.test(userAgent) || // Standard Android WebView indicator
					/version\/[\d.]+.*chrome\/[\d.]+ mobile safari\/[\d.]+/.test(
						userAgent,
					) || // Samsung Internet
					(/version\/[\d.]+.*safari\/[\d.]+/.test(userAgent) &&
						!/chrome|crios|fxios/.test(userAgent)) || // Generic Android WebView
					/; wv\)/.test(userAgent) || // Chrome WebView
					(/\bchrome\/[\d.]+ mobile\b/.test(userAgent) &&
						!/safari/.test(userAgent)) // More generic Android WebView
				);
			}

			return false;
		};

		setIsWebview(checkIsWebview());
	}, []);

	return isWebview;
}
