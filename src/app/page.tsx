"use client";

import { ModeToggle } from "@/components/dark-mode-toggle";
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
import { initialSeats } from "@/lib/seat-data";
import { type PickSeatRes, type Seat } from "@/lib/seat";
import { cn } from "@/lib/utils";
import { Calendar, Pin, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

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
			aria-disabled={seat.status === "occupied"}
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

export default function Home(): JSX.Element {
	const seatSelection = useSeatSelection(initialSeats);
	const zoom = useZoom({});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const submitSelectSeat = useCallback(async () => {
		toast.dismiss();
		seatSelection.setSelectionErrorIds([]);
		seatSelection.setSelectionSuccessIds([]);
		setIsSubmitting(true);
		const selectedSeatsIds = seatSelection.selectedSeat.map(
			(seat) => seat.id,
		);

		try {
			const rawRes = await fetch("/api/select-seat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ selectedSeatsIds }),
			});

			const res = (await rawRes.json()) as PickSeatRes[];

			if (!rawRes.ok) {
				toast.error("Something went wrong. Please try again later.");
				return;
			}

			const filteredErrors = res.filter((r) => !r.success);

			const filteredSuccess = res.filter((r) => r.success);

			if (filteredErrors.length) {
				seatSelection.setSelectionErrorIds(
					filteredErrors.map((r) => r.seatId),
				);

				filteredErrors
					.map((r) => r.message as string)
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
	}, [seatSelection]);

	return (
		<main className="container flex flex-col gap-8 py-10 mb-24">
			<div className="flex gap-4">
				<h1 className="flex-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
					Dance Concert 2024
				</h1>
				<ModeToggle />
			</div>
			<div>
				<p className="text-sm text-muted-foreground">
					Lorem ipsum dolor sit amet, qui minim labore adipisicing
					minim sint cillum sint consectetur cupidatat.
				</p>
				<ul className="flex gap-4 mt-4 flex-wrap">
					<li className="inline-flex gap-2 items-center">
						<Pin className="w-5 h-5" />
						<span className="text-sm">Amazing Place</span>
					</li>
					<li className="inline-flex gap-2 items-center">
						<Calendar className="w-5 h-5" />
						<span className="text-sm">24 July, 2024</span>
					</li>
				</ul>
			</div>

			<div className="max-w-4xl mx-auto w-full items-center p-2 md:p-8 flex flex-col gap-8">
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
							{initialSeats.map((seat) => (
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
			</div>
		</main>
	);
}
