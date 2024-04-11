"use client";

import { Button } from "./ui/button";
import { type PickSeatRes, type Seat } from "@/lib/seat";
import { useSeatSelection } from "@/hooks/use-seat-selection";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SeatsProps {
	seats: Seat[];
}

function Seats({ seats }: SeatsProps): JSX.Element {
	const seatSelection = useSeatSelection(seats);

	const [selectionErrorIds, setSelectionErrorIds] = useState<string[]>([]);

	const [isSubmitting, setIsSubmitting] = useState(false);

	const seatRows = Object.keys(seatSelection.seatsByRow).map((rowKey) =>
		Number(rowKey),
	);

	const submitSelectSeat = useCallback(async () => {
		setSelectionErrorIds([]);
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

			if (res.some((r) => !r.success && r.message)) {
				const filteredErrors = res
					.filter((r) => !r.success)
					.map((r) => r.message as string);

				setSelectionErrorIds(
					res.filter((r) => !r.success).map((r) => r.seatId),
				);

				filteredErrors.forEach((error) => toast.error(error));
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		} finally {
			setIsSubmitting(false);
		}
	}, [seatSelection.selectedSeat]);

	return (
		<div className="flex flex-col gap-4">
			<div className="my-8 border flex flex-col gap-4 rounded-md p-4">
				{seatRows.map((rowKey) => (
					<div key={rowKey} className="flex">
						<SeatsColumns
							seatsByColumn={seatSelection.seatsByColumn}
							rowKey={rowKey}
							selectedSeat={seatSelection.selectedSeat}
							onSelectSeat={seatSelection.onSelectSeat}
							errorIds={selectionErrorIds}
						/>
					</div>
				))}
			</div>
			<div>
				<Button
					type="button"
					disabled={
						isSubmitting || !seatSelection.selectedSeat.length
					}
					onClick={submitSelectSeat}
				>
					{isSubmitting ? "..." : "Submit"}
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
}): JSX.Element {
	const columns = Object.keys(props.seatsByColumn[props.rowKey]);

	return (
		<>
			{columns.map((columnKey) => (
				<div key={columnKey} className="flex mr-8">
					<SeatsSeats columnKey={Number(columnKey)} {...props} />
				</div>
			))}
		</>
	);
}

function SeatsSeats(props: {
	seatsByColumn: ReturnType<typeof useSeatSelection>["seatsByColumn"];
	rowKey: number;
	columnKey: number;
	selectedSeat: ReturnType<typeof useSeatSelection>["selectedSeat"];
	onSelectSeat: ReturnType<typeof useSeatSelection>["onSelectSeat"];
	errorIds: string[];
}): JSX.Element {
	const seats =
		props.seatsByColumn[Number(props.rowKey)][Number(props.columnKey)];

	return (
		<div className="flex gap-1">
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
				"size-10 rounded-full",
				props.errorIds.includes(props.seat.id)
					? "ring ring-red-500"
					: "",
			)}
		>
			{props.seat.id}
		</Button>
	);
}

export { Seats };
