find_OvenMapping(Supplier: string,OvenId: string):ICT_tab_OvenMapping{

	let retEntry = ct_tab_OvenMapping.find(p => p.in_Supplier == Supplier && p.in_OvenId == OvenId)!;

	if (retEntry == undefined) {
		let Text = Supplier + ', ' + OvenId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13016',1);
		logError(ErrorMessage.Message(Text));
	}

	return retEntry;
}