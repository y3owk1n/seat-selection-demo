import { Seats } from "@/components/seats";
import { initialSeatData } from "@/lib/seat";

export default function Home(): JSX.Element {
	return (
		<main className="container my-10">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Seat Selection Demo
			</h1>
			<Seats seats={initialSeatData} />
		</main>
	);
}
