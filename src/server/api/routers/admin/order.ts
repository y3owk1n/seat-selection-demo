import { PAGE_SIZE } from "@/lib/constants";
import { searchStrFormatter } from "@/lib/formatter";
import { createTRPCRouter, protectedAdminProcedure } from "@/server/api/trpc";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { z } from "zod";
dayjs.extend(timezone);
dayjs.extend(utc);

export const orderRouter = createTRPCRouter({
	orderByOrderId: protectedAdminProcedure
		.input(z.object({ orderId: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			const order = await ctx.db.order.findFirst({
				where: {
					id: input.orderId,
				},
				include: {
					seat: true,
					user: true,
				},
			});

			if (!order) {
				return null;
			}

			const subTotal = order.seat.reduce(
				(acc, seat) => acc + seat.price,
				0,
			);

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
				subTotal,
				processingFeeAmount: order.processingFeeAmount,
				user: order.user,
				collectionMethod: order.collectionMethod,
			};

			return formattedOrder;
		}),
	orders: protectedAdminProcedure
		.input(
			z.object({
				page: z.number(),
				searchTerm: z.string(),
				searchType: z.enum(["id", "user"]),
			}),
		)
		.query(async ({ ctx, input }) => {
			let searchQuery = {};

			if (input.searchTerm && input.searchTerm !== "") {
				const formattedSearchTerm = searchStrFormatter({
					searchTerm: input.searchTerm,
				});

				if (input.searchType === "id") {
					searchQuery = {
						id: {
							search: formattedSearchTerm,
						},
					};
				}

				if (input.searchType === "user") {
					searchQuery = {
						user: {
							fullName: {
								search: formattedSearchTerm,
							},
							name: {
								search: formattedSearchTerm,
							},
							email: {
								search: formattedSearchTerm,
							},
						},
					};
				}
			}

			const [data, count] = await ctx.db.$transaction([
				ctx.db.order.findMany({
					skip:
						input.page === 1
							? undefined
							: (input.page - 1) * PAGE_SIZE,
					take: PAGE_SIZE,
					where: {
						...searchQuery,
					},
					include: {
						seat: true,
						user: {
							select: {
								fullName: true,
								phone: true,
							},
						},
					},
					orderBy: {
						createdAt: "desc",
					},
				}),
				ctx.db.order.count({
					where: { ...searchQuery },
				}),
			]);

			const formattedOrders = data.map((order) => ({
				orderId: order.id,
				seats: order.seat.map((seat) => seat.label),
				checkoutSessionId: order.checkoutSessionId,
				receiptUrl: order.receiptUrl,
				paidAt: order.createdAt,
				paidAmount: order.paidAmount,
				user: {
					fullName: order.user?.fullName,
					phone: order.user?.phone,
				},
			}));

			return { data: formattedOrders, count };
		}),
});
