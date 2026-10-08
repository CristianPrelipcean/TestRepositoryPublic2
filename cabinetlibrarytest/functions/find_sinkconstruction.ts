find_SinkConstruction(ConstructionId: string): ICT_tab_SinkConstruction{

	let retEntry = ct_tab_SinkConstruction.find(p => p.in_ConstructionId == ConstructionId);

	if (retEntry == undefined) {
		let Text = ConstructionId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11014',1);
		logError(ErrorMessage.Message(Text));
	}

	return retEntry!;
}