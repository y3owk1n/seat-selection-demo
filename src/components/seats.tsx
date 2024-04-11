"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "./ui/button";
import { type Seat } from "@/lib/seat";
import { useSeatSelection } from "@/hooks/use-seat-selection";

interface SeatsProps {
	seats: Seat[];
}

function Seats({ seats }: SeatsProps): JSX.Element {
	const [selectedSeat, setSelectedSeat] = useState<Seat[]>([]);

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
						selectedSeat={selectedSeat}
						setSelectedSeat={setSelectedSeat}
					/>
				</div>
			))}
			<pre>{JSON.stringify(selectedSeat, null, 2)}</pre>
		</div>
	);
}

function SeatsColumns(props: {
	seatsByColumn: Record<number, Record<number, Seat[]>>;
	rowKey: number;
	selectedSeat: Seat[];
	setSelectedSeat: Dispatch<SetStateAction<Seat[]>>;
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
	seatsByColumn: Record<number, Record<number, Seat[]>>;
	rowKey: number;
	columnKey: number;
	selectedSeat: Seat[];
	setSelectedSeat: Dispatch<SetStateAction<Seat[]>>;
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
	selectedSeat: Seat[];
	setSelectedSeat: Dispatch<SetStateAction<Seat[]>>;
}): JSX.Element {
	const selected = props.selectedSeat.some(
		(_seat) => _seat.id === props.seat.id,
	);

	function onSelectSeat(): void {
		props.setSelectedSeat((prevSelectedSeat) => {
			if (prevSelectedSeat.some((_seat) => _seat.id === props.seat.id)) {
				return prevSelectedSeat.filter(
					(_seat) => _seat.id !== props.seat.id,
				);
			}

			return [...prevSelectedSeat, props.seat];
		});
	}

	return (
		<Button
			onClick={onSelectSeat}
			disabled={props.seat.status === "occupied"}
			variant={selected ? "default" : "outline"}
			className="size-10 rounded-full"
		>
			{props.seat.id}
		</Button>
	);
}

export { Seats };
