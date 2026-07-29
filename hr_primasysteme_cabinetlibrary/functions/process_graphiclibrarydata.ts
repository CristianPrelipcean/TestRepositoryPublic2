process_GraphicLibraryData(GroupName: string): [ICT_tab_GraphicLibrary | undefined, ICT_tab_GraphicFileLibrary | undefined] {

	let file3dModel: ICT_tab_GraphicFileLibrary | undefined;
	let retGraphicLib = ct_tab_GraphicLibrary.find(p => p.in_Model3DGroupName == GroupName);

	if (retGraphicLib == undefined) {
		let Text = 'Model3DGroupName: ' + GroupName;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 12004', 1);
		logError(ErrorMessage.Message(Text));
	}
	else {
		file3dModel = ct_tab_GraphicFileLibrary.find(p => p.in_GraphicFileId == retGraphicLib.GraphicFileId);

		if (file3dModel == undefined) {
			let Text = 'Model3DGroupName: ' + GroupName;
			let ErrorMessage = GlobalFunc.find_ErrorList('Error 12004', 1);
			logError(ErrorMessage.Message(Text));
		}
	}

	return [retGraphicLib, file3dModel];
}