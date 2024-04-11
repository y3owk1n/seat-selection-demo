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
