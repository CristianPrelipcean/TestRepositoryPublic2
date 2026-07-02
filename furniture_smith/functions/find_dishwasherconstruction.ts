find_DishwasherConstruction(ConstructionId: string): ICT_tab_DishwasherConstruction{

	let retEntry = ct_tab_DishwasherConstruction.find(p => p.in_ConstructionId == ConstructionId);

	if (retEntry == undefined) {
		let Text = ConstructionId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11015',1);
		logError(ErrorMessage.Message(Text));
	}

	return retEntry!;
}