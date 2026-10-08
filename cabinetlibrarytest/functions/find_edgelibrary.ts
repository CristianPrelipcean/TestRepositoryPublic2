find_EdgeLibrary(EdgeCode:string):ICT_tab_EdgeLibrary{
	let	retEntry= ct_tab_EdgeLibrary.find(p=> p.in_EdgeCode == EdgeCode)!;
	if (retEntry== undefined) {
		let Text = 'EdgeCode: ' + EdgeCode;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 12003',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}