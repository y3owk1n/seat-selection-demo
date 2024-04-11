type SeatStatus = "empty" | "occupied" | "temp-occupied";

export interface Seat {
	id: string;
	column: number;
	row: number;
	/**
	 * Index from left of its own sections and it should start from 1
	 */
	indexFromLeft: number;
	status: SeatStatus;
}

export function getSeatsByRow(seats: Seat[]): Record<number, Seat[]> {
	const seatsByRow = seats.reduce<Record<number, Seat[]>>((acc, seat) => {
		const { row } = seat;
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition --- its fine
		acc[row] = acc[row] || [];
		acc[row].push(seat);
		return acc;
	}, {});

	return seatsByRow;
}

export function getSeatsByColumn(
	seatsByRow: Record<number, Seat[]>,
): Record<number, Record<number, Seat[]>> {
	const seatsByColumn: Record<number, Record<number, Seat[]>> = Object.keys(
		seatsByRow,
	).reduce<Record<number, Record<number, Seat[]>>>((acc, rowKey) => {
		const rowSeats = seatsByRow[Number(rowKey)];
		acc[Number(rowKey)] = rowSeats.reduce<Record<number, Seat[]>>(
			(rowAcc, seat) => {
				const { column } = seat;
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition --- its fine
				rowAcc[column] = rowAcc[column] || [];
				rowAcc[column].push(seat);
				return rowAcc;
			},
			{},
		);
		return acc;
	}, {});

	return seatsByColumn;
}
