"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export default function AdminNav() {
	const pathname = usePathname();

	const isActive = (path: string) => {
		return pathname === path;
	};

	return (
		<div className="flex gap-2">
			<Button
				variant={isActive("/admin/analytics") ? "default" : "outline"}
			>
				<Link href="/admin/analytics">Analytics</Link>
			</Button>
			<Button variant={isActive("/admin/order") ? "default" : "outline"}>
				<Link href="/admin/order">Orders</Link>
			</Button>
		</div>
	);
}
