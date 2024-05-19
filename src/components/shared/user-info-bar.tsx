"use client";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LoginForm } from "./login";
import { ResponsiveDialogDrawer } from "./responsive-dialog-drawer";

interface UserInfoBarProps {
	session: Session | null;
}

export default function UserInfoBar(props: UserInfoBarProps): JSX.Element {
	return (
		<div className="border rounded-md p-2 text-sm flex gap-2 flex-nowrap justify-between items-center">
			{props.session ? (
				<div className="flex items-center gap-2">
					<Avatar className="size-6">
						<AvatarImage
							src={props.session.user.image ?? undefined}
						/>
						<AvatarFallback>
							{props.session.user.name?.charAt(0)}
						</AvatarFallback>
					</Avatar>

					<span>
						Hello!{" "}
						<Button asChild variant="link" className="p-0">
							<Link href="/update-profile">
								{props.session.user.name}
							</Link>
						</Button>
					</span>
					<span className="mx-2">|</span>
					<Button asChild variant="link" className="p-0">
						<Link href="/order">View orders</Link>
					</Button>
				</div>
			) : (
				<span>Login with your account now to continue</span>
			)}

			{props.session ? (
				<Button size="sm" onClick={() => signOut()}>
					Logout
				</Button>
			) : (
				<ResponsiveDialogDrawer
					title="Sign In"
					description="Use the following method to sign in"
					buttonText="Login/Signup"
					buttonSize="sm"
				>
					<LoginForm />
				</ResponsiveDialogDrawer>
			)}
		</div>
	);
}
