find_BoardLibrary(MaterialCode:string):ICT_tab_BoardLibrary{
  let retEntry = ct_tab_BoardLibrary.find(p=> p.in_MaterialCode == MaterialCode);
	if (retEntry== undefined) {
		let Text = 'Material code:' + MaterialCode;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 12001',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}