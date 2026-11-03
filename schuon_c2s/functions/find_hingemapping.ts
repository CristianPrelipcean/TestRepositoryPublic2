find_HingeMapping(Supplier:string, HingeProgram:string, MountingType:string):ICT_tab_HingeMapping{
	let retEntry = ct_tab_HingeMapping.find(p=> p.in_Supplier == Supplier && p.in_HingeProgram == HingeProgram && p.in_MountingType == MountingType);
		if (retEntry == undefined) {
			let Text = 'Supplier Name: ' + Supplier + 'Hinge Program Name: ' + HingeProgram + 'Mounting Type: ' + MountingType;
			let ErrorMessage = GlobalFunc.find_ErrorList('Error 13003',1)
		logError(ErrorMessage.Message(Text));
	}	
	return retEntry!;
}