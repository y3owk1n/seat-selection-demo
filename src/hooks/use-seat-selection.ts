"use client";
import {
	type Seat,
	getSeatsByColumn,
	getSeatsByRow,
	pickSeats,
	toggleSeat,
} from "@/lib/seat";
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useEffect,
	useState,
} from "react";
import { toast } from "sonner";

export interface UseSeatSelection {
	/** A record of seats grouped by row number. */
	seatsByRow: Record<number, Seat[]>;
	/** A record of seats grouped by column number. */
	seatsByColumn: Record<number, Record<number, Seat[]>>;
	/** An array of selected seats. */
	selectedSeat: Seat[];
	/** Callback function to handle seat selection. */
	onSelectSeat: (seatId: string) => void;
	/** An array of seat IDs that encountered selection errors. */
	selectionErrorIds: string[];
	/** Function to update the array of seat IDs with selection errors. */
	setSelectionErrorIds: Dispatch<SetStateAction<string[]>>;
	/** An array of seat IDs that were successfully selected. */
	selectionSuccessIds: string[];
	/** Function to update the array of seat IDs with successful selections. */
	setSelectionSuccessIds: Dispatch<SetStateAction<string[]>>;
	/** The total amount for the selected seats. */
	totalAmountForSeats: number;
	/** Function to clear all seats data. */
	resetSeatsSelection: () => void;
}

/**
 * A React hook for managing seat selection.
 *
 * @param seats - An array of Seat objects representing available seats.
 * @returns An object containing state variables and functions to manage seat selection.
 */
export function useSeatSelection(
	seats: Seat[],
	selectedTicket: string | null,
): UseSeatSelection {
	const [selectedSeat, setSelectedSeat] = useState<Seat[]>([]);

	const [totalAmountForSeats, setTotalAmountForSeats] = useState(0);

	const [selectionErrorIds, setSelectionErrorIds] = useState<string[]>([]);

	const [selectionSuccessIds, setSelectionSuccessIds] = useState<string[]>(
		[],
	);

	const seatsByRow = getSeatsByRow(seats, selectedTicket);

	const seatsByColumn = getSeatsByColumn(seatsByRow);

	const onSelectSeat = useCallback(
		(seatId: string) => {
			setSelectionSuccessIds([]);
			setSelectionErrorIds([]);
			toast.dismiss();
			const seat = seats.find((_seat) => _seat.id === seatId);
			if (!seat) return;

			setSelectedSeat((prevSelectedSeat) =>
				toggleSeat(prevSelectedSeat, seat),
			);
		},
		[seats],
	);

	const resetSeatsSelection = useCallback(() => {
		setSelectedSeat([]);
		setSelectionErrorIds([]);
		setSelectionSuccessIds([]);
		setTotalAmountForSeats(0);
	}, []);

	useEffect(() => {
		if (selectedSeat.length > 0) {
			const res = pickSeats(
				seats,
				selectedSeat.map((seat) => seat.id),
			);

			const filteredErrors = res.filter((r) => !r.success);

			const filteredSuccess = res.filter((r) => r.success);

			if (filteredErrors.length) {
				setSelectionErrorIds(filteredErrors.map((r) => r.seatId));

				filteredErrors
					.map((r) => r.message as string)
					.forEach((error) =>
						toast.error("Error From Client", {
							description: error,
						}),
					);
			}
			setSelectionSuccessIds(filteredSuccess.map((r) => r.seatId));
		}
	}, [seats, selectedSeat]);

	useEffect(() => {
		setTotalAmountForSeats(0);
		if (selectedSeat.length > 0) {
			const totalAmount = selectedSeat.reduce((acc, seat) => {
				return acc + seat.price;
			}, 0);
			setTotalAmountForSeats(totalAmount);
		}
	}, [selectedSeat]);

	return {
		seatsByRow,
		seatsByColumn,
		selectedSeat,
		onSelectSeat,
		selectionErrorIds,
		setSelectionErrorIds,
		selectionSuccessIds,
		setSelectionSuccessIds,
		totalAmountForSeats,
		resetSeatsSelection,
	};
}
