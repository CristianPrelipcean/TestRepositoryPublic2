find_DrawerBoxConstruction(ConstructionId:string):ICT_tab_DrawerBoxConstruction{

	// Call the function and return the value
	let retEntry = ct_tab_DrawerBoxConstruction.find(p=> p.in_ConstructionId == ConstructionId);

	// Error if no entry in table
	if (retEntry == undefined) {
		let Text =  ConstructionId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11007',1)
		logError(ErrorMessage.Message(Text));	
	}

	// Return Value
	return retEntry!;
}