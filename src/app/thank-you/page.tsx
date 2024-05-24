import { ModeToggle } from "@/components/dark-mode-toggle";
import UserInfoBar from "@/components/shared/user-info-bar";
import { Button } from "@/components/ui/button";
import { getSessionAndCheckRedirect } from "@/lib/auth";
import { siteConfig } from "@/lib/config";
import { generateCustomMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";
import Link from "next/link";
import { notFound } from "next/navigation";

const title = "Thank You";
const slug = "/thank-you";

export const metadata = generateCustomMetadata({
	mainTitle: title,
	maybeSeoTitle: title,
	maybeSeoDescription: siteConfig.description,
	slug,
});

export default async function ThankYou({
	searchParams,
}: {
	searchParams: Record<string, string | string[] | undefined>;
}): Promise<JSX.Element> {
	const session = await getSessionAndCheckRedirect();

	const sessionId = searchParams?.session_id;

	if (
		!session ||
		!session.user ||
		!sessionId ||
		typeof sessionId !== "string"
	) {
		return notFound();
	}

	const order = await api.order.orderBySessionId({ sessionId });

	if (!order) {
		return notFound();
	}

	return (
		<main className="container max-w-4xl flex flex-col gap-8 py-10 mb-24">
			<UserInfoBar session={session} />
			<div className="flex gap-4">
				<h1 className="flex-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
					Thank You For Your Purchase
				</h1>
				<ModeToggle />
			</div>
			<div>
				<p className="text-sm text-muted-foreground">
					You can view your order{" "}
					<Button asChild variant="link" className="p-0">
						<Link href={`/order/detail/${order.id}`}>here</Link>
					</Button>
					. Contact us if you have any questions.
				</p>
			</div>
			<div className="flex gap-4">
				<Button variant="outline" type="button" asChild>
					<Link href="/">Back To Home</Link>
				</Button>
				<Button asChild>
					<Link href="/order">View all orders</Link>
				</Button>
			</div>
		</main>
	);
}
