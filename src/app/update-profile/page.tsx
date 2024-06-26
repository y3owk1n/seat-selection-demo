import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import UpdateProfileForm from "@/components/update-profile/update-profile-form";
import { siteConfig } from "@/lib/config";
import { generateCustomMetadata } from "@/lib/utils";
import { getServerAuthSession } from "@/server/auth";
import { notFound } from "next/navigation";

const title = "Update Profile";
const slug = "/update-profile";

export const metadata = generateCustomMetadata({
	mainTitle: title,
	maybeSeoTitle: title,
	maybeSeoDescription: siteConfig.description,
	slug,
});

export default async function UpdateProfile(): Promise<JSX.Element> {
	const session = await getServerAuthSession();

	if (!session || !session.user) {
		return notFound();
	}

	return (
		<main className="container mb-24 flex max-w-4xl flex-col gap-8 py-10">
			<Card className="mx-auto max-w-sm">
				<CardHeader>
					<CardTitle className="text-xl">
						Complete Your Profile
					</CardTitle>
					<CardDescription>
						We will use this information to contact you
					</CardDescription>
				</CardHeader>
				<CardContent>
					<UpdateProfileForm {...session.user} />
				</CardContent>
			</Card>
		</main>
	);
}
