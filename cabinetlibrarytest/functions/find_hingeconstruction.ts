find_HingeConstruction(Part: string, CarcaseFrontAngle: number, InsertionSide:string):ICT_tab_HingeConstruction{
  let retEntry = ct_tab_HingeConstruction.find(p => p.in_Part == Part && p.in_CarcaseFrontAngle == CarcaseFrontAngle && p.in_InsertionSide == InsertionSide);
	if (retEntry == undefined) {
    let Text = Part + ' - ' + CarcaseFrontAngle + ' - ' + InsertionSide;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11001',1)
		logError(ErrorMessage.Message(Text));
	}	
	return retEntry!;
}