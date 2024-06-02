import SeatList from "@/components/admin/seat/seat-list";
import { ModeToggle } from "@/components/dark-mode-toggle";
import AdminNav from "@/components/shared/admin-nav";
import UserInfoBar from "@/components/shared/user-info-bar";
import { siteConfig } from "@/lib/config";
import { PAGE_SIZE } from "@/lib/constants";
import { generateCustomMetadata } from "@/lib/utils";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

const title = "Seats - Admin";
const slug = "/admin/seat";

export const metadata = generateCustomMetadata({
	mainTitle: title,
	maybeSeoTitle: title,
	maybeSeoDescription: siteConfig.description,
	slug,
});

interface SeatsProps {
	searchParams?: Record<string, string | string[] | undefined>;
}

export default async function Seats(props: SeatsProps): Promise<JSX.Element> {
	const session = await getServerAuthSession();

	if (!session || !session.user || session.user.role !== "ADMIN") {
		return notFound();
	}

	const page = props.searchParams?.page ? Number(props.searchParams.page) : 1;

	const searchTerm = (props.searchParams?.s ?? "") as string;

	const seats = await api.admin.seat.seats({
		page,
		searchTerm,
	});

	return (
		<main className="container max-w-4xl flex flex-col gap-8 py-10 mb-24">
			<UserInfoBar session={session} />
			<AdminNav />
			<div className="flex items-center gap-4">
				<h1 className="flex-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
					Seats Management
				</h1>
				<ModeToggle />
			</div>

			<SeatList
				seatData={seats.data}
				searchTerm={searchTerm}
				page={page}
				totalRecords={seats.count}
				pageCount={Math.ceil(seats.count / PAGE_SIZE)}
			/>
		</main>
	);
}
