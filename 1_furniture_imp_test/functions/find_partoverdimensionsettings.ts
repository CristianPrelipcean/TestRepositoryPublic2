find_PartOverdimensionSettings(EdgeThk:number):ICT_tab_PartOverdimensionSettings{
	let retEntry = ct_tab_PartOverdimensionSettings.find(p=> p.in_EdgeThkMin <= EdgeThk && p.in_EdgeThkMax == EdgeThk)!;
	if (retEntry == undefined) {
		let Text = 'EdgeThk; ' + EdgeThk;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14017',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}