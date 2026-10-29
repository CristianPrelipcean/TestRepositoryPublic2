find_DrawerBoxColorMapping(HardwareColor:string):ICT_tab_DrawerBoxColorMapping {
	let retEntry = ct_tab_DrawerBoxColorMapping.find(p=> p.in_HardwareColor == HardwareColor)!;
	if (retEntry == undefined) {
		let Text = HardwareColor;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13009',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}