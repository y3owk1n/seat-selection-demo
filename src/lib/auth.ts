import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export async function getSessionAndCheckRedirect() {
	const session = await getServerAuthSession();

	const hasPhone = session?.user.phone;

	if (session && !hasPhone) {
		return redirect("/update-profile");
	}

	return session;
}
