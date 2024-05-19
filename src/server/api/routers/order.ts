import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { z } from "zod";
dayjs.extend(timezone);
dayjs.extend(utc);

export const orderRouter = createTRPCRouter({
	orderBySessionId: protectedProcedure
		.input(z.object({ sessionId: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			return ctx.db.order.findFirst({
				where: {
					checkoutSessionId: input.sessionId,
					userId: ctx.session.user.id,
				},
			});
		}),
	orderByOrderId: protectedProcedure
		.input(z.object({ orderId: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			const order = await ctx.db.order.findFirst({
				where: {
					id: input.orderId,
					userId: ctx.session.user.id,
				},
				include: {
					seat: true,
				},
			});

			if (!order) {
				return null;
			}

			const formattedOrder = {
				orderId: order.id,
				seats: order.seat.map((seat) => ({
					label: seat.label,
					price: seat.price,
				})),
				checkoutSessionId: order.checkoutSessionId,
				receiptUrl: order.receiptUrl,
				paidAt: order.createdAt,
				updatedAt: order.updatedAt,
				paidAmount: order.paidAmount,
			};

			return formattedOrder;
		}),
	orders: protectedProcedure.query(async ({ ctx }) => {
		const orders = await ctx.db.order.findMany({
			where: {
				userId: ctx.session.user.id,
			},
			include: {
				seat: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		const formattedOrders = orders.map((order) => ({
			orderId: order.id,
			seats: order.seat.map((seat) => seat.label),
			checkoutSessionId: order.checkoutSessionId,
			receiptUrl: order.receiptUrl,
			paidAt: order.createdAt,
			paidAmount: order.paidAmount,
		}));

		return formattedOrders;
	}),
});
