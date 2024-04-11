import { type Seat, getSeatsByColumn, getSeatsByRow } from "@/lib/seat";

export function useSeatSelection(seats: Seat[]): {
	seatsByRow: Record<number, Seat[]>;
	seatsByColumn: Record<number, Record<number, Seat[]>>;
} {
	const seatsByRow = getSeatsByRow(seats);

	const seatsByColumn = getSeatsByColumn(seatsByRow);

	return { seatsByRow, seatsByColumn };
}
