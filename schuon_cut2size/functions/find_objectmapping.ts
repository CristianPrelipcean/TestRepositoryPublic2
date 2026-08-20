find_ObjectMapping(Object:string):ICT_tab_ObjectMapping{
	let retEntry = ct_tab_ObjectMapping.find(p=> p.in_Object == Object)!;
	if (retEntry == undefined) {
		let Text = 'Object Name: ' + Object;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13005',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
	}