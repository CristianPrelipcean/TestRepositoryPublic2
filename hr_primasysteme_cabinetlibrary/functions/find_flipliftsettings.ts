find_FlipliftSettings(flipliftType: string, width: number, depth: number, height: number, openingType: string, hardwareType: string, inverse: boolean): ICT_tab_FlipliftSettings {
  
	let retEntry: ICT_tab_FlipliftSettings | undefined;

	// Sorting by priority (to get the first valid row with the lowest priority)
	const sortedSettings = ct_tab_FlipliftSettings.sort((a, b) => a.Priority - b.Priority);

	// Define the filter criteria
	const filterConditions = (p: any) =>
	p.in_FlipliftType == flipliftType &&
	p.in_HeightMin <= height && p.in_HeightMax >= height &&
	p.in_WidthMin <= width && p.in_WidthMax >= width &&
	p.in_DepthMin <= depth &&
	p.in_OpeningType == openingType &&
	(!inverse || p.FlipliftHardwareType == hardwareType); // To get the hardwareType from the attribute (Not automatic)

	// Find the entry in the table
	retEntry = sortedSettings.find(filterConditions);

	// Error handling
	if (!retEntry) {
	let text = `${flipliftType} - ${height} - ${width} - ${depth} - ${openingType}`;
	let errorMessage = GlobalFunc.find_ErrorList('Error 14023', 1);
	logError(errorMessage.Message(text));
	}

	return retEntry!;
}