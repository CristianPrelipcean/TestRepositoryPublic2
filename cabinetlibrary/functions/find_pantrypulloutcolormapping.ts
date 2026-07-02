find_PantryPulloutColorMapping(Type:string, Design:string, Color: string):ICT_tab_PantryPulloutColorMapping{
	
	// Call the function and return the value
  let retEntry = ct_tab_PantryPulloutColorMapping.find(p =>
    p.in_PantryPulloutType == Type &&
    p.in_PantryPulloutDesign == Design &&
    p.in_HardwareColor == Color
  );

  // ErrorMessage
	if (retEntry == undefined) {
		let Text =  Type + ' - ' + Design + ' - ' + Color;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13034',1)
		logError(ErrorMessage.Message(Text));
	}

	// Return Value
	return retEntry!;
} 