find_GraphicFileLibrary(GraphicFileId:string):ICT_tab_GraphicFileLibrary{

  let retEntry = ct_tab_GraphicFileLibrary.find(p => p.in_GraphicFileId == GraphicFileId)
	if (retEntry == undefined) {
    let Text = 'GraphicFileId: ' + GraphicFileId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 12006',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
} 