type SeatStatus = "empty" | "occupied" | "temp-occupied" | null;

export interface Seat {
	id: string;
	column: number;
	row: number;
	/**
	 * Index from left of its own sections and it should start from 1
	 */
	indexFromLeft: number;
	status: SeatStatus;
	price: number;
}

export const initialSeatData: Seat[] = [
	{
		id: "A1",
		column: 1,
		row: 1,
		indexFromLeft: 1,
		status: "empty",
		price: 100,
	},
	{
		id: "A2",
		column: 1,
		row: 1,
		indexFromLeft: 2,
		status: "empty",
		price: 100,
	},
	{
		id: "A3",
		column: 1,
		row: 1,
		indexFromLeft: 3,
		status: "empty",
		price: 100,
	},
	{
		id: "A4",
		column: 1,
		row: 1,
		indexFromLeft: 4,
		status: "empty",
		price: 100,
	},
	{
		id: "A5",
		column: 1,
		row: 1,
		indexFromLeft: 5,
		status: "occupied",
		price: 100,
	},
	{
		id: "A6",
		column: 2,
		row: 1,
		indexFromLeft: 1,
		status: "empty",
		price: 100,
	},
	{
		id: "A7",
		column: 2,
		row: 1,
		indexFromLeft: 2,
		status: "empty",
		price: 100,
	},
	{
		id: "A8",
		column: 2,
		row: 1,
		indexFromLeft: 3,
		status: "occupied",
		price: 100,
	},
	{
		id: "A9",
		column: 2,
		row: 1,
		indexFromLeft: 4,
		status: "empty",
		price: 100,
	},
	{
		id: "A10",
		column: 2,
		row: 1,
		indexFromLeft: 5,
		status: "empty",
		price: 100,
	},

	{
		id: "B1",
		column: 1,
		row: 2,
		indexFromLeft: 1,
		status: "empty",
		price: 80,
	},
	{
		id: "B2",
		column: 1,
		row: 2,
		indexFromLeft: 2,
		status: "occupied",
		price: 80,
	},
	{
		id: "B3",
		column: 1,
		row: 2,
		indexFromLeft: 3,
		status: "occupied",
		price: 80,
	},
	{
		id: "B4",
		column: 1,
		row: 2,
		indexFromLeft: 4,
		status: "empty",
		price: 80,
	},
	{
		id: "B5",
		column: 1,
		row: 2,
		indexFromLeft: 5,
		status: "empty",
		price: 80,
	},
	{
		id: "B6",
		column: 2,
		row: 2,
		indexFromLeft: 1,
		status: "empty",
		price: 80,
	},
	{
		id: "B7",
		column: 2,
		row: 2,
		indexFromLeft: 2,
		status: "empty",
		price: 80,
	},
	{
		id: "B8",
		column: 2,
		row: 2,
		indexFromLeft: 3,
		status: "empty",
		price: 80,
	},
	{
		id: "B9",
		column: 2,
		row: 2,
		indexFromLeft: 4,
		status: "empty",
		price: 80,
	},
	{
		id: "B10",
		column: 2,
		row: 2,
		indexFromLeft: 5,
		status: "empty",
		price: 80,
	},

	{
		id: "C1",
		column: 1,
		row: 3,
		indexFromLeft: 1,
		status: "empty",
		price: 50,
	},
	{
		id: "C2",
		column: 1,
		row: 3,
		indexFromLeft: 2,
		status: "occupied",
		price: 50,
	},
	{
		id: "C3",
		column: 1,
		row: 3,
		indexFromLeft: 3,
		status: "occupied",
		price: 50,
	},
	{
		id: "C4",
		column: 2,
		row: 3,
		indexFromLeft: 1,
		status: "empty",
		price: 50,
	},
	{
		id: "C5",
		column: 2,
		row: 3,
		indexFromLeft: 2,
		status: "empty",
		price: 50,
	},
	{
		id: "C6",
		column: 2,
		row: 3,
		indexFromLeft: 3,
		status: "occupied",
		price: 50,
	},
	{
		id: "C7",
		column: 2,
		row: 3,
		indexFromLeft: 4,
		status: "occupied",
		price: 50,
	},
	{
		id: "C8",
		column: 3,
		row: 3,
		indexFromLeft: 1,
		status: "empty",
		price: 50,
	},
	{
		id: "C9",
		column: 3,
		row: 3,
		indexFromLeft: 2,
		status: "empty",
		price: 50,
	},
	{
		id: "C10",
		column: 3,
		row: 3,
		indexFromLeft: 3,
		status: "empty",
		price: 50,
	},
];

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

function isOccupied(seatStatus: Seat["status"]): boolean {
	return seatStatus === "occupied" || seatStatus === "temp-occupied";
}

export interface PickSeatRes {
	success: boolean;
	seatId: string;
	message?: string;
}

