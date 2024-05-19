import { PrismaClient } from "@prisma/client";
import { seats } from "./seats-data-seed.js";
const prisma = new PrismaClient();

async function main() {
	await prisma.seat.createMany({
		data: seats,
	});
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
