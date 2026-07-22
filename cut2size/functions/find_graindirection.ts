find_GrainDirection(PartId:string, PartGrain:string):ICT_tab_GrainSettings{
	let retEntry = ct_tab_GrainSettings.find(p=> p.in_PartId == PartId && p.in_PartGrain == PartGrain);
	if (retEntry == undefined) {
		let Text = 'PartId: ' + PartId + ' and Part Grain: ' + PartGrain;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 15002',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}