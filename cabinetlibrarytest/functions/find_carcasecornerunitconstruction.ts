find_CarcaseCornerunitConstruction(Part: string, LeftTop: string, LeftBtm: string, RightBtm: string, RightTop: string, PartBackLeft: string, PartFrontLeft: string, PartBackRight: string, PartFrontRight: string, PartVisible:boolean, AdditionalInfo01:string = 'All'):ICT_tab_CarcaseCornerunitConstruction{
  let retEntry = ct_tab_CarcaseCornerunitConstruction.find(p => p.in_Part == Part && p.in_LeftTop == LeftTop && p.in_LeftBtm == LeftBtm && p.in_RightBtm == RightBtm && p.in_RightTop == RightTop && p.in_PartBackLeft == PartBackLeft && p.in_PartFrontLeft == PartFrontLeft && p.in_PartBackRight == PartBackRight && p.in_PartFrontRight == PartFrontRight && p.in_Visible == PartVisible && p.in_AdditionalInfo01 == AdditionalInfo01);
	if (retEntry == undefined) {
    let Text = Part + ' - ' + LeftTop + ' - ' + LeftBtm + ' - ' + RightBtm + ' - ' + RightTop + ' - ' + PartBackLeft + ' - ' + PartFrontLeft + ' - ' + PartBackRight + ' - ' + PartFrontRight + ' - ' + PartVisible + ' - ' + AdditionalInfo01;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11016',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}