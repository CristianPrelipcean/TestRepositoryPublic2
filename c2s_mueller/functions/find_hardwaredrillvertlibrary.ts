find_HardwareDrillVertLibrary(ProcessingId:string, TypeElement:string):ICT_tab_HardwareDrillVertLibrary[]{
	let retEntry = ct_tab_HardwareDrillVertLibrary.filter(p=> p.in_ProcessingId == ProcessingId && p.in_TypeElement == TypeElement)!;
	if (retEntry == undefined) {
		let Text = 'Processing ID: ' + ProcessingId + 'Type Element: ' + TypeElement;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 12003',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
	}