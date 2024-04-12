import { formatCurrency } from "@/lib/formatter";
import { type Seat } from "@/lib/seat";
import { type Ticket } from "@/lib/ticket";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction } from "react";
import { Separator } from "./ui/separator";

interface TicketCardProps {
	seats: Seat[];
	ticket: Ticket;
	selectedTicket: string | null;
	setSelectedTicket: Dispatch<SetStateAction<string | null>>;
	selectionErrorIds: string[];
	selectionSuccessIds: string[];
}

export default function TicketCard(props: TicketCardProps): JSX.Element {
	const router = useRouter();

	const isSelected = props.selectedTicket === props.ticket.id;

	const selectedErrorDetails = props.seats.filter((seat) => {
		return (
			props.selectionErrorIds.includes(seat.id) &&
			seat.category === props.ticket.category
		);
	});

	const selectedErrorCount = selectedErrorDetails.length;

	const selectedSuccessDetails = props.seats.filter((seat) => {
		return (
			props.selectionSuccessIds.includes(seat.id) &&
			seat.category === props.ticket.category
		);
	});

	const selectedSuccessCount = selectedSuccessDetails.length;

	function onSelectTicket(): void {
		if (props.selectedTicket === props.ticket.id) {
			props.setSelectedTicket(null);
		} else {
			props.setSelectedTicket(props.ticket.id);
			router.push("#seat-selection");
		}
	}

	return (
		<div
			tabIndex={0}
			role="button"
			className={cn(
				"flex gap-4 bg-muted hover:bg-muted/90 items-center p-4 rounded-md",
			)}
			onClick={onSelectTicket}
		>
			<div className="flex gap-4 items-center flex-1">
				<span
					className="w-2 h-10 rounded-md"
					style={{ backgroundColor: props.ticket.color }}
				/>
				<div className="flex flex-col gap-1">
					<span className="text-sm font-medium leading-none">
						{props.ticket.label}
					</span>
					<span className="text-sm text-muted-foreground">
						{formatCurrency(props.ticket.price)}
					</span>
				</div>
			</div>

			<div className="flex gap-4 items-center">
				{selectedSuccessCount > 0 && (
					<div className="border border-green-500 text-green-500 size-8 grid place-items-center transition-all rounded-full">
						{selectedSuccessCount}
					</div>
				)}

				{selectedErrorCount > 0 && (
					<div className="border border-red-500 text-red-500 size-8 grid place-items-center transition-all rounded-full">
						{selectedErrorCount}
					</div>
				)}

				<Separator
					orientation="vertical"
					className="h-8 bg-muted-foreground/30"
				/>

				<div
					className={cn(
						"bg-green-700 size-8 grid place-items-center opacity-0 transition-all rounded-full",
						isSelected && "opacity-100",
					)}
				>
					<CheckIcon className="size-4 text-white" />
				</div>
			</div>
		</div>
	);
}
