find_DrawerBoxMapping(BoxDesign:string, BoxProgram:string,BoxColor: string, BoxDepth:string, BoxHeight:string, BoxWeight: string, OpeningType:string):ICT_tab_DrawerBoxMapping{
	
	// Call the function and return the value
	let retEntry = ct_tab_DrawerBoxMapping.find(p=> p.in_BoxDesign == BoxDesign && p.in_BoxProgram == BoxProgram && p.in_BoxColor == BoxColor && p.in_BoxDepth == BoxDepth && p.in_BoxHeight == BoxHeight && p.in_BoxWeight == BoxWeight && p.in_OpeningType == OpeningType);
	if (retEntry == undefined) {
		let Text =  BoxDesign + ' - ' + BoxProgram + ' - ' + BoxColor + ' - ' + BoxDepth + ' - ' + BoxHeight + ' - ' + BoxWeight + ' - ' + OpeningType;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13006',1)
		logError(ErrorMessage.Message(Text));
	}

	// Return Value
	return retEntry!;
}