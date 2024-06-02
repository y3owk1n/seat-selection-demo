import { PAGE_SIZE } from "@/lib/constants";
import { searchStrFormatter } from "@/lib/formatter";
import { updateSeatStatusSchema } from "@/lib/schema";
import { createTRPCRouter, protectedAdminProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { z } from "zod";
dayjs.extend(timezone);
dayjs.extend(utc);

export const seatRouter = createTRPCRouter({
	seats: protectedAdminProcedure
		.input(
			z.object({
				page: z.number(),
				searchTerm: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			let searchQuery = {};

			if (input.searchTerm && input.searchTerm !== "") {
				const formattedSearchTerm = searchStrFormatter({
					searchTerm: input.searchTerm,
				});

				searchQuery = {
					label: {
						search: formattedSearchTerm,
					},
				};
			}

			const [data, count] = await ctx.db.$transaction([
				ctx.db.seat.findMany({
					skip:
						input.page === 1
							? undefined
							: (input.page - 1) * PAGE_SIZE,
					take: PAGE_SIZE,
					where: {
						...searchQuery,
					},
					orderBy: {
						label: "asc",
					},
				}),
				ctx.db.seat.count({
					where: { ...searchQuery },
				}),
			]);

			return { data, count };
		}),
	updateSeatStatus: protectedAdminProcedure
		.input(updateSeatStatusSchema.extend({ seatId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.$transaction(async (tx) => {
				const seat = await tx.seat.findUniqueOrThrow({
					where: {
						id: input.seatId,
					},
				});

				if (seat.orderId) {
					throw new TRPCError({
						code: "PRECONDITION_FAILED",
						message:
							"Cannot update seat status if the seat is purchased by customer",
					});
				}

				if (seat.status === input.status) {
					throw new TRPCError({
						code: "PRECONDITION_FAILED",
						message: "Cannot update seat status to the same status",
					});
				}

				return tx.seat.update({
					where: {
						id: input.seatId,
					},
					data: {
						status: input.status,
					},
				});
			});
		}),
});
