find_HingeDrillingDistance(HingeType:string, FrontOverlay:number, DrillingDistanceType:String):ICT_tab_HingeDrillingDistance{
	
	let retEntry = ct_tab_HingeDrillingDistance.find(p=> p.in_HingeType == HingeType && p.in_FrontOverlayMin! <= FrontOverlay && p.in_FrontOverlayMax! >= FrontOverlay && p.in_DrillingDistanceType==DrillingDistanceType);
	
	if (retEntry == undefined) {
		let Text =  HingeType + ' and FrontOverlay: ' + FrontOverlay + ' and DrillingDistanceType: ' + DrillingDistanceType;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 15003',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}