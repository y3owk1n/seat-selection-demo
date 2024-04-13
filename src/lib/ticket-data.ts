import { type Ticket } from "./ticket";

export const tickets: Ticket[] = [
	{
		id: "5442eae2-0319-4522-abdc-6b3fb03f180d",
		label: "VIP",
		category: "VIP",
		price: 100,
		color: "#ef4444",
		sections: [
			{
				id: "eab18a81-3c28-4ae7-8e43-09619802ce03",
				label: "101",
			},
			{
				id: "649d8219-a05d-4776-8a0d-b86aeeff76ec",
				label: "102",
			},
		],
	},
	{
		id: "b9973971-b5ed-4a6e-ac8a-49bc7ffae5c8",
		label: "Standard",
		category: "Standard",
		price: 80,
		color: "#a855f7",
		sections: [
			{
				id: "fcfb5b24-6e6d-4c0a-bdda-31656b1b5386",
				label: "103",
			},
			{
				id: "4f50ac2e-0790-458b-8db5-34a02ef30408",
				label: "104",
			},
		],
	},
	{
		id: "b70e14d9-5d01-44c8-926e-c80f69731407",
		label: "Cheap",
		category: "Cheap",
		price: 50,
		color: "#71717a",
		sections: [
			{
				id: "4cd5e55a-1261-4d0b-bd9f-9a6d96bb0458",
				label: "105",
			},
			{
				id: "59558c30-ca63-4e2a-93c0-fd90de8713df",
				label: "106",
			},
			{
				id: "55b6edb0-2833-4fdc-90ca-95df3b9f64dc",
				label: "107",
			},
		],
	},
];
