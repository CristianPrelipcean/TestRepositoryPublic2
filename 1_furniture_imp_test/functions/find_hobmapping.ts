find_HobMapping(Supplier: string, HobId: string):ICT_tab_HobMapping{

	let retEntry = ct_tab_HobMapping.find(p => p.in_Supplier == Supplier && p.in_HobId == HobId)!;
	
	if (retEntry == undefined) {
		let Text = Supplier + " - " + HobId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13025',1);
		logError(ErrorMessage.Message(Text));
	}	

	return retEntry!;
}