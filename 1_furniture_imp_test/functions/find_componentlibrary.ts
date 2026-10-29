find_ComponentLibrary(ProcessingId: string): ICT_tab_ComponentLibrary{

  let retEntry = ct_tab_ComponentLibrary.find(p => p.in_ProcessingId == ProcessingId);

	if (retEntry == undefined) {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 12007',1);
    logError(ErrorMessage.Message(ProcessingId));
	}

	return retEntry!;
}