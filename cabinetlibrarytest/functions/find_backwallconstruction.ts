find_BackwallConstruction(BackWConstruction:string, PartLeft:string, PartBtm:string, PartRight:string, PartTop:string, Visible:boolean):ICT_tab_CarcaseBackwallConstruction{
	let retEntry = ct_tab_CarcaseBackwallConstruction.find(p=> p.in_BackwallConstruction == BackWConstruction && p.in_PartLeft == PartLeft && p.in_PartBtm == PartBtm && p.in_PartRight == PartRight && p.in_PartTop == PartTop && p.in_Visible == Visible);
	if (retEntry == undefined) {
		let Text = BackWConstruction + ' - ' + PartLeft + ' - ' + PartBtm + ' - ' + PartRight + ' - ' + PartTop + ' - ' + Visible;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11001',1)
		logError(ErrorMessage.Message(Text));
	}	
	return retEntry!;
}