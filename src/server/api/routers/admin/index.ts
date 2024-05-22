import { createTRPCRouter } from "../../trpc";
import { analyticRouter } from "./analytic";
import { orderRouter } from "./order";

export const adminRouter = createTRPCRouter({
	order: orderRouter,
	analytic: analyticRouter,
});
