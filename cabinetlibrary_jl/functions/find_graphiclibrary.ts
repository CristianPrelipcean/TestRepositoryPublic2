find_GraphicLibrary(GroupName:string):ICT_tab_GraphicLibrary{

	let retEntry = ct_tab_GraphicLibrary.find(p=> p.in_Model3DGroupName == GroupName)
	if (retEntry == undefined) {
		let Text = 'Model3DGroupName: ' + GroupName;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 12004',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}