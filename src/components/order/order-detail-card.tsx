import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCollectionLabelByValue } from "@/lib/collection-method";
import { formatCurrency } from "@/lib/formatter";
import dayjs from "dayjs";

interface OrderDetailCardProps {
	orderId: string;
	paidAt: Date;
	updatedAt: Date;
	seats: {
		label: string;
		price: number;
	}[];
	subTotal: number;
	paidAmount: number;
	checkoutSessionId: string | null;
	receiptUrl: string | null;
	processingFeeAmount: number;
	collectionMethod: string;
}

export default function OrderDetailCard(props: OrderDetailCardProps) {
	return (
		<Card className="overflow-hidden">
			<CardHeader className="flex flex-row items-start bg-muted/50">
				<div className="grid gap-0.5">
					<CardTitle className="group flex items-center gap-2 text-lg">
						Order {props.orderId}
					</CardTitle>
					<CardDescription>
						Date: {dayjs(props.paidAt).format("MMMM DD, YYYY")}
					</CardDescription>
					<CardDescription>
						Collection Method:{" "}
						{getCollectionLabelByValue(props.collectionMethod)}
					</CardDescription>

					<div>
						<Button variant="link" className="p-0 mt-4">
							<a
								target="_blank"
								rel="noreferrer"
								href={props.receiptUrl ?? "#"}
							>
								View Receipt
							</a>
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-6 text-sm">
				<div className="grid gap-3">
					<div className="font-semibold">Order Details</div>
					<ul className="grid gap-3">
						{props.seats.map((seat) => (
							<li
								key={seat.label}
								className="flex items-center justify-between"
							>
								<span className="text-muted-foreground">
									Seat: {seat.label}
								</span>
								<span>{formatCurrency(seat.price)}</span>
							</li>
						))}
					</ul>
					<Separator className="my-2" />
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">
								Subtotal
							</span>
							<span>{formatCurrency(props.subTotal)}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">
								Processing Fee (3%)
							</span>
							<span>
								{formatCurrency(props.processingFeeAmount)}
							</span>
						</li>
						<li className="flex items-center justify-between font-semibold">
							<span className="text-muted-foreground">Total</span>
							<span>{formatCurrency(props.paidAmount)}</span>
						</li>
					</ul>
				</div>
			</CardContent>
			<CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
				<div className="text-xs text-muted-foreground">
					Updated{" "}
					<time
						dateTime={dayjs(props.updatedAt).format("DD-MM-YYYY")}
					>
						{dayjs(props.updatedAt).format("MMMM DD, YYYY")}
					</time>
				</div>
			</CardFooter>
		</Card>
	);
}
