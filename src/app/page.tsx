"use client";

import { ModeToggle } from "@/components/dark-mode-toggle";
import { Seats } from "@/components/seats";
import TicketCard from "@/components/ticket-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSeatSelection } from "@/hooks/use-seat-selection";
import { initialSeatData } from "@/lib/seat-data";
import { tickets } from "@/lib/ticket-data";
import Image from "next/image";
import { useState } from "react";
import concertImage from "../../public/assets/concert-image-demo.jpg";

export default function Home(): JSX.Element {
	const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

	const seatSelection = useSeatSelection(initialSeatData, selectedTicket);

	return (
		<main className="container flex flex-col gap-8 my-10">
			<div className="flex gap-4">
				<h1 className="flex-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
					Seat Selection Demo
				</h1>
				<ModeToggle />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="col-span-1">
					<Image
						src={concertImage}
						alt="concert image"
						placeholder="blur"
						className="rounded-md"
					/>
				</div>
				<div className="col-span-1">
					<ScrollArea className="border aspect-square rounded-md p-4">
						<div className="flex flex-col gap-4">
							<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
								Choose Your Tickets
							</h2>
							{tickets.map((ticket) => (
								<TicketCard
									key={ticket.id}
									ticket={ticket}
									selectedTicket={selectedTicket}
									setSelectedTicket={setSelectedTicket}
									selectionErrorIds={
										seatSelection.selectionErrorIds
									}
									selectionSuccessIds={
										seatSelection.selectionSuccessIds
									}
									seats={initialSeatData}
								/>
							))}
						</div>
						<ScrollBar orientation="vertical" />
					</ScrollArea>
				</div>
			</div>
			{selectedTicket ? <Seats seatSelection={seatSelection} /> : null}
		</main>
	);
}
