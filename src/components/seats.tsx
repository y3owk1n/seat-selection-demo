"use client";

import { useSeatSelection } from "@/hooks/use-seat-selection";
import { formatCurrency } from "@/lib/formatter";
import { type PickSeatRes, type Seat } from "@/lib/seat";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface SeatsProps {
	seats: Seat[];
}

function Seats({ seats }: SeatsProps): JSX.Element {
	const seatSelection = useSeatSelection(seats);

	const [isSubmitting, setIsSubmitting] = useState(false);

	const seatRows = Object.keys(seatSelection.seatsByRow).map((rowKey) =>
		Number(rowKey),
	);

	const submitSelectSeat = useCallback(async () => {
		seatSelection.setSelectionErrorIds([]);
		seatSelection.setSelectionSuccessIds([]);
		setIsSubmitting(true);
		const selectedSeatsIds = seatSelection.selectedSeat.map(
			(seat) => seat.id,
		);

		try {
			const rawRes = await fetch("/api/select-seat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ selectedSeatsIds }),
			});

			const res = (await rawRes.json()) as PickSeatRes[];

			if (!rawRes.ok) {
				toast.error("Something went wrong. Please try again later.");
				return;
			}

			const filteredErrors = res.filter((r) => !r.success);

			const filteredSuccess = res.filter((r) => r.success);

			if (filteredErrors.length) {
				seatSelection.setSelectionErrorIds(
					filteredErrors.map((r) => r.seatId),
				);

				filteredErrors
					.map((r) => r.message as string)
					.forEach((error) =>
						toast.error("Error From Server", {
							description: error,
						}),
					);
			}
			seatSelection.setSelectionSuccessIds(
				filteredSuccess.map((r) => r.seatId),
			);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		} finally {
			setIsSubmitting(false);
		}
	}, [seatSelection]);

	return (
		<div className="flex flex-col gap-4">
			<ScrollArea className="my-8 border whitespace-nowrap rounded-md p-4">
				<div className="flex flex-col items-center gap-4">
					<div className="bg-muted rounded w-52 h-10 grid items-center text-center">
						Stage
					</div>
					{seatRows.map((rowKey) => (
						<div key={rowKey} className="flex">
							<SeatsColumns
								seatsByColumn={seatSelection.seatsByColumn}
								rowKey={rowKey}
								selectedSeat={seatSelection.selectedSeat}
								onSelectSeat={seatSelection.onSelectSeat}
								errorIds={seatSelection.selectionErrorIds}
								successIds={seatSelection.selectionSuccessIds}
							/>
						</div>
					))}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
			<div className="flex justify-center">
				<Button
					type="button"
					disabled={
						isSubmitting || !seatSelection.selectedSeat.length
					}
					onClick={submitSelectSeat}
				>
					{isSubmitting
						? "..."
						: `Buy Now - ${formatCurrency(
								seatSelection.totalAmountForSeats,
							)}`}
				</Button>
			</div>
		</div>
	);
}

function SeatsColumns(props: {
	seatsByColumn: ReturnType<typeof useSeatSelection>["seatsByColumn"];
	rowKey: number;
	selectedSeat: ReturnType<typeof useSeatSelection>["selectedSeat"];
	onSelectSeat: ReturnType<typeof useSeatSelection>["onSelectSeat"];
	errorIds: string[];
	successIds: string[];
}): JSX.Element {
	const columns = Object.keys(props.seatsByColumn[props.rowKey]);

	return (
		<div className="flex gap-8">
			{columns.map((columnKey) => (
				<div key={columnKey} className="flex">
					<SeatsSeats columnKey={Number(columnKey)} {...props} />
				</div>
			))}
		</div>
	);
}

function SeatsSeats(props: {
	seatsByColumn: ReturnType<typeof useSeatSelection>["seatsByColumn"];
	rowKey: number;
	columnKey: number;
	selectedSeat: ReturnType<typeof useSeatSelection>["selectedSeat"];
	onSelectSeat: ReturnType<typeof useSeatSelection>["onSelectSeat"];
	errorIds: string[];
	successIds: string[];
}): JSX.Element {
	const seats =
		props.seatsByColumn[Number(props.rowKey)][Number(props.columnKey)];

	return (
		<div className="flex gap-2">
			{seats.map((seat) => (
				<SeatsSeat key={seat.id} seat={seat} {...props} />
			))}
		</div>
	);
}

function SeatsSeat(props: {
	seat: Seat;
	rowKey: number;
	columnKey: number;
	selectedSeat: ReturnType<typeof useSeatSelection>["selectedSeat"];
	onSelectSeat: ReturnType<typeof useSeatSelection>["onSelectSeat"];
	errorIds: string[];
	successIds: string[];
}): JSX.Element {
	const selected = props.selectedSeat.some(
		(_seat) => _seat.id === props.seat.id,
	);

	return (
		<Button
			onClick={() => {
				props.onSelectSeat(props.seat.id);
			}}
			disabled={props.seat.status === "occupied"}
			variant={selected ? "default" : "outline"}
			className={cn(
				"size-14 rounded-full flex flex-col",
				props.errorIds.includes(props.seat.id)
					? "ring ring-red-500"
					: "",
				props.successIds.includes(props.seat.id)
					? "ring ring-green-500"
					: "",
			)}
		>
			<span className="font-bold">{props.seat.id}</span>
			<span className="text-[8px] text-muted-foreground">
				{formatCurrency(props.seat.price)}
			</span>
		</Button>
	);
}

export { Seats };
