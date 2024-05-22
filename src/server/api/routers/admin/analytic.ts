import { createTRPCRouter, protectedAdminProcedure } from "@/server/api/trpc";

export const analyticRouter = createTRPCRouter({
	sales: protectedAdminProcedure.query(async ({ ctx }) => {
		const [soldSeatsNumber, totalSeatsNumber, totalRevenue] =
			await ctx.db.$transaction([
				ctx.db.seat.count({
					where: {
						orderId: {
							not: null,
						},
					},
				}),
				ctx.db.seat.count(),
				ctx.db.order.aggregate({
					_sum: {
						paidAmount: true,
					},
				}),
			]);

		return {
			soldSeatsNumber,
			totalSeatsNumber,
			totalRevenue,
		};
	}),
});
