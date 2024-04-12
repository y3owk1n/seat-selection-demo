import { tickets } from "./ticket-data";

export interface Ticket {
	id: string;
	label: string;
	category: string;
	price: number;
	color: string;
}

export function getTicketDetails(id: string): Ticket | undefined {
	return tickets.find((ticket) => ticket.id === id);
}
