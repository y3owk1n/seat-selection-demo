import { Seats, type Seat } from "@/components/seats";

const seats: Seat[] = [
	{ id: "A1", column: 1, row: 1, indexFromLeft: 1, status: "empty" },
	{ id: "A2", column: 1, row: 1, indexFromLeft: 2, status: "empty" },
	{ id: "A3", column: 1, row: 1, indexFromLeft: 3, status: "occupied" },
	{ id: "A4", column: 1, row: 1, indexFromLeft: 4, status: "empty" },
	{ id: "A5", column: 1, row: 1, indexFromLeft: 5, status: "empty" },
	{ id: "A6", column: 2, row: 1, indexFromLeft: 1, status: "empty" },
	{ id: "A7", column: 2, row: 1, indexFromLeft: 2, status: "empty" },
];

export default function Home(): JSX.Element {
	return (
		<main className="container my-10">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Seat Selection Demo
			</h1>
			<Seats seats={seats} />
		</main>
	);
}
