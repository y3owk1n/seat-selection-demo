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

export interface PickSeatRes {
	success: boolean;
	seatId: string;
	message?: string;
}

function clonedArray<T extends object[]>(item: T): T {
	return item.map((i) => ({ ...i })) as T;
}

function updateSeatsWithTempOccupied(
	seats: Seat[],
	seatsToSelect: string[],
): Seat[] {
	return seats.map((seat) => ({
		...seat,
		status:
			seatsToSelect.includes(seat.id) && seat.status === "empty"
				? "temp-occupied"
				: seat.status,
	}));
}

function getCurrentSeat(seat: Seat[], seatId: string): Seat | undefined {
	return seat.find((_seat) => _seat.id === seatId);
}

function getCurrentSection(seat: Seat[], column: number, row: number): Seat[] {
	return seat.filter((_seat) => _seat.column === column && _seat.row === row);
}

function getSeatIndex(seat: Seat[], seatId: string): number {
	return seat.findIndex((_seat) => _seat.id === seatId);
}

function isSeatOutOfBounds(section: Seat[], seatIndex: number): boolean {
	return seatIndex < 0 || seatIndex >= section.length;
}

function isSeatEmptyByIndex(section: Seat[], index: number): boolean {
	return section[index].status === "empty";
}

function isLeftSeatWithinBounds(leftSeatIndex: number): boolean {
	return leftSeatIndex >= 0;
}

function isLeftSeatEmptyRightSeatWithinBoundsAndOccupied(
	currentSection: Seat[],
	leftSeatIndex: number,
	rightSeatIndex: number,
): boolean {
	return (
		isSeatEmptyByIndex(currentSection, leftSeatIndex) &&
		isRightSeatWithinBounds(currentSection, rightSeatIndex) &&
		isOccupied(currentSection[rightSeatIndex].status)
	);
}

function isRightSeatWithinBoundsLeftAndRightSeatEmpty(
	currentSection: Seat[],
	leftSeatIndex: number,
	rightSeatIndex: number,
): boolean {
	return (
		isSeatEmptyByIndex(currentSection, leftSeatIndex) &&
		isRightSeatWithinBounds(currentSection, rightSeatIndex) &&
		isSeatEmptyByIndex(currentSection, rightSeatIndex)
	);
}

function isRightSeatWithinBoundsLeftSeatEmptyAndOccupied(
	currentSection: Seat[],
	leftSeatIndex: number,
	rightSeatIndex: number,
): boolean {
	return (
		isOccupied(currentSection[leftSeatIndex].status) &&
		isRightSeatWithinBounds(currentSection, rightSeatIndex) &&
		isSeatEmptyByIndex(currentSection, leftSeatIndex)
	);
}

function isRightSeatWithinBounds(
	section: Seat[],
	rightSeatIndex: number,
): boolean {
	return rightSeatIndex < section.length;
}

function isLeftRightSeatWithinBounds(
	section: Seat[],
	leftSeatIndex: number,
	rightSeatIndex: number,
): boolean {
	return (
		isLeftSeatWithinBounds(leftSeatIndex) &&
		isRightSeatWithinBounds(section, rightSeatIndex)
	);
}

function computeSeatIndexes(seatIndex: number): {
	leftLeftSeatIndex: number;
	leftSeatIndex: number;
	currentIndex: number;
	rightSeatIndex: number;
	rightRightSeatIndex: number;
} {
	return {
		leftLeftSeatIndex: seatIndex - 2,
		leftSeatIndex: seatIndex - 1,
		currentIndex: seatIndex,
		rightSeatIndex: seatIndex + 1,
		rightRightSeatIndex: seatIndex + 2,
	};
}

/**
 * Get the status of the left left seat and treat out-of-bounds seats as
 * occupied
 */
function getLeftLeftSeatStatus(
	section: Seat[],
	leftLeftSeatIndex: number,
): Seat["status"] {
	return leftLeftSeatIndex >= 0
		? section[leftLeftSeatIndex].status
		: "occupied";
}

/**
 * Get the status of the right right seat and treat out-of-bounds seats as
 * occupied
 */
function getRightRightSeatStatus(
	section: Seat[],
	rightRightSeatIndex: number,
): Seat["status"] {
	return rightRightSeatIndex < section.length
		? section[rightRightSeatIndex].status
		: "occupied";
}

function isOccupied(seatStatus: Seat["status"]): boolean {
	return seatStatus === "occupied" || seatStatus === "temp-occupied";
}

export function pickSeats(
	seats: Seat[],
	seatsToSelect: string[],
): PickSeatRes[] {
	const clonedSeats = clonedArray(seats);

	const clonedSeatsWithTempOccupied = updateSeatsWithTempOccupied(
		clonedSeats,
		seatsToSelect,
	);

	const results: PickSeatRes[] = [];

	for (const seatIdx of seatsToSelect) {
		const seat = getCurrentSeat(clonedSeatsWithTempOccupied, seatIdx);

		if (!seat) {
			results.push({
				seatId: seatIdx,
				success: false,
				message: `Error: Seat ${seatIdx} not found.`,
			});
			continue;
		}

		const currentSection = getCurrentSection(
			clonedSeatsWithTempOccupied,
			seat.column,
			seat.row,
		);

		const seatIndex = getSeatIndex(currentSection, seatIdx);

		if (isSeatOutOfBounds(currentSection, seatIndex)) {
			results.push({
				seatId: seatIdx,
				success: false,
				message: `Error: Seat index ${seatIdx} is out of bounds.`,
			});
			continue;
		}

		if (!isOccupied(currentSection[seatIndex].status)) {
			results.push({
				seatId: seatIdx,
				success: false,
				message: `Error: Seat ${seatIdx} is already occupied.`,
			});
			continue;
		}

		const computedSeatIndexes = computeSeatIndexes(seatIndex);

		const leftLeftSeatStatus = getLeftLeftSeatStatus(
			currentSection,
			computedSeatIndexes.leftLeftSeatIndex,
		);

		const rightRightSeatStatus = getRightRightSeatStatus(
			currentSection,
			computedSeatIndexes.rightRightSeatIndex,
		);

		if (
			isOccupied(leftLeftSeatStatus) &&
			isOccupied(rightRightSeatStatus) &&
			isLeftRightSeatWithinBounds(
				currentSection,
				computedSeatIndexes.leftSeatIndex,
				computedSeatIndexes.rightSeatIndex,
			)
		) {
			if (
				isLeftSeatEmptyRightSeatWithinBoundsAndOccupied(
					currentSection,
					computedSeatIndexes.leftSeatIndex,
					computedSeatIndexes.rightSeatIndex,
				) ||
				isRightSeatWithinBoundsLeftSeatEmptyAndOccupied(
					currentSection,
					computedSeatIndexes.leftSeatIndex,
					computedSeatIndexes.rightSeatIndex,
				) ||
				isRightSeatWithinBoundsLeftAndRightSeatEmpty(
					currentSection,
					computedSeatIndexes.leftSeatIndex,
					computedSeatIndexes.rightSeatIndex,
				)
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
			isOccupied(leftLeftSeatStatus) &&
			isLeftSeatWithinBounds(computedSeatIndexes.leftSeatIndex)
		) {
			if (
				computedSeatIndexes.rightSeatIndex >= seatIndex &&
				isSeatEmptyByIndex(
					currentSection,
					computedSeatIndexes.leftSeatIndex,
				)
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
			isRightSeatWithinBounds(
				currentSection,
				computedSeatIndexes.rightSeatIndex,
			)
		) {
			if (
				currentSection[computedSeatIndexes.rightSeatIndex].status ===
				"empty"
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
