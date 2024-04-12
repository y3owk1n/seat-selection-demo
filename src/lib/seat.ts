import { clonedArray } from "./utils";

type SeatStatus = "empty" | "occupied" | "temp-occupied" | null;

export interface Seat {
	id: string;
	label: string;
	column: number;
	row: number;
	/**
	 * Index from left of its own sections and it should start from 1
	 */
	indexFromLeft: number;
	status: SeatStatus;
	price: number;
}

/**
 * Retrieves seats grouped by row number.
 *
 * @param seats - An array of Seat objects.
 * @returns A record where keys are row numbers and values are arrays of Seat objects.
 */
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

/**
 * Groups seats by column within each row.
 *
 * @param seatsByRow - A record where keys are row numbers and values are arrays of Seat objects.
 * @returns A record where keys are row numbers and values are records where keys are column numbers and values are arrays of Seat objects.
 */
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

/**
 * Updates the status of seats based on a list of seats to select.
 *
 * @param seats - An array of Seat objects to update.
 * @param seatsToSelect - An array of strings representing the IDs of seats to select.
 * @returns An updated array of Seat objects with the status of selected seats changed to "temp-occupied".
 */
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

/**
 * Retrieves the Seat object with the specified ID from an array of Seat objects.
 *
 * @param seats - An array of Seat objects.
 * @param seatId - The ID of the seat to retrieve.
 * @returns The Seat object with the specified ID, or undefined if not found.
 */
function getCurrentSeat(seat: Seat[], seatId: string): Seat | undefined {
	return seat.find((_seat) => _seat.id === seatId);
}

/**
 * Retrieves seats belonging to a specified section defined by column and row numbers.
 *
 * @param seats - An array of Seat objects.
 * @param column - The column number of the section.
 * @param row - The row number of the section.
 * @returns An array of Seat objects belonging to the specified section.
 */
function getCurrentSection(seat: Seat[], column: number, row: number): Seat[] {
	return seat.filter((_seat) => _seat.column === column && _seat.row === row);
}

/**
 * Retrieves the index of the Seat object with the specified ID from an array of Seat objects.
 *
 * @param seats - An array of Seat objects.
 * @param seatId - The ID of the seat to find the index of.
 * @returns The index of the Seat object with the specified ID, or -1 if not found.
 */
function getSeatIndex(seat: Seat[], seatId: string): number {
	return seat.findIndex((_seat) => _seat.id === seatId);
}

/**
 * Checks if the given seat index is out of bounds for the provided section.
 *
 * @param section - An array of Seat objects representing the section.
 * @param seatIndex - The index of the seat to check.
 * @returns A boolean indicating whether the seat index is out of bounds.
 */
function isSeatOutOfBounds(section: Seat[], seatIndex: number): boolean {
	return seatIndex < 0 || seatIndex >= section.length;
}

/**
 * Checks if the seat status indicates that the seat is occupied.
 *
 * @param seatStatus - The status of the seat to check.
 * @returns A boolean indicating whether the seat is occupied.
 */
function isOccupied(seatStatus: Seat["status"]): boolean {
	return seatStatus === "occupied" || seatStatus === "temp-occupied";
}

/**
 * Checks if the seat at the specified index within the section is empty.
 *
 * @param section - An array of Seat objects representing the section.
 * @param index - The index of the seat to check.
 * @returns A boolean indicating whether the seat at the specified index is empty.
 */
function isSeatEmptyByIndex(section: Seat[], index: number): boolean {
	return section[index].status === "empty";
}

/**
 * Checks if the left seat index is within the bounds of the section.
 *
 * @param leftSeatIndex - The index of the left seat to check.
 * @returns A boolean indicating whether the left seat index is within bounds.
 */
function isLeftSeatWithinBounds(leftSeatIndex: number): boolean {
	return leftSeatIndex >= 0;
}

/**
 * Checks if the right seat index is within the bounds of the section.
 *
 * @param section - An array of Seat objects representing the section.
 * @param rightSeatIndex - The index of the right seat to check.
 * @returns A boolean indicating whether the right seat index is within bounds.
 */
function isRightSeatWithinBounds(
	section: Seat[],
	rightSeatIndex: number,
): boolean {
	return rightSeatIndex < section.length;
}

/**
 * Checks if both the left and right seat indices are within the bounds of the section.
 *
 * @param section - An array of Seat objects representing the section.
 * @param leftSeatIndex - The index of the left seat to check.
 * @param rightSeatIndex - The index of the right seat to check.
 * @returns A boolean indicating whether both the left and right seat indices are within bounds.
 */
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

/**
 * Checks if the left seat is empty, the right seat index is within bounds, and the right seat is occupied.
 *
 * @param currentSection - An array of Seat objects representing the current section.
 * @param leftSeatIndex - The index of the left seat to check.
 * @param rightSeatIndex - The index of the right seat to check.
 * @returns A boolean indicating whether the left seat is empty, the right seat index is within bounds, and the right seat is occupied.
 */
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

/**
 * Checks if the left seat is occupied, the right seat index is within bounds, and the right seat is empty.
 *
 * @param currentSection - An array of Seat objects representing the current section.
 * @param leftSeatIndex - The index of the left seat to check.
 * @param rightSeatIndex - The index of the right seat to check.
 * @returns A boolean indicating whether the left seat is empty, the right seat index is within bounds, and the left seat is occupied.
 */
