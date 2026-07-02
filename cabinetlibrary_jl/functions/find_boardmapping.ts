find_BoardMapping(color:string, partthickness:number):ICT_tab_BoardMapping{
	let retEntry = ct_tab_BoardMapping.find(p=> p.in_NeutralColor == color && p.in_BoardThkMin <= partthickness && p.in_BoardThkMax >= partthickness);
		if (retEntry == undefined) {
		let Text = color + ' and PartThickness ' + partthickness;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13001',1)
		logError(ErrorMessage.Message(Text));
	}	
	return retEntry!;
}