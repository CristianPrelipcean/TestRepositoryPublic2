find_HardwareMilingLibrary(ProcessingId:string, Part:string):ICT_tab_HardwareMillingLibrary[]{
	let retEntry = ct_tab_HardwareMillingLibrary.filter(p=> p.in_ProcessingId == ProcessingId && p.in_Part == Part)!;
	return retEntry!;
}