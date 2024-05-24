import { siteConfig } from "@/lib/config";
import { type ClassValue, clsx } from "clsx";
import { type Metadata } from "next";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges multiple class names or class name arrays into a single string.
 *
 * @param inputs - An array of class names, class name arrays, or class name objects.
 * @returns A single string representing the merged class names.
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

/**
 * Creates a shallow clone of an array of objects.
 *
 * @param item - An array of objects to clone.
 * @returns A shallow clone of the input array.
 */
export function clonedArray<T extends object[]>(item: T): T {
	return item.map((i) => ({ ...i })) as T;
}

/**
 * Converts an array of objects with 'key' and 'value' properties into a key-value object.
 *
 * @param  array - The input array of objects with 'key' and 'value' properties.
 * @returns  - The resulting key-value object.
 */
export const arrayToKvObject = (
	array: { key: string; value: string }[],
): Record<string, string> => {
	return array.reduce<Record<string, string>>((result, item) => {
		result[item.key] = item.value;
		return result;
	}, {});
};

/**
 * Constructs a complete URL by combining a base URL and an optional slug.
 *
 * @param  baseUrl - The base URL to which the slug will be appended.
 * @param  slug - An optional slug to be appended to the base URL's path.
 * @returns  The complete URL obtained by combining the base URL and slug.
 * @throws  If the provided base URL is not a valid URL.
 *
 * @example
 * // Returns: "https://example.com/page"
 * getBaseUrl("https://example.com", "page");
 *
 * // Returns: "https://example.com/page/subpage"
 * getBaseUrl("https://example.com", "/page/subpage");
 *
 * // Returns: "https://example.com"
 * getBaseUrl("https://example.com");
 */
export function getBaseUrl(baseUrl: string, slug?: string): string {
	const url = new URL(baseUrl);

	if (slug) {
		if (!slug.startsWith("/")) {
			url.pathname = `${url.pathname}${slug}`;
		} else {
			url.pathname = `${url.pathname}${slug.replace("/", "")}`;
		}
	}

	return url.toString();
}

export function generateCustomMetadata({
	mainTitle,
	maybeSeoTitle,
	maybeSeoDescription,
	slug,
	ogImage,
	ogImageAlt,
	disallowRobotIndex = false,
}: {
	mainTitle: string;
	maybeSeoTitle: string;
	maybeSeoDescription: string;
	slug: string;
	ogImage?: string;
	ogImageAlt?: string;
	disallowRobotIndex?: boolean;
}): Metadata {
	let robotsMeta: Metadata["robots"] = {
		index: true,
		follow: true,
		nocache: false,
	};

	if (disallowRobotIndex) {
		robotsMeta = {
			index: false,
			follow: false,
			nocache: true,
			noarchive: true,
			nosnippet: true,
			noimageindex: true,
			notranslate: true,
			nositelinkssearchbox: true,
			"max-snippet": -1,
			"max-image-preview": "none",
			"max-video-preview": -1,
		};
	}

	return {
		title: mainTitle,
		description: maybeSeoDescription,
		openGraph: {
			type: "website",
			locale: "en_US",
			url: getBaseUrl(siteConfig.url, slug),
			title: maybeSeoTitle,
			description: maybeSeoDescription,
			images: [
				{
					url: ogImage ?? siteConfig.ogImage,
					width: 1200,
					height: 628,
					alt: ogImageAlt ?? siteConfig.name,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: maybeSeoTitle,
			description: maybeSeoDescription,
			images: [ogImage ?? siteConfig.ogImage],
		},
		alternates: {
			canonical: getBaseUrl(siteConfig.url, slug),
		},
		robots: robotsMeta,
	};
}
