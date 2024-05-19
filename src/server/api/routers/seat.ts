import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const seatRouter = createTRPCRouter({
	seats: publicProcedure.query(async ({ ctx }) => {
		await new Promise((resolve) => setTimeout(resolve, 3000));
		return ctx.db.seat.findMany();
	}),
});
