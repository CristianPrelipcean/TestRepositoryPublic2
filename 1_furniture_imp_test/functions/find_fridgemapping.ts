find_FridgeMapping(Supplier: string, FridgeId: string):ICT_tab_FridgeMapping{

	let retEntry = ct_tab_FridgeMapping.find(p => p.in_Supplier == Supplier && p.in_FridgeId == FridgeId)!;
	
	if (retEntry == undefined) {
		let Text = Supplier + " - " + FridgeId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13015',1);
		logError(ErrorMessage.Message(Text));
	}	

	return retEntry!;
}

