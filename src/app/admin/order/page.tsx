import OrderList from "@/components/admin/order/order-list";
import { ModeToggle } from "@/components/dark-mode-toggle";
import AdminNav from "@/components/shared/admin-nav";
import UserInfoBar from "@/components/shared/user-info-bar";
import { siteConfig } from "@/lib/config";
import { PAGE_SIZE } from "@/lib/constants";
import { generateCustomMetadata } from "@/lib/utils";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

const title = "Orders - Admin";
const slug = "/admin/order";

export const metadata = generateCustomMetadata({
	mainTitle: title,
	maybeSeoTitle: title,
	maybeSeoDescription: siteConfig.description,
	slug,
});

interface OrdersProps {
	searchParams?: Record<string, string | string[] | undefined>;
}

export default async function Orders(props: OrdersProps): Promise<JSX.Element> {
	const session = await getServerAuthSession();

	if (!session || !session.user || session.user.role !== "ADMIN") {
		return notFound();
	}

	const page = props.searchParams?.page ? Number(props.searchParams.page) : 1;

	const searchTerm = (props.searchParams?.s ?? "") as string;

	const searchType = (props.searchParams?.st ?? "id") as "id" | "user";

	const orders = await api.admin.order.orders({
		page,
		searchTerm,
		searchType,
	});

	return (
		<main className="container mb-24 flex max-w-4xl flex-col gap-8 py-10">
			<UserInfoBar session={session} />
			<AdminNav />
			<div className="flex items-center gap-4">
				<h1 className="flex-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
					All Orders
				</h1>
				<ModeToggle />
			</div>

			<OrderList
				orderData={orders.data}
				searchTerm={searchTerm}
				searchType={searchType}
				page={page}
				totalRecords={orders.count}
				pageCount={Math.ceil(orders.count / PAGE_SIZE)}
			/>
		</main>
	);
}
