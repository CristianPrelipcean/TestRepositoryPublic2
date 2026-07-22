find_PartOverdimensionSettings(EdgeThk:number):ICT_tab_PartOverdimensionSettings{
	let retEntry = ct_tab_PartOverdimensionSettings.find(p=> p.in_EdgeThk == EdgeThk)!;
	if (retEntry == undefined) {
		let Text = 'Edge Thickness: ' + EdgeThk;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 15004',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}