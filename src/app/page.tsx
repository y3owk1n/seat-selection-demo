import { ModeToggle } from "@/components/dark-mode-toggle";
import ConcertSeatDetail from "@/components/homepage/concert-seat-detail";
import Videos from "@/components/homepage/videos";
import UserInfoBar from "@/components/shared/user-info-bar";
import { Separator } from "@/components/ui/separator";
import { getSessionAndCheckRedirect } from "@/lib/auth";
import { siteConfig } from "@/lib/config";
import { generateCustomMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";
import { Calendar, Pin } from "lucide-react";

const title = `Home - ${siteConfig.name}`;
const slug = "/";

export const metadata = generateCustomMetadata({
	mainTitle: title,
	maybeSeoTitle: title,
	maybeSeoDescription: siteConfig.description,
	slug,
});

export default async function Home(): Promise<JSX.Element> {
	const seats = await api.seat.seats();

	const myLockedSeats = await api.seat.myLockedSeats();

	const session = await getSessionAndCheckRedirect();

	return (
		<main className="container max-w-4xl flex flex-col gap-8 py-10 mb-24">
			<UserInfoBar session={session} />
			<div className="flex gap-4">
				<h1 className="flex-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
					United Dance Concert: The Twenty Four
				</h1>
				<ModeToggle />
			</div>
			<div className="grid gap-4">
				<p className="text-sm text-muted-foreground">
					United Dance Concert is Malaysia’s first live street dance
					showcase made possible by local academy talents. It’s first
					live show in 2017 was targeted to provide a platform for
					academy students to showcase their technical & showmanship
					skills on stage. In 2018, it was rebranded to cater a live
					show to the general public with relatable intricate
					storylines expressed in movements. Join us as we venture
					into a whole new experience of ‘The Twenty Four’.
				</p>
				<ul className="flex gap-4 flex-wrap">
					<li className="inline-flex gap-2 items-center">
						<Pin className="w-5 h-5" />
						<span className="text-sm">
							(KLPAC) Kuala Lumpur Performing Arts Centre
						</span>
					</li>
					<li className="inline-flex gap-2 items-center">
						<Calendar className="w-5 h-5" />
						<span className="text-sm">30th June 2024, 6:00pm</span>
					</li>
				</ul>

				<div className="my-8 grid gap-4">
					<h2 className="flex-1 scroll-m-20 text-xl font-extrabold tracking-tight">
						Amazing Videos For UDC
					</h2>
					<Videos />
				</div>

				<Separator />
			</div>

			<div className="grid gap-4">
				<h2 className="flex-1 scroll-m-20 text-xl font-extrabold tracking-tight">
					Select Your Tickets Here
				</h2>

				<p className="text-sm text-muted-foreground">
					Click the following boxes to select your desired ticket
				</p>

				<ul className="flex gap-4 flex-wrap">
					<li className="inline-flex gap-2 items-center">
						<div className="size-4 rounded-full bg-yellow-500 border-2 border-primary" />
						<span className="text-sm">RM 88 (Tier 1)</span>
					</li>
					<li className="inline-flex gap-2 items-center">
						<div className="size-4 rounded-full bg-pink-500 border-2 border-primary" />
						<span className="text-sm">RM 128 (Tier 2)</span>
					</li>
					<li className="inline-flex gap-2 items-center">
						<div className="size-4 rounded-full opacity-50 bg-primary border-2 border-primary" />
						<span className="text-sm">Occupied</span>
					</li>
					<li className="inline-flex gap-2 items-center">
						<div className="size-4 rounded-full bg-orange-500 border-2 border-primary" />
						<span className="text-sm">Locked For You</span>
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
