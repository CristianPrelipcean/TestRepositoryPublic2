find_CornerunitStraightConstruction(Construction:string,Direction:string,Part:string,FingergripTop:boolean):ICT_tab_CornerunitStraightConstruction{
	let retEntry = ct_tab_CornerunitStraightConstruction.find(p=> p.in_ConstructionType == Construction && p.in_Direction==Direction && p.in_Part == Part && p.in_FingergripTop == FingergripTop);
	if (retEntry == undefined) {
		let Text = Construction + ' and Direction: ' + Direction + ' and Part: ' + Part + ' and FingergripTop: ' + FingergripTop;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11003',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}