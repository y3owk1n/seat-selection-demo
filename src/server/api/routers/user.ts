import { updateProfileSchema } from "@/lib/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
	updateProfile: protectedProcedure
		.input(updateProfileSchema)
		.mutation(async ({ ctx, input }) => {
			return ctx.db.user.update({
				where: {
					id: ctx.session.user.id,
				},
				data: {
					fullName: input.fullName,
					phone: input.phone,
				},
			});
		}),
});
