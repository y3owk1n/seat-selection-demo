"use client";
import ReactPlayer from "react-player/youtube";

interface YouTubePlayerProps {
	videoId: string;
}

export default function YouTubePlayer(props: YouTubePlayerProps) {
	return (
		<div className="relative overflow-hidden rounded-md pt-[56.25%]">
			<ReactPlayer
				style={{
					position: "absolute",
					top: 0,
					left: 0,
				}}
				url={`https://www.youtube.com/watch?v=${props.videoId}`}
				light={
					<img
						className="aspect-video h-full w-full object-cover"
						// src={`https://img.youtube.com/vi/${props.videoId}/hqdefault.jpg`}
						src={`https://i.ytimg.com/vi/${props.videoId}/maxresdefault.jpg`}
						alt="Thumbnail"
					/>
				}
				width="100%"
				height="100%"
			/>
		</div>
	);
}
