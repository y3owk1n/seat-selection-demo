import { siteConfig } from "@/lib/config";
import { getBaseUrl } from "@/lib/utils";
import { type MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const dateNow = new Date();
	return [
		{
			url: getBaseUrl(siteConfig.url),
			lastModified: dateNow,
		},
	];
}
