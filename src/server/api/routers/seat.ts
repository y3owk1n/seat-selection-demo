import { EXPIRES_IN_MINS } from "@/lib/constants";
import { timezoneKL } from "@/lib/date";
import { getSeatStatus, pickSeats } from "@/lib/seat";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc";
import { type Seat } from "@prisma/client";
import { TRPCError } from "@trpc/server";
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

			/**
			 * Get all selectedSeats bosed on the input
			 */
			const selectedSeats = allSeats.filter((seat) =>
				input.selectedSeatsIds.includes(seat.id),
			);

			if (selectedSeats.length !== input.selectedSeatsIds.length) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "Unable to find all selected seats",
				});
			}

			/**
			 * Get all selectedSeats that is not locked expired & its mine
			 */
			const selectedSeatsWithMe = selectedSeats.filter(
				(seat) =>
					seat.lockedByUserId === ctx.session.user.id &&
					seat.lockedTill &&
					seat.lockedTill > new Date(),
			);

			/**
			 * Get all selectedSeats that is not locked at all
			 */
			const selectedSeatsWithNoLockedUser = selectedSeats.filter(
				(seat) => seat.lockedByUserId === null,
			);

			/**
			 * Check if all selected seats are success (seat logic only)
			 */
			const validatedFilteredSuccess =
				filteredSuccess.length === input.selectedSeatsIds.length;

			const allSelectedSeatsLength =
				selectedSeatsWithMe.length +
				selectedSeatsWithNoLockedUser.length;

			/**
			 * Check if all selected seats are success (its mine and not locked)
			 */
			const validatedSelectedSeatsSuccoss =
				allSelectedSeatsLength === input.selectedSeatsIds.length;

			const combinedValidatedSucess =
				validatedFilteredSuccess && validatedSelectedSeatsSuccoss;

			/**
			 * If both are good to go, we will update the locked status to this
			 * current user. These check are important to prevent some silly
			 * people trying to update the seats through hacking the API
			 */
			if (combinedValidatedSucess) {
				await ctx.db.seat.updateMany({
					where: {
						id: {
							in: input.selectedSeatsIds,
						},
					},
					data: {
						lockedByUserId: ctx.session.user.id,
						lockedTill: dayjs()
							.add(EXPIRES_IN_MINS, "minutes")
							.tz(timezoneKL)
							.toDate(),
					},
				});

				return { detail: res, canCheckOut: true };
			}

			return { detail: res, canCheckOut: false };
		}),
});
