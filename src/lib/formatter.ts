export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "MYR",
		maximumFractionDigits: 0,
	}).format(amount);
}
