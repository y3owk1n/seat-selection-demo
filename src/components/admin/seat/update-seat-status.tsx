"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { updateSeatStatusSchema } from "@/lib/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Seat } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

const formSchema = updateSeatStatusSchema;

interface UpdateSeatStatusFormProps {
	id: Seat["id"];
	label: Seat["label"];
	status: Seat["status"];
}

export default function UpdateSeatStatusForm(props: UpdateSeatStatusFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			status: props.status === "OCCUPIED" ? "EMPTY" : "OCCUPIED",
		},
	});

	const router = useRouter();

	const updateSeatStatus = api.admin.seat.updateSeatStatus.useMutation();

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await updateSeatStatus.mutateAsync({
				...values,
				seatId: props.id,
			});

			toast.success("Seat status updated successfully");

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
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Seat Status</FormLabel>
									<FormDescription>
										Current Status:
										<Badge
											className="ml-2"
											variant={
												props.status === "EMPTY"
													? "default"
													: "destructive"
											}
										>
											{props.status}
										</Badge>
									</FormDescription>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem
												value="OCCUPIED"
												disabled={
													props.status === "OCCUPIED"
												}
											>
												Set to occupied
											</SelectItem>
											<SelectItem
												value="EMPTY"
												disabled={
													props.status === "EMPTY"
												}
											>
												Set to empty
											</SelectItem>
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
					</div>
					<Button
						disabled={
							updateSeatStatus.isPending ||
							form.getValues().status === props.status
						}
						isLoading={updateSeatStatus.isPending}
						type="submit"
						className="w-full"
					>
						Update
					</Button>
				</div>
			</form>
		</Form>
	);
}
