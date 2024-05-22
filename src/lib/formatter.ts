/**
 * Formats a numeric amount into a currency string.
 *
 * @param amount - The numeric amount to format.
 * @returns A string representing the formatted currency.
 */
export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "MYR",
		maximumFractionDigits: 2,
	}).format(amount);
}

/**
 * Formats a search term by converting it to lowercase, adding spaces around '(',
 * removing extra whitespaces, and replacing whitespaces with '|'.
 *
 * @param  options - The options for formatting the search term.
 * @param  searchTerm - The search term to be formatted.
 * @returns  - The formatted search term.
 */
export function searchStrFormatter({
	searchTerm,
}: {
	searchTerm: string;
}): string {
	const formattedSearchTerm = searchTerm
		.toLowerCase()
		.replace(/\(/g, " (") // find all "(" and make it into " (", this will add one more space for string like " (something)"
		.trim() // In case the starting search is "(", the above format will add a starting white space, and we need to trim it
		.replace(/\s+/g, " ") // remave all of the white spaces to a single (" ")
		.replace(/ /g, " | "); // replace all of the (" ") to (" | ")

	return formattedSearchTerm;
}
