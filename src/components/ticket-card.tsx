export default function TicketCard(): JSX.Element {
	return (
		<div
			role="button"
			className="flex gap-4 bg-muted items-center p-4 rounded-md"
		>
			<span className="w-2 h-10 rounded-md bg-red-500" />
			<div className="flex flex-col gap-1">
				<span className="text-sm font-medium leading-none">VIP</span>
				<span className="text-sm text-muted-foreground">RM 200</span>
			</div>
		</div>
	);
}
