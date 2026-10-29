find_HangerSettings(TypeElement: string, CarcaseHeight: number, CarcaseWidth: number, Weight: number, DistanceBehindBackwall: number, BackwallPosition: number): ICT_tab_HangerSettings | undefined{
	
	// Save original values of variables that allow wildcards
	const typeElementIn = TypeElement;

	let retEntry =
		queryTable(typeElementIn) ??
		queryTable('All');

	if (retEntry == undefined) {
		const text = ' TypeElement: ' + typeElementIn + ' and CarcaseHeight: ' + CarcaseHeight + ' and CarcaseWidth: ' + CarcaseWidth + ' and Weight: ' + Weight + ' and DistanceBehindBackwall: ' + DistanceBehindBackwall + ' and BackwallPosition: ' + BackwallPosition;
		const errorMessage = GlobalFunc.find_ErrorList('Error 14010', 1);
		logError(errorMessage.Message(text));
	}

	return retEntry;

	function queryTable(typeElement: string): ICT_tab_HangerSettings | undefined {
		return ct_tab_HangerSettings.find(p =>
			p.in_TypeElement === typeElement &&
			p.in_CarcaseHeightMin! <= CarcaseHeight &&
			p.in_CarcaseHeightMax! >= CarcaseHeight &&
			p.in_CarcaseWidthMin! <= CarcaseWidth &&
			p.in_CarcaseWidthMax! >= CarcaseWidth &&
			p.in_WeightMin! <= Weight &&
			p.in_WeightMax! >= Weight &&
			p.in_DistanceBehindBackwallMin! <= DistanceBehindBackwall &&
			p.in_BackwallPositionMin! <= BackwallPosition &&
			p.in_BackwallPositionMax! >= BackwallPosition
		);
	}
}
