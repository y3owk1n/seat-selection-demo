import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";

import { formatCurrency } from "@/lib/formatter";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface OrderListProps {
	orderData: OrderData[];
}

interface OrderData {
	orderId: string;
	seats: string[];
	checkoutSessionId: string | null;
	receiptUrl: string | null;
	paidAt: Date;
	paidAmount: number | null;
}

export default function OrderList(props: OrderListProps) {
	return (
		<Card>
			<CardHeader className="px-7">
				<CardDescription>Your orders are all here.</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Order ID</TableHead>
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
									<div>{order.orderId}</div>
								</TableCell>
								<TableCell className="table-cell">
									<div className="flex gap-2 items-center flex-nowrap">
										{order.seats.map((seat) => (
											<Badge key={seat}>{seat}</Badge>
										))}
									</div>
								</TableCell>
								<TableCell className="table-cell">
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
								<TableCell className="table-cell">
									{order.paidAt
										? dayjs(order.paidAt).fromNow()
										: "-"}
								</TableCell>
								<TableCell className="text-right">
									{order.paidAmount
										? formatCurrency(order.paidAmount)
										: "-"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
