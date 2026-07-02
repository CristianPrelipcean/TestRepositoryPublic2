find_ProcessingDrillingsCalaculation(Processing:string, PartView:string, DrillSide:string, ProcessingBasePoint: string, ProcessingOrientation: string, DrillLogic: string, DrillEntireThk: boolean):ICT_tab_ProcessingDrillingsCalculation{
  let retEntry = ct_tab_ProcessingDrillingsCalculation.find(p=> p.in_Processing == Processing && p.in_PartView == PartView && p.in_DrillSide == DrillSide && p.in_ProcessingBasePoint == ProcessingBasePoint && p.in_ProcessingOrientation == ProcessingOrientation && p.in_DrillLogic == DrillLogic && p.in_DrillEntireThk == DrillEntireThk);	
	if (retEntry== undefined) {
		let Text = 'Processing: ' + Processing + '' + 'Part view: ' + PartView + '' + 'Drill side: ' + DrillSide + '' + 'Base point: ' + ProcessingBasePoint + '' + 'Orientation: ' + ProcessingOrientation + '' + 'Logic: ' + DrillLogic + '' + 'Drill entire thickness: ' + DrillEntireThk;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13008',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}