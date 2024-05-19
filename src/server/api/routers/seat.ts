import { timezoneKL } from "@/lib/date";
import { getSeatStatus, pickSeats } from "@/lib/seat";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc";
import { type Seat } from "@prisma/client";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { z } from "zod";
dayjs.extend(timezone);
dayjs.extend(utc);

export const seatRouter = createTRPCRouter({
	seats: publicProcedure.query(async ({ ctx }) => {
		const seats = await ctx.db.seat.findMany();

		const formattedSeats: Seat[] = seats.map((seat) => ({
			...seat,
			status: getSeatStatus(seat.status, seat.lockedTill),
		}));

		return formattedSeats;
	}),
	myLockedSeats: publicProcedure.query(async ({ ctx }) => {
		if (!ctx.session) return [];
		const seats = await ctx.db.seat.findMany({
			where: {
				lockedByUserId: {
					equals: ctx.session.user.id,
				},
				lockedTill: {
					gt: dayjs().tz(timezoneKL).utc().toDate(),
				},
			},
		});

		return seats;
	}),
	selectSeats: protectedProcedure
		.input(z.object({ selectedSeatsIds: z.array(z.string()).min(1) }))
		.mutation(async ({ ctx, input }) => {
			const allSeats = await ctx.db.seat.findMany();

			const formattedSeats: Seat[] = allSeats.map((seat) => ({
				...seat,
				status: getSeatStatus(seat.status, seat.lockedTill),
			}));

			const res = pickSeats(formattedSeats, input.selectedSeatsIds);

			const filteredSuccess = res.filter((r) => r.success);

			// all are success
			if (filteredSuccess.length === input.selectedSeatsIds.length) {
				await ctx.db.seat.updateMany({
					where: {
						id: {
							in: input.selectedSeatsIds,
						},
					},
					data: {
						lockedByUserId: ctx.session.user.id,
						lockedTill: dayjs()
							.add(20, "minutes")
							.tz(timezoneKL)
							.toDate(),
					},
				});

				return res;
			}

			return res;
		}),
});
