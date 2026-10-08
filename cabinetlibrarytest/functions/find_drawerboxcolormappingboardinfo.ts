find_DrawerBoxColorMappingBoardInfo(DrawerBoxColor:string):ICT_tab_DrawerBoxColorMapping {
	let retEntry = ct_tab_DrawerBoxColorMapping.find(p=> p.DrawerBoxColor == DrawerBoxColor)!;
	if (retEntry == undefined) {
		let Text = DrawerBoxColor;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13009',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}