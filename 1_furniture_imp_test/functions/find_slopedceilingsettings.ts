find_SlopedCeilingSettings(Construction:string):ICT_tab_SlopedCeilingSettings{
  let retEntry = ct_tab_SlopedCeilingSettings.find(p => p.in_Construction == Construction);
	if (retEntry == undefined) {
    let Text = 'Construction: ' + Construction;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14028',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}