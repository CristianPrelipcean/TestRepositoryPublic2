find_HoodMapping(Supplier: string, HoodId: string):ICT_tab_HoodMapping{

	let retEntry = ct_tab_HoodMapping.find(p => p.in_Supplier == Supplier && p.in_HoodId == HoodId)!;
	
	if (retEntry == undefined) {
		let Text = Supplier + " - " + HoodId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13024',1);
		logError(ErrorMessage.Message(Text));
	}	

	return retEntry!;
}
