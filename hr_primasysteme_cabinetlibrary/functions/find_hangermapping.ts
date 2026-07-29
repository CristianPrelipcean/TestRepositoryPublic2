find_HangerMapping(HangerType:string, CarcaseWidth:number, Color:string):ICT_tab_HangerMapping{

	let	retEntry= ct_tab_HangerMapping.find(y=> y.in_HangerType! == HangerType && y.in_CarcaseWidthMin! <= CarcaseWidth && y.in_CarcaseWidthMax! >= CarcaseWidth && y.in_Color! == Color)!;
if (retEntry == undefined) {
retEntry= ct_tab_HangerMapping.find(y=> y.in_HangerType! == HangerType && y.in_CarcaseWidthMin! <= CarcaseWidth && y.in_CarcaseWidthMax! >= CarcaseWidth && y.in_Color! == 'All')!;	
if (retEntry== undefined) 
	{
		let Text = ' HangerType: ' + HangerType + ' and CarcaseWidth: ' + CarcaseWidth  + ' and Color: ' + Color;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13005',1)
		logError(ErrorMessage.Message(Text));
	}
}
	return retEntry!;
}