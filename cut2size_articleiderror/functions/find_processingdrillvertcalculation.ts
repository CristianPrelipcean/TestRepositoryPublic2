find_ProcessingDrillingsCalaculation(PartView:string, DrillSide:string, ProcessingBasePoint: string, ProcessingOrientation: string, DrillLogic: string, DrillEntireThk: boolean):ICT_tab_ProcessingDrillVertCalculation{
  let retEntry = ct_tab_ProcessingDrillVertCalculation.find(p=> p.in_PartView == PartView && p.in_DrillSide == DrillSide && p.in_ProcessingBasePoint == ProcessingBasePoint && p.in_ProcessingOrientation == ProcessingOrientation && p.in_DrillLogic == DrillLogic && p.in_DrillEntireThk == DrillEntireThk);	
	if (retEntry== undefined) {
		let Text = 'Part view: ' + PartView + '' + 'Drill side: ' + DrillSide + '' + 'Base point: ' + ProcessingBasePoint + '' + 'Orientation: ' + ProcessingOrientation + '' + 'Logic: ' + DrillLogic + '' + 'Drill entire thickness: ' + DrillEntireThk;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 130011',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}