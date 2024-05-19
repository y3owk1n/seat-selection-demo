import { z } from "zod";

export const updateProfileSchema = z.object({
	fullName: z.string().min(2).max(50),
	email: z.string().email(),
	phone: z.string().min(10).max(20),
});
