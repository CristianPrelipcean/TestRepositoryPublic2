find_ApplianceMapping (Supplier: string, ApplianceId: string): ICT_tab_ApplianceMapping{

  let retEntry = ct_tab_ApplianceMapping.find(p => p.in_Supplier == Supplier && p.in_ApplianceId == ApplianceId);

	if (retEntry == undefined) {
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13045',1);
    logError(ErrorMessage.Message(Supplier + ', ' + ApplianceId));
	}

	return retEntry!;
}