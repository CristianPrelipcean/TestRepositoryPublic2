find_PartsGraphicRotation (ReferencePointXYZ:string, RotationAxis:string, Rotation:number):ICT_tab_PartsGraphicRotation{
	let retEntry= ct_tab_PartsGraphicRotation.find(p=> p.in_ReferencePointXYZ == ReferencePointXYZ && p.in_RotationAxis == RotationAxis && p.in_Rotation == Rotation);	
	if (retEntry== undefined) {
    let Text = 'ReferencePointXYZ:' + ReferencePointXYZ + ', RotationAxis:' + RotationAxis + ', Rotation:' + Rotation;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 15004',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}