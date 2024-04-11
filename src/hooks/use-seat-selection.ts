import { type Seat, getSeatsByColumn, getSeatsByRow } from "@/lib/seat";
import { type Dispatch, type SetStateAction, useState } from "react";

export function useSeatSelection(seats: Seat[]): {
	seatsByRow: Record<number, Seat[]>;
	seatsByColumn: Record<number, Record<number, Seat[]>>;
	selectedSeat: Seat[];
	setSelectedSeat: Dispatch<SetStateAction<Seat[]>>;
} {
	const [selectedSeat, setSelectedSeat] = useState<Seat[]>([]);

	const seatsByRow = getSeatsByRow(seats);

	const seatsByColumn = getSeatsByColumn(seatsByRow);

	return { seatsByRow, seatsByColumn, selectedSeat, setSelectedSeat };
}
