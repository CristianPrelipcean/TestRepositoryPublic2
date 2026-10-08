find_SinkMapping(Supplier: string, SinkId: string):ICT_tab_SinkMapping{

	let retEntry = ct_tab_SinkMapping.find(p => p.in_Supplier == Supplier && p.in_SinkId == SinkId)!;
	
	if (retEntry == undefined) {
		let Text = Supplier + " - " + SinkId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13026',1);
		logError(ErrorMessage.Message(Text));
	}	

	return retEntry!;
}