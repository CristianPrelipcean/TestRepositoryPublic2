find_EdgeLibrary(EdgeId:string):ICT_tab_EdgeLibrary{
	let retEntry= ct_tab_EdgeLibrary.find(p=> p.in_EdgeId == EdgeId);	
	if (retEntry== undefined) {
		let Text = 'EdgeId: ' + EdgeId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 12002',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}