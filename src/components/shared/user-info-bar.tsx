"use client";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LoginForm } from "./login";
import { ResponsiveDialogDrawer } from "./responsive-dialog-drawer";

import Image from "next/image";

import logoImg from "../../../public/assets/logo.png";

interface UserInfoBarProps {
	session: Session | null;
}

export default function UserInfoBar(props: UserInfoBarProps): JSX.Element {
	return (
		<div className="grid gap-4">
			<div className="size-10">
				<Image
					src={logoImg}
					alt="logo"
					className="size-10 rounded-full"
				/>
			</div>

			<div className="flex w-full flex-nowrap items-center justify-between gap-2 rounded-md border p-2 text-sm">
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
							👋{" "}
							<Button asChild variant="link" size="link">
								<Link href="/update-profile">
									{props.session.user.name}
								</Link>
							</Button>
						</span>
						<span className="mx-2">|</span>
						<Button asChild variant="link" size="link">
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
		</div>
	);
}