function isRightSeatWithinBoundsAndOccupiedLeftSeatEmpty(
	currentSection: Seat[],
	leftSeatIndex: number,
	rightSeatIndex: number,
): boolean {
	return (
		isOccupied(currentSection[leftSeatIndex].status) &&
		isRightSeatWithinBounds(currentSection, rightSeatIndex) &&
		isSeatEmptyByIndex(currentSection, rightSeatIndex)
	);
}

/**
 * Checks if the left seat is empty, the right seat index is within bounds, and the right seat is empty.
 *
 * @param currentSection - An array of Seat objects representing the current section.
 * @param leftSeatIndex - The index of the left seat to check.
 * @param rightSeatIndex - The index of the right seat to check.
 * @returns A boolean indicating whether the left seat is empty, the right seat index is within bounds, and the right seat is empty.
 */
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

/**
 * Computes the indices of seats relative to the given seat index.
 *
 * @param seatIndex - The index of the current seat.
 * @returns An object containing the indices of seats relative to the current seat.
 */
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
 * Retrieves the status of the seat two positions to the left of the specified index within the section.
 *
 * @param section - An array of Seat objects representing the section.
 * @param leftLeftSeatIndex - The index of the seat two positions to the left to check.
 * @returns The status of the seat two positions to the left of the specified index, or "occupied" if out of bounds.
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
 * Retrieves the status of the seat two positions to the right of the specified index within the section.
 *
 * @param section - An array of Seat objects representing the section.
 * @param rightRightSeatIndex - The index of the seat two positions to the right to check.
 * @returns The status of the seat two positions to the right of the specified index, or "occupied" if out of bounds.
 */
function getRightRightSeatStatus(
	section: Seat[],
	rightRightSeatIndex: number,
): Seat["status"] {
	return rightRightSeatIndex < section.length
		? section[rightRightSeatIndex].status
		: "occupied";
}

export interface PickSeatRes {
	success: boolean;
	seatId: string;
	message?: string;
}

/**
 * Picks seats based on the provided seat IDs and updates their status.
 *
 * @param seats - An array of Seat objects representing all available seats.
 * @param seatsToSelect - An array of strings representing the IDs of seats to select.
 * @returns An array of PickSeatRes objects containing the result of each seat selection attempt.
 */
export function pickSeats(
	seats: Seat[],
	seatsToSelect: string[],
): PickSeatRes[] {
	/**
	 * Clone the array of seats to avoid modifying the original array
	 */
	const clonedSeats = clonedArray(seats);

	/**
	 * Update seats with temporary occupied status based on seats to select
	 */
	const clonedSeatsWithTempOccupied = updateSeatsWithTempOccupied(
		clonedSeats,
		seatsToSelect,
	);

	const results: PickSeatRes[] = [];

	for (const seatIdx of seatsToSelect) {
		/**
		 * Retrieve the current seat from the updated array
		 */
		const seat = getCurrentSeat(clonedSeatsWithTempOccupied, seatIdx);

		/**
		 * If seat not found, add error message to results and continue to next iteration
		 */
		if (!seat) {
			results.push({
				seatId: seatIdx,
				success: false,
				message: `Error: Seat ${seatIdx} not found.`,
			});
			continue;
		}

		/**
		 * Retrieve seats from the current section based on seat's column and row
		 */
		const currentSection = getCurrentSection(
			clonedSeatsWithTempOccupied,
			seat.column,
			seat.row,
		);

		/**
		 * Get the index of the current seat within the current section
		 */
		const seatIndex = getSeatIndex(currentSection, seatIdx);

		/**
		 * Check if seat index is out of bounds
		 */
		if (isSeatOutOfBounds(currentSection, seatIndex)) {
			results.push({
				seatId: seatIdx,
				success: false,
				message: `Error: Seat index ${seatIdx} is out of bounds.`,
			});
			continue;
		}

		/**
		 * Check if seat is already occupied
		 */
		if (!isOccupied(currentSection[seatIndex].status)) {
			results.push({
				seatId: seatIdx,
				success: false,
				message: `Error: Seat ${seatIdx} is already occupied.`,
			});
			continue;
		}

		/**
		 * Compute indices of surrounding seats relative to the current seat
		 */
		const computedSeatIndexes = computeSeatIndexes(seatIndex);

		/**
		 * Get the status of the seat two positions to the left of the current seat
		 */
		const leftLeftSeatStatus = getLeftLeftSeatStatus(
			currentSection,
			computedSeatIndexes.leftLeftSeatIndex,
		);

		/**
		 * Get the status of the seat two positions to the right of the current seat
		 */
		const rightRightSeatStatus = getRightRightSeatStatus(
			currentSection,
			computedSeatIndexes.rightRightSeatIndex,
		);

		/**
		 * Check if selecting the current seat would leave a single empty seat left or right
		 */
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
				isRightSeatWithinBoundsAndOccupiedLeftSeatEmpty(
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

		/**
		 * Check if selecting the current seat would leave a single empty seat to the left
		 */
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

		/**
		 * Check if selecting the current seat would leave a single empty seat to the right
		 */
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

		/**
		 * If no errors encountered, return success
		 */
		results.push({ success: true, seatId: seatIdx });
	}

	return results;
}

/**
 * Toggles the selection state of a seat.
 *
 * @param prevSelectedSeats - An array of previously selected Seat objects.
 * @param currentSelectedSeat - The Seat object to toggle.
 * @returns An updated array of selected Seat objects after toggling.
 */
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
