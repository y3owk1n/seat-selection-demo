"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { PathButton } from "@/components/ui/path";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	type UseSeatSelection,
	useSeatSelection,
} from "@/hooks/use-seat-selection";
import { useZoom } from "@/hooks/use-zoom";
import { formatCurrency } from "@/lib/formatter";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { type Seat } from "@prisma/client";
import { ZoomIn, ZoomOut } from "lucide-react";
import { type Session } from "next-auth";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { LoginForm } from "../shared/login";
import { ResponsiveDialogDrawer } from "../shared/responsive-dialog-drawer";

function SeatItem({
	seat,
	seatSelection,
}: { seat: Seat; seatSelection: UseSeatSelection }): JSX.Element {
	const selected = seatSelection.selectedSeat.some(
		(_seat) => _seat.id === seat.id,
	);

	return (
		<PathButton
			id={seat.label}
			transform={seat.transform}
			d={seat.d}
			onClick={() => {
				seatSelection.onSelectSeat(seat.id);
			}}
			aria-disabled={seat.status === "OCCUPIED"}
			className={cn(
				"relative ring aria-[disabled=true]:pointer-events-none aria-[disabled=true]:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
				selected ? "fill-primary hover:fill-primary/90" : "",
				seatSelection.selectionErrorIds.includes(seat.id)
					? "stroke-red-500 stroke-2 hover:stroke-red-500"
					: "",
				seatSelection.selectionSuccessIds.includes(seat.id)
					? "stroke-green-500 stroke-2 hover:stroke-green-500"
					: "",
			)}
		/>
	);
}

interface ConcertSeatDetailProps {
	seats: Seat[];
	session: Session | null;
}

export default function ConcertSeatDetail(
	props: ConcertSeatDetailProps,
): JSX.Element {
	const { seats, session } = props;

	const seatSelection = useSeatSelection(seats);
	const zoom = useZoom({});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const selectSeat = api.seat.selectSeats.useMutation({
		// onSuccess: () => {
		//   router.refresh();
		//   setName("");
		// },
	});

	const submitSelectSeat = useCallback(async () => {
		toast.dismiss();
		seatSelection.setSelectionErrorIds([]);
		seatSelection.setSelectionSuccessIds([]);
		setIsSubmitting(true);
		const selectedSeatsIds = seatSelection.selectedSeat.map(
			(seat) => seat.id,
		);

		try {
			const res = await selectSeat.mutateAsync({ selectedSeatsIds });

			const filteredErrors = res.filter((r) => !r.success);

			const filteredSuccess = res.filter((r) => r.success);

			if (filteredErrors.length) {
				seatSelection.setSelectionErrorIds(
					filteredErrors.map((r) => r.seatId),
				);

				filteredErrors
					.map((r) => r.message)
					.forEach((error) =>
						toast.error("Error From Server", {
							description: error,
						}),
					);
			}
			seatSelection.setSelectionSuccessIds(
				filteredSuccess.map((r) => r.seatId),
			);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		} finally {
			setIsSubmitting(false);
		}
	}, [seatSelection, selectSeat]);

	return (
		<>
			<div className="w-full items-center flex flex-col gap-8">
				<ButtonGroup>
					<Button
						variant="outline"
						size="icon"
						onClick={() => {
							zoom.zoomOut();
						}}
					>
						<ZoomOut className="w-5 h-5" />
					</Button>
					<Button variant="outline" disabled>
						{zoom.zoomLevel}%
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() => {
							zoom.zoomIn();
						}}
					>
						<ZoomIn className="w-5 h-5" />
					</Button>
				</ButtonGroup>

				<div className="border border-primary w-full h-10 grid items-center text-center">
					Stage
				</div>

				<ScrollArea className="w-full aspect-square mx-auto">
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 581.58 488.75"
							width={`${zoom.zoomLevel}%`}
							height="auto"
						>
							{seats.map((seat) => (
								<SeatItem
									key={seat.id}
									seat={seat}
									seatSelection={seatSelection}
								/>
							))}
						</svg>
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>

			<div className="fixed md:max-w-4xl w-full justify-between items-center md:rounded-md flex gap-4 bg-primary text-primary-foreground p-4 border bottom-0 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10">
				<div className="space-y-1">
					<div className="inline-flex gap-1 items-center flex-wrap">
						<p className="text-sm font-medium leading-none">
							Selected Seats:{" "}
						</p>

						<div className="inline-flex gap-1 flex-wrap">
							{seatSelection.selectedSeat
								.sort((a, b) => a.label.localeCompare(b.label))
								.map((seat) => (
									<Badge variant="secondary" key={seat.id}>
										{seat.label}
									</Badge>
								))}
						</div>
					</div>
					<p className="text-sm text-primary-foreground/80">
						Total Amount:{" "}
						{formatCurrency(seatSelection.totalAmountForSeats)} for{" "}
						{seatSelection.selectedSeat.length} tickets
					</p>
				</div>
				{session ? (
					<Button
						type="button"
						variant="secondary"
						disabled={
							isSubmitting || !seatSelection.selectedSeat.length
						}
						onClick={() => void submitSelectSeat()}
					>
						Next
					</Button>
				) : (
					<ResponsiveDialogDrawer
						title="Sign In"
						description="Use the following method to sign in"
						buttonText="Login to continue"
						buttonStyle="secondary"
					>
						<LoginForm />
					</ResponsiveDialogDrawer>
				)}
			</div>
		</>
	);
}
