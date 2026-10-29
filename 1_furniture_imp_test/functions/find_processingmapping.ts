find_ProcessingMapping(ProcessingItem:string):ICT_tab_ProcessingMapping[]{
	let retEntry = ct_tab_ProcessingMapping.filter(p=> p.in_ProcessingItem == ProcessingItem)!;
	if (retEntry == undefined) {
		let Text = 'Processing Item: ' + ProcessingItem;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13012',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
	}