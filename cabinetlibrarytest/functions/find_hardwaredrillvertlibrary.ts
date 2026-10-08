find_HardwareDrillVertLibrary(ProcessingId:string, Part:string):ICT_tab_HardwareDrillVertLibrary[]{
	let retEntry = ct_tab_HardwareDrillVertLibrary.filter(p=> p.in_ProcessingId == ProcessingId && p.in_Part == Part)!;
	return retEntry!;
	}