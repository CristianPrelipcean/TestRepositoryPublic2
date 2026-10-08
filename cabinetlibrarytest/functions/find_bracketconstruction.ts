find_BracketConstruction(ConstructionId: string, ShelfThk: number, Shelfdepth: number, ShelfWidth: number): ICT_tab_BracketConstruction{

	let retEntry = ct_tab_BracketConstruction.find(p => p.in_ConstructionId == ConstructionId && p.in_ShelfThk == ShelfThk && p.in_ShelfDepthMin < Shelfdepth && p.in_ShelfDepthMax >= Shelfdepth && p.in_ShelfLenghtMin < ShelfWidth && p.in_ShelfLenghtMax >= ShelfWidth);

	if (retEntry == undefined) {
		let Text = ConstructionId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11015',1);
		logError(ErrorMessage.Message(Text));
	}

	return retEntry!;
}