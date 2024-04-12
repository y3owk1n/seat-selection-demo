import { pickSeats } from "@/lib/seat";
import { initialSeatData } from "@/lib/seat-data";

interface SeatRequestBody {
	selectedSeatsIds: string[];
}

export async function POST(request: Request): Promise<Response> {
	const body = (await request.json()) as SeatRequestBody; // res now contains body

	if (!body.selectedSeatsIds.length) {
		return Response.json({ error: "No selected seats" }, { status: 400 });
	}

	const res = pickSeats(initialSeatData, body.selectedSeatsIds);

	return Response.json(res);
}
