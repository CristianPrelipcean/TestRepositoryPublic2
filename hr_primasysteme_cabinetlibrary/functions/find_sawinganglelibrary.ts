find_SawingAngleLibrary (ProcessingId:string):ICT_tab_SawingAngleLibrary[]{
	let retEntry = ct_tab_SawingAngleLibrary.filter(p=> p.in_ProcessingId == ProcessingId)!;
	return retEntry!;
}