import { createTRPCRouter } from "../../trpc";
import { analyticRouter } from "./analytic";
import { orderRouter } from "./order";
import { seatRouter } from "./seat";

export const adminRouter = createTRPCRouter({
	order: orderRouter,
	analytic: analyticRouter,
	seat: seatRouter,
});
