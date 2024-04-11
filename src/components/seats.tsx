"use client";

import { Button } from "./ui/button";
import { type Seat } from "@/lib/seat";
import { useSeatSelection } from "@/hooks/use-seat-selection";

interface SeatsProps {
	seats: Seat[];
}

function Seats({ seats }: SeatsProps): JSX.Element {
	const seatSelection = useSeatSelection(seats);

	const seatRows = Object.keys(seatSelection.seatsByRow).map((rowKey) =>
		Number(rowKey),
	);

	return (
		<div className="my-8 border rounded-md p-4">
			{seatRows.map((rowKey) => (
				<div key={rowKey} className="flex mb-4">
					<SeatsColumns
						seatsByColumn={seatSelection.seatsByColumn}
						rowKey={rowKey}
						selectedSeat={seatSelection.selectedSeat}
						onSelectSeat={seatSelection.onSelectSeat}
					/>
				</div>
			))}
			<pre>{JSON.stringify(seatSelection.selectedSeat, null, 2)}</pre>
		</div>
	);
}

function SeatsColumns(props: {
	seatsByColumn: ReturnType<typeof useSeatSelection>["seatsByColumn"];
	rowKey: number;
	selectedSeat: ReturnType<typeof useSeatSelection>["selectedSeat"];
	onSelectSeat: ReturnType<typeof useSeatSelection>["onSelectSeat"];
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
			className="size-10 rounded-full"
		>
			{props.seat.id}
		</Button>
	);
}

export { Seats };
