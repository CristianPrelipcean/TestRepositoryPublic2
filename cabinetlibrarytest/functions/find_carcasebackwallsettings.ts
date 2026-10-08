find_CarcaseBackwallSettings(BackwConstruction:string):ICT_tab_CarcaseBackwallSettings{
	let retEntry = ct_tab_CarcaseBackwallSettings.find(p=> p.in_BackwallConstruction == BackwConstruction);
	if (retEntry == undefined) {
		let Text = 'BackwallConstruction: ' + BackwConstruction;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14009',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}