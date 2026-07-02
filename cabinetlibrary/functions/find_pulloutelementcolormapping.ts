find_PulloutElementColorMapping(HardwareColor:string, PulloutType:string, PulloutDesign:string):ICT_tab_PulloutElementColorMapping {

let retEntry = ct_tab_PulloutElementColorMapping.find(p=> p.in_HardwareColor == HardwareColor && p.in_PullOutType == PulloutType && p.in_PullOutDesign == PulloutDesign)!;
	if (retEntry == undefined) {
		let Text = HardwareColor;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13031',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
  
}