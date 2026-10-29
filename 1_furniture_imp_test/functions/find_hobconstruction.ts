find_HobConstruction(ConstructionId: string): ICT_tab_HobConstruction{

	let retEntry = ct_tab_HobConstruction.find(p => p.in_ConstructionId == ConstructionId);

	if (retEntry == undefined) {
		let Text = ConstructionId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11013',1);
		logError(ErrorMessage.Message(Text));
	}

	return retEntry!;
}