import { ModeToggle } from "@/components/dark-mode-toggle";
import { Seats } from "@/components/seats";
import { initialSeatData } from "@/lib/seat-data";

export default function Home(): JSX.Element {
	return (
		<main className="container my-10">
			<div className="flex gap-4">
				<h1 className="flex-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
					Seat Selection Demo
				</h1>
				<ModeToggle />
			</div>
			<Seats seats={initialSeatData} />
		</main>
	);
}
