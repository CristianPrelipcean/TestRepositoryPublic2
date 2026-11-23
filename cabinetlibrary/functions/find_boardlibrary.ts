find_BoardLibrary(BoardId:string):ICT_tab_BoardLibrary{
	let retEntry= ct_tab_BoardLibrary.find(p=> p.in_MaterialCode == BoardId);	
	if (retEntry== undefined) {
		let Text = 'Materialcode:' + BoardId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 12001',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}