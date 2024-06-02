import { ModeToggle } from "@/components/dark-mode-toggle";
import OrderList from "@/components/order/order-list";
import UserInfoBar from "@/components/shared/user-info-bar";
import { Button } from "@/components/ui/button";
import { getSessionAndCheckRedirect } from "@/lib/auth";
import { siteConfig } from "@/lib/config";
import { generateCustomMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const title = "Orders";
const slug = "/order";

export const metadata = generateCustomMetadata({
	mainTitle: title,
	maybeSeoTitle: title,
	maybeSeoDescription: siteConfig.description,
	slug,
});

export default async function Orders(): Promise<JSX.Element> {
	const session = await getSessionAndCheckRedirect();

	if (!session || !session.user) {
		return notFound();
	}

	const orders = await api.order.orders();

	return (
		<main className="container mb-24 flex max-w-4xl flex-col gap-8 py-10">
			<UserInfoBar session={session} />
			<div>
				<Button variant="link" size="link" asChild>
					<Link href="/">
						<ArrowLeft className="mr-2 size-4" /> Back to home
					</Link>
				</Button>
			</div>
			<div className="flex items-center gap-4">
				<h1 className="flex-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
					My Orders
				</h1>
				<ModeToggle />
			</div>

			<OrderList orderData={orders} />
		</main>
	);
}
