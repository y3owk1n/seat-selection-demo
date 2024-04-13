import { initialSeats } from "@/lib/seat-data-v2";
import { pickSeats } from "@/lib/seat-v2";

interface SeatRequestBody {
	selectedSeatsIds: string[];
}

export async function POST(request: Request): Promise<Response> {
	const body = (await request.json()) as SeatRequestBody; // res now contains body

	if (!body.selectedSeatsIds.length) {
		return Response.json({ error: "No selected seats" }, { status: 400 });
	}

	const res = pickSeats(initialSeats, body.selectedSeatsIds);

	return Response.json(res);
}
