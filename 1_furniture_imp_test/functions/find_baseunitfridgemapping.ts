find_BaseunitFridgeMapping(Supplier: string,BaseunitFridgeId: string):ICT_tab_BaseunitFridgeMapping{

  let retEntry = ct_tab_BaseunitFridgeMapping.find(p => p.in_Supplier == Supplier && p.in_BaseunitFridgeId == BaseunitFridgeId)!;

	if (retEntry == undefined) {
    let Text = Supplier + ', ' + BaseunitFridgeId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13028',1);
		logError(ErrorMessage.Message(Text));
	}

	return retEntry;
}