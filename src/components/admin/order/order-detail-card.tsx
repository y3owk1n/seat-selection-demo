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
import { formatCurrency } from "@/lib/formatter";
import { type User } from "@prisma/client";
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
	user: User | null;
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

					{props.user && (
						<>
							<Separator className="my-4" />
							<div className="grid gap-3">
								<div className="font-semibold">
									Customer Information
								</div>
								<dl className="grid gap-3">
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">
											Customer
										</dt>
										<dd>{props.user.fullName}</dd>
									</div>
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">
											Email
										</dt>
										<dd>
											<a
												className="hover:underline underline-offset-4"
												href={`mailto:${props.user.email}`}
											>
												{props.user.email}
											</a>
										</dd>
									</div>
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">
											Phone
										</dt>
										<dd>
											<a
												className="hover:underline underline-offset-4"
												href={`tel:${props.user.phone}`}
											>
												{props.user.phone}
											</a>
										</dd>
									</div>
								</dl>
							</div>
						</>
					)}
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
