"use client";
import { ResponsiveDialogDrawer } from "@/components/shared/responsive-dialog-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { cn } from "@/lib/utils";
import { type Seat } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import UpdateSeatStatusForm from "./update-seat-status";
dayjs.extend(relativeTime);

interface SeatListProps {
	seatData: Seat[];
	searchTerm: string;
	page: number;
	pageCount: number;
	totalRecords: number;
}

export default function SeatList(props: SeatListProps) {
	const [currentSearchTerm, setCurrentSearchTerm] = useState(
		props.searchTerm,
	);

	const [debouncedSearchTerm] = useDebouncedValue(currentSearchTerm, 1000);

	const { redirectWithQs } = useQueryString([props.seatData]);

	useEffect(() => {
		redirectWithQs("s", debouncedSearchTerm);
	}, [debouncedSearchTerm, redirectWithQs]);

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
				<CardDescription>All seats are listed here.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex mb-4">
					<Input
						type="search"
						placeholder="Search by Seat Label"
						value={currentSearchTerm}
						onChange={(event) => {
							setCurrentSearchTerm(event.target.value);
						}}
						className="w-full max-w-full md:max-w-sm"
					/>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Seat Label</TableHead>
							<TableHead className="table-cell">Status</TableHead>
							<TableHead className="table-cell">Price</TableHead>
							<TableHead className="table-cell">
								Order ID
							</TableHead>
							<TableHead>
								<span className="sr-only">Actions</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{props.seatData.map((seat) => (
							<TableRow key={seat.id}>
								<TableCell>{seat.label}</TableCell>
								<TableCell className="table-cell">
									<div className="flex gap-2 items-center flex-nowrap">
										<Badge
											variant={
												seat.status === "EMPTY"
													? "default"
													: "destructive"
											}
										>
											{seat.status}
										</Badge>
										{seat.status === "OCCUPIED" &&
											!seat.orderId && (
												<Badge variant="secondary">
													Reserved
												</Badge>
											)}
									</div>
								</TableCell>
								<TableCell className="table-cell">
									{formatCurrency(seat.price)}
								</TableCell>
								<TableCell
									className={cn(
										"table-cell",
										!seat.orderId &&
											"text-muted-foreground",
									)}
								>
									{seat.orderId ? (
										<Button
											variant="link"
											className="p-0 underline"
										>
											<Link
												href={
													`/admin/order/detail/${seat.orderId}` ??
													"#"
												}
											>
												Go to order
											</Link>
										</Button>
									) : (
										"No order yet"
									)}
								</TableCell>

								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												aria-haspopup="true"
												size="icon"
												variant="ghost"
											>
												<MoreHorizontal className="h-4 w-4" />
												<span className="sr-only">
													Toggle menu
												</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>
												Actions
											</DropdownMenuLabel>

											<ResponsiveDialogDrawer
												buttonEl={
													<DropdownMenuItem
														onSelect={(e) => {
															e.preventDefault();
														}}
														disabled={
															seat.status ===
																"OCCUPIED" &&
															!!seat.orderId
														}
													>
														Update Seat Status
													</DropdownMenuItem>
												}
												title={`Update Seat Status for ${seat.label}`}
											>
												<UpdateSeatStatusForm
													{...seat}
												/>
											</ResponsiveDialogDrawer>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter className="grid gap-2">
				<div className="text-xs text-muted-foreground">
					Total <strong>{props.totalRecords}</strong> seats in record
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
							<span className="text-xs px-4">{props.page}</span>
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
