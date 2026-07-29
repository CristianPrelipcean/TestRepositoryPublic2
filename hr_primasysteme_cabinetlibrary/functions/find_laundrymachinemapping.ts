find_LaundryMachineMapping(Supplier: string, LaundryMachineId: string): ICT_tab_LaundryMachineMapping{

  let retEntry = ct_tab_LaundryMachineMapping.find(p => p.in_Supplier == Supplier && p.in_LaundryMachineId == LaundryMachineId);

	if (retEntry == undefined) {
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13032',1);
    logError(ErrorMessage.Message(Supplier + ', ' + LaundryMachineId));
	}

	return retEntry!;
}