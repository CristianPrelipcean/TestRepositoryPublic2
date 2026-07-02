find_HardwareDrillHorLibrary(ProcessingId:string, Part:string):ICT_tab_HardwareDrillHorLibrary[]{
	let retEntry = ct_tab_HardwareDrillHorLibrary.filter(p=> p.in_ProcessingId == ProcessingId && p.in_Part == Part)!;
	return retEntry!;
	}