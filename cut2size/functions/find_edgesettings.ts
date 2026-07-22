find_EdgeSettings(EdgeType:string):ICT_tab_EdgeSettings{
	let retEntry = ct_tab_EdgeSettings.find(p=> p.in_EdgeType == EdgeType)!;
	if (retEntry == undefined) {
		let Text = 'Edge Type: ' + EdgeType;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14002',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}