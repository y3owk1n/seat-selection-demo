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

export function useSeatSelection(seats: Seat[]): {
	seatsByRow: Record<number, Seat[]>;
	seatsByColumn: Record<number, Record<number, Seat[]>>;
	selectedSeat: Seat[];
	onSelectSeat: (seatId: string) => void;
	selectionErrorIds: string[];
	setSelectionErrorIds: Dispatch<SetStateAction<string[]>>;
	selectionSuccessIds: string[];
	setSelectionSuccessIds: Dispatch<SetStateAction<string[]>>;
	totalAmountForSeats: number;
} {
	const [selectedSeat, setSelectedSeat] = useState<Seat[]>([]);

	const [totalAmountForSeats, setTotalAmountForSeats] = useState(0);

	const [selectionErrorIds, setSelectionErrorIds] = useState<string[]>([]);

	const [selectionSuccessIds, setSelectionSuccessIds] = useState<string[]>(
		[],
	);

	const seatsByRow = getSeatsByRow(seats);

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
	};
}
