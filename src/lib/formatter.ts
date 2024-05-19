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
