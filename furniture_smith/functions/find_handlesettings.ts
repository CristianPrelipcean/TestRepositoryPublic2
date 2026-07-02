find_HandleSettings(HandlePosType: string, Partgroup: string): ICT_tab_HandleSettings{
	
	let retEntry = ct_tab_HandleSettings.find(p => p.in_PartGroup == Partgroup && p.in_HandlePosType == HandlePosType);
	
	if (retEntry == undefined) {
		let Text = 'HandlePosType: ' + HandlePosType + ', Partgroup: ' + Partgroup;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14001',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}