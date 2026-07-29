find_CarcaseSlopedCeilingDimension(Construction:string, DimensionLogic:string):ICT_tab_CarcaseSlopedCeilingDimension{
  let retEntry = ct_tab_CarcaseSlopedCeilingDimension.find(p => p.in_Construction == Construction && p.in_DimensionLogic == DimensionLogic);	
	if (retEntry== undefined) {
    let Text = 'Construction:' + Construction + 'DimensionLogic:' + DimensionLogic;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14032',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}