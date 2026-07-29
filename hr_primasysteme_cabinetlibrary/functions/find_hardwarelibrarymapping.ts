find_HardwareLibraryMapping(HardwareItem:string):ICT_tab_HardwareLibraryMapping[]{
	let retEntry = ct_tab_HardwareLibraryMapping.filter(p=> p.in_HardwareItem == HardwareItem)!;
	if (retEntry == undefined) {
		let Text = 'Hardware Item: ' + HardwareItem;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13013',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
	}