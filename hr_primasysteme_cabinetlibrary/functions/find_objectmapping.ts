find_ObjectMapping(Object:string):ICT_tab_ObjectMapping{
	let retEntry = ct_tab_ObjectMapping.find(p=> p.in_Object == Object)!;
	if (retEntry == undefined) {
		logError('Error 13010: Could not find entry in tab_ObjectMapping for input values: ' + Object);
	}
	return retEntry!;
	}