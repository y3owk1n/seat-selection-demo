import { ModeToggle } from "@/components/dark-mode-toggle";
import AdminNav from "@/components/shared/admin-nav";
import UserInfoBar from "@/components/shared/user-info-bar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { siteConfig } from "@/lib/config";
import { formatCurrency, formatNumberToKPlusMPlus } from "@/lib/formatter";
import { generateCustomMetadata } from "@/lib/utils";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { ChevronsUpDown } from "lucide-react";
import { notFound } from "next/navigation";

const title = "Analytics - Admin";
const slug = "/admin/analytics";

export const metadata = generateCustomMetadata({
	mainTitle: title,
	maybeSeoTitle: title,
	maybeSeoDescription: siteConfig.description,
	slug,
});

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
								seats /{" "}
								<span className="font-normal">
									{analytic.totalSeatsNumber -
										analytic.totalBlockedWithoutOrderSeatsNumber}
								</span>{" "}
								seats
							</span>
						</CardTitle>

						<div>
							<CardDescription className="mt-4">
								Reserved:{" "}
								{analytic.totalBlockedWithoutOrderSeatsNumber}{" "}
								seats
							</CardDescription>
						</div>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Total Revenue</CardDescription>
						<CardTitle className="text-4xl text-left">
							RM{" "}
							{formatNumberToKPlusMPlus(
								analytic.totalRevenue._sum.paidAmount ?? 0,
							)}
						</CardTitle>
						<div>
							<CardDescription className="mt-4">
								{formatCurrency(
									analytic.totalRevenue._sum.paidAmount ?? 0,
								)}
							</CardDescription>
						</div>
					</CardHeader>
				</Card>
			</div>
		</main>
	);
}
