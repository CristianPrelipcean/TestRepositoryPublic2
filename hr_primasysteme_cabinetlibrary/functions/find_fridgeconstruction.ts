find_FridgeConstruction(ConstructionId: string): ICT_tab_FridgeConstruction{
	
	let retEntry = ct_tab_FridgeConstruction.find(p => p.in_ConstructionId == ConstructionId);

	if(retEntry == undefined) {
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11008',1);
		logError(ErrorMessage.Message(ConstructionId!));
	}

	return retEntry!;
}