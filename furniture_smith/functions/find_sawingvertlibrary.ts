find_SawingVertLibrary (ProcessingId:string, Part2Position:string):ICT_tab_SawingVertLibrary[]{
	let retEntry = ct_tab_SawingVertLibrary.filter(p=> p.in_ProcessingId == ProcessingId && p.in_Part2Position == Part2Position)!;
	return retEntry!;
}