"use client";
import { updateProfileSchema } from "@/lib/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { type Session } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const formSchema = updateProfileSchema;

interface UpdateProfileFormProps {
	name?: Session["user"]["name"];
	fullName: Session["user"]["fullName"];
	email?: Session["user"]["email"];
	phone: Session["user"]["phone"];
}

export default function UpdateProfileForm(props: UpdateProfileFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: props.fullName ?? "",
			email: props.email ?? "",
			phone: props.phone ?? "",
		},
	});

	const router = useRouter();

	const updateProfile = api.user.updateProfile.useMutation();

	function useNameAsFullName() {
		if (props.name) {
			form.setValue("fullName", props.name, {
				shouldDirty: true,
				shouldTouch: true,
				shouldValidate: true,
			});
		}
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await updateProfile.mutateAsync(values);

			toast.success("Your profile is updated successfully.");

			router.push("/");
			router.refresh();
			form.reset();
		} catch (e) {
			if (e instanceof TRPCClientError) {
				toast.error(e.name, {
					description: e.message,
				});
			} else if (e instanceof Error) {
				toast.error(e.name, {
					description: e.message,
				});
			} else {
				toast.error("Something went wrong", {
					description: "Try again later or contact us",
				});
			}
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid gap-4">
					<div className="grid gap-2">
						<FormField
							control={form.control}
							name="fullName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormDescription>
										How should we address you?
									</FormDescription>
									<FormControl>
										<Input placeholder="Max" {...field} />
									</FormControl>
									{props.name && (
										<FormDescription>
											<Button
												type="button"
												variant="link"
												size="link"
												className="ml-1 text-xs"
												onClick={useNameAsFullName}
											>
												Use `{props.name}` as name
											</Button>
										</FormDescription>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="grid gap-2">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormDescription>
										Email is not changeable
									</FormDescription>
									<FormControl>
										<Input
											readOnly
											disabled
											type="email"
											placeholder="Your email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="grid gap-2">
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormDescription>
										Please make sure this number is
										reachable via WhatsApp
									</FormDescription>
									<FormControl>
										<Input
											type="tel"
											placeholder="Phone Number"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button
						disabled={
							updateProfile.isPending ||
							!form.formState.isDirty ||
							!form.formState.isValid
						}
						isLoading={updateProfile.isPending}
						type="submit"
						className="w-full"
					>
						Update
					</Button>
					{props.phone && props.phone.length > 0 && (
						<Button
							variant="link"
							size="link"
							type="button"
							className="w-full"
							asChild
						>
							<Link href="/">Back To Home</Link>
						</Button>
					)}
				</div>
			</form>
		</Form>
	);
}
