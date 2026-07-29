find_EdgeJointSettings(PartGroup:string, EdgeJointType:string):ICT_tab_EdgeJointSettings{
let retEntry = ct_tab_EdgeJointSettings.find(x=> x.in_PartGroup == PartGroup && x.in_EdgeJointType== EdgeJointType);
	if (retEntry == undefined) {
		let Text = 'PartGroup: ' + PartGroup + ' and EdgeJointType: ' + EdgeJointType;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14016',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}