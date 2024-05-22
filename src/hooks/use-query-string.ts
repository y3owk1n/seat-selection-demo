"use client";

import { arrayToKvObject } from "@/lib/utils";
import { type Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type DependencyList, useCallback, useMemo } from "react";

/**
 * Custom hook to manage query strings
 * @param  deps - Dependency list
 * @returns  - An object containing the redirectWithQs and params functions
 */
export function useQueryString(deps?: DependencyList): {
	redirectWithQs: (key: string, value: string) => void;
	params: URLSearchParams;
} {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const params = useMemo(
		() => new URLSearchParams(searchParams as unknown as URLSearchParams),
		[searchParams],
	);

	const createQueryString = useCallback(
		(queryParams: Record<string, string>) => {
			// Iterate through each key-value pair in the queryParams object
			for (const [key, value] of Object.entries(queryParams)) {
				if (params.has(key)) {
					// Update the value of an existing query string
					params.set(key, value);
				} else {
					// Append a new key-value pair to the query string
					params.append(key, value);
				}
			}

			// Create the updated URL with the modified query string
			return params.toString();
		},
		[params],
	);

	const createQueryStringWithUrl = useCallback(
		(key: string, value: string) => {
			const href = `${pathname}?${createQueryString(
				arrayToKvObject([
					{
						key,
						value,
					},
				]),
			)}` as Route;
			return href;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps, no-constant-binary-expression, @typescript-eslint/no-unnecessary-condition --- its fine
		[deps] ?? [],
	);

	const redirectWithQs = useCallback((key: string, value: string) => {
		router.push(createQueryStringWithUrl(key, value));
		// eslint-disable-next-line react-hooks/exhaustive-deps --- its fine
	}, deps ?? []);

	return { redirectWithQs, params };
}
