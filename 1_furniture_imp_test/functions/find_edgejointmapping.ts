find_EdgeJointMapping(EdgeJointType:string):ICT_tab_EdgeJointMapping{
	let retEntry = ct_tab_EdgeJointMapping.find(p=> p.in_EdgeJointType == EdgeJointType)!;
	if (retEntry == undefined) {
		let Text = 'EdgeJointType: ' + EdgeJointType;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13018',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}