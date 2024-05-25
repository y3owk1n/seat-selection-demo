import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import dynamic from "next/dynamic";

const YouTubePlayer = dynamic(() => import("../shared/youtube-player"), {
	ssr: false,
});

const videoData: { title: string; key: string; videoId: string }[] = [
	{
		title: "2024 UDC Short Film",
		key: "2024-udc-short-film",
		videoId: "LL95S4cIp90",
	},
	{
		title: "2023 UDC Recaps",
		key: "2023-udc-recaps",
		videoId: "LL95S4cIp90",
	},
];

export default function Videos() {
	return (
		<Tabs defaultValue={videoData[0]!.key}>
			<TabsList>
				{videoData.map((video) => (
					<TabsTrigger key={video.title} value={video.key}>
						{video.title}
					</TabsTrigger>
				))}
			</TabsList>
			{videoData.map((video) => (
				<TabsContent
					key={video.key}
					value={video.key}
					className="bg-gray-900 rounded-md aspect-video w-full h-full"
				>
					<YouTubePlayer videoId={video.videoId} />
				</TabsContent>
			))}
		</Tabs>
	);
}
