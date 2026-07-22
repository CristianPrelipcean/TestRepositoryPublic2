find_PartSettings(Part:string):ICT_tab_PartSettings{
	let retEntry = ct_tab_PartSettings.find(p=> p.in_Part == Part)!;
	if (retEntry == undefined) {
		let Text = 'Part Name: ' + Part;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14003',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}