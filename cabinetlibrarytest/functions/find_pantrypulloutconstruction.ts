find_PantryPulloutConstruction(ConstructionId:string):ICT_tab_PantryPulloutConstruction{
	
	// Call the function and return the value
  let retEntry = ct_tab_PantryPulloutConstruction.find(p =>
    p.in_ConstructionId == ConstructionId
  );

  // ErrorMessage
	if (retEntry == undefined) {
		let Text = ConstructionId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13035',1)
		logError(ErrorMessage.Message(Text));
	}

	// Return Value
	return retEntry!;
} 