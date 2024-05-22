import { ModeToggle } from "@/components/dark-mode-toggle";
import OrderDetailCard from "@/components/order/order-detail-card";
import UserInfoBar from "@/components/shared/user-info-bar";
import { Button } from "@/components/ui/button";
import { getSessionAndCheckRedirect } from "@/lib/auth";
import { api } from "@/trpc/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface OrderDetailProps {
	params: {
		id: string;
	};
}

export default async function OrderDetail(
	props: OrderDetailProps,
): Promise<JSX.Element> {
	const session = await getSessionAndCheckRedirect();

	if (!session || !session.user || typeof props.params.id !== "string") {
		return notFound();
	}

	const order = await api.order.orderByOrderId({ orderId: props.params.id });

	if (!order) {
		return notFound();
	}

	return (
		<main className="container max-w-4xl flex flex-col gap-8 py-10 mb-24">
			<UserInfoBar session={session} />
			<div>
				<Button variant="link" size="link" asChild>
					<Link href="/order">
						<ArrowLeft className="size-4 mr-2" /> Back to orders
					</Link>
				</Button>
			</div>
			<div className="flex items-center gap-4">
				<h1 className="flex-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
					Order Detail
				</h1>
				<ModeToggle />
			</div>

			<OrderDetailCard {...order} />
		</main>
	);
}
