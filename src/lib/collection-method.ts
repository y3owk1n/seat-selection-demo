type CollectionMethod = {
	label: string;
	value: "studio" | "event";
};

export const collectionMethodKey = "collectionMethod";

export const collectionMethodMap: CollectionMethod[] = [
	{
		label: "Collect ticket from studio (Collection after 15th June)",
		value: "studio",
	},
	{
		label: "Collect at ticketing booth on event day",
		value: "event",
	},
];

export function getCollectionLabelByValue(value: string) {
	return collectionMethodMap.find((method) => method.value === value)?.label;
}
