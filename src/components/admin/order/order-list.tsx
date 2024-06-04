"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationFirst,
	PaginationItem,
	PaginationLast,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useQueryString } from "@/hooks/use-query-string";
import { formatCurrency } from "@/lib/formatter";
import { type User } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
dayjs.extend(relativeTime);

interface OrderListProps {
	orderData: OrderData[];
	searchTerm: string;
	searchType: "id" | "user";
	page: number;
	pageCount: number;
	totalRecords: number;
}

interface OrderData {
	orderId: string;
	seats: string[];
	checkoutSessionId: string | null;
	receiptUrl: string | null;
	paidAt: Date;
	paidAmount: number;
	user: Partial<Pick<User, "fullName" | "phone">>;
}

export default function OrderList(props: OrderListProps) {
	const [currentSearchTerm, setCurrentSearchTerm] = useState(
		props.searchTerm,
	);

	const [debouncedSearchTerm] = useDebouncedValue(currentSearchTerm, 1000);

	const [currentSearchType, setCurrentSearchType] = useState<"id" | "user">(
		props.searchType,
	);

	const { redirectWithQs } = useQueryString([props.orderData]);

	useEffect(() => {
		redirectWithQs("s", debouncedSearchTerm);
	}, [debouncedSearchTerm, redirectWithQs]);

	const setSearchType = useCallback(
		(currentSearchType: "id" | "user") => {
			setCurrentSearchType(currentSearchType);
			redirectWithQs("st", currentSearchType);
		},
		[redirectWithQs],
	);

	const goToFirst = useCallback(() => {
		if (props.page <= 1) {
			return;
		}
		redirectWithQs("page", "1");
	}, [props.page, redirectWithQs]);

	const goToPreviousPage = useCallback(() => {
		if (props.page <= 1) {
			return;
		}
		redirectWithQs("page", String(props.page - 1));
	}, [props.page, redirectWithQs]);

	const goToNextPage = useCallback(() => {
		if (props.page >= props.pageCount) {
			return;
		}
		redirectWithQs("page", String(props.page + 1));
	}, [props.page, props.pageCount, redirectWithQs]);

	const goToLast = useCallback(() => {
		if (props.page >= props.pageCount) {
			return;
		}
		redirectWithQs("page", String(props.pageCount));
	}, [props.page, props.pageCount, redirectWithQs]);

	return (
		<Card>
			<CardHeader>
				<CardDescription>All orders are listed here.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="mb-4 flex">
					<Input
						type="search"
						placeholder={`Search by ${
							currentSearchType === "id"
								? "Order ID"
								: "User name, email or phone"
						}`}
						value={currentSearchTerm}
						onChange={(event) => {
							setCurrentSearchTerm(event.target.value);
						}}
						className="w-full max-w-full flex-[100%] rounded-r-none border-r-0 md:max-w-sm"
					/>
					<Select
						value={currentSearchType}
						onValueChange={(e: "id" | "user") => setSearchType(e)}
					>
						<SelectTrigger className="w-fit rounded-l-none">
							<SelectValue placeholder="Search Type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="id">ID</SelectItem>
							<SelectItem value="user">User</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Order ID</TableHead>
							<TableHead className="table-cell">Name</TableHead>
							<TableHead className="table-cell">Phone</TableHead>
							<TableHead className="table-cell">Seats</TableHead>
							<TableHead className="table-cell">
								Receipt
							</TableHead>
							<TableHead className="table-cell">
								Paid At
							</TableHead>
							<TableHead className="text-right">Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{props.orderData.map((order) => (
							<TableRow key={order.orderId}>
								<TableCell>
									<Button variant="link" className="p-0">
										<Link
											href={
												`/admin/order/detail/${order.orderId}` ??
												"#"
											}
										>
											{order.orderId}
										</Link>
									</Button>
								</TableCell>
								<TableCell className="table-cell min-w-40">
									{order.user.fullName ?? "-"}
								</TableCell>
								<TableCell className="table-cell min-w-40">
									{order.user.phone ?? "-"}
								</TableCell>
								<TableCell className="table-cell min-w-40">
									<div className="flex flex-nowrap items-center gap-2">
										{order.seats.map((seat) => (
											<Badge key={seat}>{seat}</Badge>
										))}
									</div>
								</TableCell>
								<TableCell className="table-cell min-w-40">
									<Button variant="link" className="p-0">
										<a
											target="_blank"
											rel="noreferrer"
											href={order.receiptUrl ?? "#"}
										>
											View
										</a>
									</Button>
								</TableCell>
								<TableCell className="table-cell min-w-40">
									{order.paidAt
										? dayjs(order.paidAt).fromNow()
										: "-"}
								</TableCell>
								<TableCell className="min-w-40 text-right">
									{order.paidAmount
										? formatCurrency(order.paidAmount)
										: "-"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter className="grid gap-2">
				<div className="text-xs text-muted-foreground">
					Total <strong>{props.totalRecords}</strong> orders in record
				</div>
				<div>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationFirst
									onClick={goToFirst}
									disabled={props.page <= 1}
								/>
							</PaginationItem>
							<PaginationItem>
								<PaginationPrevious
									disabled={props.page <= 1}
									onClick={goToPreviousPage}
								/>
							</PaginationItem>
							<span className="px-4 text-xs">{props.page}</span>
							<PaginationItem>
								<PaginationNext
									onClick={goToNextPage}
									disabled={props.page >= props.pageCount}
								/>
							</PaginationItem>
							<PaginationItem>
								<PaginationLast
									onClick={goToLast}
									disabled={props.page >= props.pageCount}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</CardFooter>
		</Card>
	);
}
