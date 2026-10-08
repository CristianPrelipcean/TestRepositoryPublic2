find_PartConnectionSettings(ConnectionHardwarePositioning:string, TouchLength:number, TouchWidth:number):ICT_tab_PartConnectionSettings{
	let retEntry = ct_tab_PartConnectionSettings.find(p=> p.in_ConnectionHardwarePositioning == ConnectionHardwarePositioning && p.in_TouchLengthMin <= TouchLength && p.in_TouchLengthMax >= TouchLength && p.in_TouchWidthMin <= TouchWidth && p.in_TouchWidthMax >= TouchWidth);
	if (retEntry == undefined) {
		let Text = ConnectionHardwarePositioning + ' - ' + TouchLength + ' - ' + TouchWidth;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14024',1)
		logError(ErrorMessage.Message(Text))!;
	}
	return retEntry!;
	}