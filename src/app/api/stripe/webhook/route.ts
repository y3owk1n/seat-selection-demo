import stripe from "@/lib/stripe";
import { db } from "@/server/db";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/env";
import type Stripe from "stripe";

async function fulfilOrder({
	session,
	latestCharge,
}: {
	session: Stripe.Checkout.Session;
	latestCharge: Stripe.Charge | undefined;
}) {
	const forPlatform = session.metadata?.for;
	const entity = session.metadata?.entity;

	if (forPlatform !== "concert" && entity !== "concert") {
		return NextResponse.json(
			{ error: "Error creating checkout session" },
			{
				status: 500,
			},
		);
	}

	const paidSeatIds = session.metadata?.seats
		? (JSON.parse(session.metadata?.seats) as string[])
		: ([] as string[]);

	const userId = session.metadata?.user_id;

	if (!paidSeatIds.length) {
		return NextResponse.json(
			{ error: "Paid seats is less than 1, weird!" },
			{
				status: 500,
			},
		);
	}

	if (!userId) {
		return NextResponse.json(
			{ error: "No userId found, weird!" },
			{
				status: 500,
			},
		);
	}

	await db.$transaction(async (tx) => {
		await tx.order.create({
			data: {
				checkoutSessionId: session.id,
				userId,
				seat: {
					connect: paidSeatIds.map((seatId) => ({ id: seatId })),
				},
				receiptUrl: latestCharge?.receipt_url,
				paymentMethod: "stripe",
				paidAmount: latestCharge!.amount / 100,
			},
		});

		await tx.seat.updateMany({
			where: {
				id: {
					in: paidSeatIds,
				},
			},
			data: {
				status: "OCCUPIED",
				lockedTill: null,
				lockedByUserId: null,
			},
		});
	});
}

export async function POST(req: NextRequest) {
	const body = await req.text();
	const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

	const headersList = headers();

	const sig = headersList.get("stripe-signature");

	if (!sig) {
		return new Response("No signature");
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
	} catch (err) {
		if (err instanceof Error) {
			return new Response(`Webhook Error: ${err.message}`);
		}
		return new Response(`Webhook Error: Something is wrong`);
	}

	const eventType = event.type;

	switch (eventType) {
		case "checkout.session.completed": {
			const eventObject = event.data.object;

			const session: Stripe.Checkout.Session =
				await stripe.checkout.sessions.retrieve(eventObject.id, {
					expand: ["payment_intent", "payment_intent.latest_charge"],
				});

			const paymentIntent = session.payment_intent as
				| Stripe.PaymentIntent
				| undefined;

			const latestCharge = paymentIntent?.latest_charge as
				| Stripe.Charge
				| undefined;

			if (session.payment_status === "paid") {
				try {
					await fulfilOrder({ session, latestCharge });
				} catch (error) {
					console.error({ fulfilOrderErrorForCompleted: error });
				}
			}

			break;
		}

		case "checkout.session.async_payment_succeeded": {
			const eventObject = event.data.object;

			const session: Stripe.Checkout.Session =
				await stripe.checkout.sessions.retrieve(eventObject.id, {
					expand: ["payment_intent", "payment_intent.latest_charge"],
				});

			const paymentIntent = session.payment_intent as
				| Stripe.PaymentIntent
				| undefined;

			const latestCharge = paymentIntent?.latest_charge as
				| Stripe.Charge
				| undefined;

			// Fulfill the purchase...

			try {
				await fulfilOrder({ session, latestCharge });
			} catch (error) {
				console.error({ fulfilOrderAsyncSuceededError: error });
			}

			break;
		}

		case "checkout.session.async_payment_failed": {
			// const session = event.data.object;

			// Send an email to the customer asking them to retry their order
			// emailCustomerAboutFailedPayment(session);

			console.error("async_payment_failed");

			break;
		}
	}

	return new Response("Payment success", {
		status: 200,
	});
}
