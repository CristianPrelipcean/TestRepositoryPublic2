find_OvenConstruction(ConstructionId: string): ICT_tab_OvenConstruction{

	let retEntry = ct_tab_OvenConstruction.find(p => p.in_ConstructionId == ConstructionId);

	if (retEntry == undefined) {
		let Text = ConstructionId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11009',1);
		logError(ErrorMessage.Message(Text));
	}

	return retEntry!;
}