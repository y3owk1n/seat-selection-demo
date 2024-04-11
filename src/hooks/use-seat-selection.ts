import { type Seat, getSeatsByColumn, getSeatsByRow } from "@/lib/seat";
import { useState, useCallback } from "react";

export function useSeatSelection(seats: Seat[]): {
	seatsByRow: Record<number, Seat[]>;
	seatsByColumn: Record<number, Record<number, Seat[]>>;
	selectedSeat: Seat[];
	onSelectSeat: (seatId: string) => void;
} {
	const [selectedSeat, setSelectedSeat] = useState<Seat[]>([]);

	const seatsByRow = getSeatsByRow(seats);

	const seatsByColumn = getSeatsByColumn(seatsByRow);

	const onSelectSeat = useCallback(
		(seatId: string) => {
			const seat = seats.find((_seat) => _seat.id === seatId);
			if (!seat) return;

			setSelectedSeat((prevSelectedSeat) => {
				if (prevSelectedSeat.some((_seat) => _seat.id === seatId)) {
					return prevSelectedSeat.filter(
						(_seat) => _seat.id !== seatId,
					);
				}

				return [...prevSelectedSeat, seat];
			});
		},
		[seats],
	);

	return { seatsByRow, seatsByColumn, selectedSeat, onSelectSeat };
}
