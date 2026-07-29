find_StorageunitConstruction(Part:string, LeftTop:string, LeftBtm:string, RightBtm:string, RightTop:string, PartBack:string, PartFront:string, PartVisible:boolean, AdditionalInfo01:string = 'All'):ICT_tab_CarcaseStorageunitConstruction{
	let retEntry = ct_tab_CarcaseStorageunitConstruction.find(p=> p.in_Part == Part && p.in_LeftTop == LeftTop && p.in_LeftBtm == LeftBtm && p.in_RightBtm == RightBtm && p.in_RightTop == RightTop && p.in_PartBack == PartBack && p.in_PartFront == PartFront && p.in_Visible == PartVisible && p.in_AdditionalInfo01 == AdditionalInfo01);
	if (retEntry == undefined) {
		let Text = Part + ' - ' + LeftTop + ' - ' + LeftBtm + ' - ' + RightBtm + ' - ' + RightTop + ' - ' + PartBack + ' - ' + PartFront + ' - ' + PartVisible + ' - ' + AdditionalInfo01;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11004',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}