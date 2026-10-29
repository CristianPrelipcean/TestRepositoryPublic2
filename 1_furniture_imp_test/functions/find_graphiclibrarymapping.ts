find_GraphicLibraryMapping(GraphicItem:string):ICT_tab_GraphicLibraryMapping[]{
	let retEntry = ct_tab_GraphicLibraryMapping.filter(p=> p.in_GraphicItem == GraphicItem)!;
	if (retEntry == undefined) {
		let Text = 'Graphic Item: ' + GraphicItem;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13011',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
	}