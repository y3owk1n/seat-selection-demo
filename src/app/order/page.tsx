import { ModeToggle } from "@/components/dark-mode-toggle";
import OrderList from "@/components/order/order-list";
import UserInfoBar from "@/components/shared/user-info-bar";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function Orders(): Promise<JSX.Element> {
	const session = await getServerAuthSession();

	if (!session || !session.user) {
		return notFound();
	}

	const orders = await api.order.orders();

	return (
		<main className="container max-w-4xl flex flex-col gap-8 py-10 mb-24">
			<UserInfoBar session={session} />
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
