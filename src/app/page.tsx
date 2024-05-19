import { ModeToggle } from "@/components/dark-mode-toggle";
import ConcertSeatDetail from "@/components/homepage/concert-seat-detail";
import UserInfoBar from "@/components/shared/user-info-bar";
import { getSessionAndCheckRedirect } from "@/lib/auth";
import { api } from "@/trpc/server";
import { Calendar, Pin } from "lucide-react";

export default async function Home(): Promise<JSX.Element> {
	const seats = await api.seat.seats();

	const myLockedSeats = await api.seat.myLockedSeats();

	const session = await getSessionAndCheckRedirect();

	return (
		<main className="container max-w-4xl flex flex-col gap-8 py-10 mb-24">
			<UserInfoBar session={session} />
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

			<ConcertSeatDetail
				myLockedSeats={myLockedSeats}
				seats={seats}
				session={session}
			/>
		</main>
	);
}
