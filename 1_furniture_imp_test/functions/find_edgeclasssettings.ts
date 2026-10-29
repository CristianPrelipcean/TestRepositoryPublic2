find_EdgeClassSettings(EdgeType:string):ICT_tab_EdgeClassSettings{
	let retEntry = ct_tab_EdgeClassSettings.find(p=> p.in_EdgeType == EdgeType)!;
	if (retEntry == undefined) {
		let Text = 'EdgeType: ' + EdgeType;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14002',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}