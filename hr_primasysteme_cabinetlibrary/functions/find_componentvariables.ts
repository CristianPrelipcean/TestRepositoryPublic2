find_ComponentVariables(ComponentId:string):ICT_tab_ComponentVariables[]{
  let retEntry = ct_tab_ComponentVariables.filter(p => p.in_ComponentId == ComponentId)!;
	if (retEntry == undefined) {
    let Text = ComponentId;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 12008',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
	}