import { ModeToggle } from "@/components/dark-mode-toggle";
import AdminNav from "@/components/shared/admin-nav";
import UserInfoBar from "@/components/shared/user-info-bar";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatter";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function Orders(): Promise<JSX.Element> {
	const session = await getServerAuthSession();

	if (!session || !session.user || session.user.role !== "ADMIN") {
		return notFound();
	}

	const analytic = await api.admin.analytic.sales();

	return (
		<main className="container max-w-4xl flex flex-col gap-8 py-10 mb-24">
			<UserInfoBar session={session} />
			<AdminNav />
			<div className="flex items-center gap-4">
				<h1 className="flex-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
					Analytics
				</h1>
				<ModeToggle />
			</div>

			<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardDescription>Sold seats</CardDescription>
						<CardTitle className="text-4xl">
							{analytic.soldSeatsNumber}{" "}
							<span className="text-xs">
								seats / {analytic.totalSeatsNumber} seats
							</span>
						</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Total Revenue</CardDescription>
						<CardTitle className="text-4xl">
							{formatCurrency(
								analytic.totalRevenue._sum.paidAmount ?? 0,
							)}
						</CardTitle>
					</CardHeader>
				</Card>
			</div>
		</main>
	);
}
