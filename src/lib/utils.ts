import { type ClassValue, clsx } from "clsx";
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