export function pickSeats(
	seats: Seat[],
	seatsToSelect: string[],
): PickSeatRes[] {
	const clonedSeats: Seat[] = JSON.parse(JSON.stringify(seats)) as Seat[];

	const results: PickSeatRes[] = [];

	// update the selected seats to temp occupied
	const clonedSeatsWithTempOccupied = clonedSeats.map((seat) => ({
		...seat,
		status:
			seatsToSelect.includes(seat.id) && seat.status === "empty"
				? "temp-occupied"
				: seat.status,
	}));

	for (const seatIdx of seatsToSelect) {
		const seat = clonedSeatsWithTempOccupied.find(
			(_seat) => _seat.id === seatIdx,
		);

		if (!seat) {
			// Handle error if seat is not found
			results.push({
				seatId: seatIdx,
				success: false,
				message: `Error: Seat ${seatIdx} not found.`,
			});
			continue;
		}

		const currentSection = clonedSeatsWithTempOccupied.filter(
			(_seat) => _seat.column === seat.column && _seat.row === seat.row,
		);

		const seatIndex = currentSection.findIndex(
			(_seat) => _seat.id === seat.id,
		);

		const seatIndexInArray = seatIndex;

		// Check if the seat index is within the bounds of the seats array
		if (seatIndexInArray < 0 || seatIndexInArray >= currentSection.length) {
			results.push({
				seatId: seatIdx,
				success: false,
				message: `Error: Seat index ${seatIdx} is out of bounds.`,
			});
			continue;
		}

		// Check if the seat is already occupied
		if (currentSection[seatIndexInArray].status !== "temp-occupied") {
			results.push({
				seatId: seatIdx,
				success: false,
				message: `Error: Seat ${seatIdx} is already occupied.`,
			});
			continue;
		}

		// Check if there is a single seat left and right
		const leftLeftSeatIndex = seatIndexInArray - 2;
		const leftSeatIndex = seatIndexInArray - 1;
		const rightSeatIndex = seatIndexInArray + 1;
		const rightRightSeatIndex = seatIndexInArray + 2;

		const leftLeftSeatStatus: Seat["status"] =
			leftLeftSeatIndex >= 0
				? currentSection[leftLeftSeatIndex].status
				: "occupied"; // Treat out-of-bounds seats as occupied
		const rightRightSeatStatus: Seat["status"] =
			rightRightSeatIndex < currentSection.length
				? currentSection[rightRightSeatIndex].status
				: "occupied"; // Treat out-of-bounds seats as occupied

		// if (
		// 	(isOccupied(leftLeftSeatStatus) && leftSeatIndex >= 0) ||
		// 	(isOccupied(rightRightSeatStatus) &&
		// 		rightSeatIndex < currentSection.length)
		// ) {
		// 	console.log("item 1");
		// 	if (
		// 		currentSection[leftSeatIndex].status === "empty" &&
		// 		rightSeatIndex < currentSection.length &&
		// 		currentSection[rightSeatIndex].status === "empty"
		// 	) {
		// 		results.push({
		// 			success: false,
		// 			message: `Error 1: Selecting seat ${seatIdx} would leave a single seat left or right.`,
		// 		});
		// 		continue;
		// 	}
		// }

		if (
			isOccupied(leftLeftSeatStatus) &&
			isOccupied(rightRightSeatStatus) &&
			leftSeatIndex >= 0 &&
			rightSeatIndex < currentSection.length
		) {
			if (
				(currentSection[leftSeatIndex].status === "empty" &&
					rightSeatIndex < currentSection.length &&
					isOccupied(currentSection[rightSeatIndex].status)) ||
				(isOccupied(currentSection[leftSeatIndex].status) &&
					rightSeatIndex < currentSection.length &&
					currentSection[rightSeatIndex].status === "empty") ||
				(currentSection[leftSeatIndex].status === "empty" &&
					rightSeatIndex < currentSection.length &&
					currentSection[rightSeatIndex].status === "empty")
			) {
				results.push({
					seatId: seatIdx,
					success: false,
					message: `Selecting seat ${seatIdx} would leave a single seat left or right.`,
				});
				continue;
			}
		}

		if (isOccupied(leftLeftSeatStatus) && leftSeatIndex >= 0) {
			if (
				rightSeatIndex >= seatIndexInArray &&
				// isOccupied(clonedSeatsWithTempOccupied[leftSeatIndex].status) &&
				// leftSeatIndex < currentSection.length &&
				currentSection[leftSeatIndex].status === "empty"
			) {
				results.push({
					seatId: seatIdx,
					success: false,
					message: `Selecting seat ${seatIdx} would leave a single seat left or right.`,
				});
				continue;
			}
		}

		if (
			isOccupied(rightRightSeatStatus) &&
			rightSeatIndex < currentSection.length
		) {
			if (
				// leftSeatIndex <= seatIndexInArray &&
				// rightSeatIndex > seatIndexInArray &&
				currentSection[rightSeatIndex].status === "empty"
			) {
				results.push({
					seatId: seatIdx,
					success: false,
					message: `Selecting seat ${seatIdx} would leave a single seat left or right.`,
				});
				continue;
			}
		}

		// If no errors encountered, return success
		results.push({ success: true, seatId: seatIdx });
	}

	return results;
}

export function toggleSeat(
	prevSelectedSeats: Seat[],
	currentSelectedSeat: Seat,
): Seat[] {
	if (
		prevSelectedSeats.some((_seat) => _seat.id === currentSelectedSeat.id)
	) {
		return prevSelectedSeats.filter(
			(_seat) => _seat.id !== currentSelectedSeat.id,
		);
	}

	return [...prevSelectedSeats, currentSelectedSeat];
}
