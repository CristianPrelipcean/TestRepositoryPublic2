find_EdgeLibrary(EdgeObject:string):ICT_tab_EdgeLibrary{
	let	retEntry= ct_tab_EdgeLibrary.find(p=> p.in_EdgeObject == EdgeObject)!;
	if (retEntry== undefined) {
		let Text = 'EdgeObject: ' + EdgeObject;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 12003',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}