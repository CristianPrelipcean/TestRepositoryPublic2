find_BracketMapping(Supplier: string, BracketId: string):ICT_tab_BracketMapping{

	let retEntry = ct_tab_BracketMapping.find(p => p.in_Supplier == Supplier && p.in_BracketId == BracketId)!;
	
	if (retEntry == undefined) {
		let Text = Supplier + " - " + BracketId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13015',1);
		logError(ErrorMessage.Message(Text));
	}	

	return retEntry!;
}