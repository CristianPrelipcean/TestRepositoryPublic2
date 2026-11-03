find_EdgeJointTypeConstruction(EdgeJointType:string):ICT_tab_EdgeJointTypeConstruction{
	let retEntry = ct_tab_EdgeJointTypeConstruction.find(p=> p.in_EdgeJointType == EdgeJointType );
	if (retEntry == undefined) {
		let Text = 'Edge Joint Type: ' + EdgeJointType;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11001',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}