import { useState } from "react";

interface UseZoom {
	zoomLevel: number;
	zoomIn: () => void;
	zoomOut: () => void;
}

interface UseZoomProps {
	initialZoomLevel?: number;
	zoomInterval?: number;
}

export function useZoom({
	initialZoomLevel = 100,
	zoomInterval = 25,
}: UseZoomProps): UseZoom {
	const [zoomLevel, setZoomLevel] = useState(initialZoomLevel); // Initial zoom level

	function zoomIn(): void {
		setZoomLevel((prevZoom) => prevZoom + zoomInterval); // Increase zoom level by 10%
	}

	function zoomOut(): void {
		setZoomLevel((prevZoom) => prevZoom - zoomInterval); // Decrease zoom level by 10%
	}

	return { zoomLevel, zoomIn, zoomOut };
}
