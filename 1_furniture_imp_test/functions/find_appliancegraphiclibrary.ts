find_ApplianceGraphicLibrary(GraphicId: string): ICT_tab_ApplianceGraphicLibrary[]{

	let retEntry = ct_tab_ApplianceGraphicLibrary.filter(p => p.in_GraphicId == GraphicId);

	if (retEntry == undefined) {
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11012',1);
		logError(ErrorMessage.Message(GraphicId));
	}

	return retEntry!;
}