find_FridgeNicheConstruction(startPos: number, frontHeight: number, nicheHeight: number, splittedDoor: boolean, firstFrontHeight: number, posType: string): ICT_tab_FridgeNicheConstruction{

	let retEntry = ct_tab_FridgeNicheConstruction.find(p => 
		p.in_StartPosMax >= startPos
		&& p.in_StartPosMin <= startPos
		&& p.in_FrontHeightMax >= frontHeight
		&& p.in_FrontHeightMin <= frontHeight
		&& p.in_NicheHeightMax >= nicheHeight
		&& p.in_NicheHeightMin <= nicheHeight
		&& p.in_SplittedDoor == splittedDoor
		&& p.in_FirstFrontHeightMax >= firstFrontHeight
		&& p.in_FirstFrontHeightMin <= firstFrontHeight
		&& p.in_PosType == posType
	);

	if (retEntry == undefined) {
		let Text = startPos + ' - ' + frontHeight + ' - ' + nicheHeight + ' - ' + splittedDoor + ' - ' + firstFrontHeight + ' - ' + posType;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11017',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}