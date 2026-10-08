find_PantryPulloutMapping(Type:string, Design:string, Color: string, Width: number, Depth: number, Height: number):ICT_tab_PantryPulloutMapping{
	
	// Call the function and return the value
  let retEntry = ct_tab_PantryPulloutMapping.find(p =>
    p.in_PantryPulloutType == Type &&
    p.in_PantryPulloutDesign == Design &&
    p.in_PantryPulloutColor == Color &&
    p.in_CarcaseFreeSpaceWidthMin <= Width && 
    p.in_CarcaseFreeSpaceWidthMax >= Width && 
    p.in_CarcaseFreeSpaceDepthMin <= Depth && 
    p.in_CarcaseFreeSpaceDepthMax >= Depth && 
    p.in_CarcaseFreeSpaceHeightMin <= Height && 
    p.in_CarcaseFreeSpaceHeightMax >= Height
  );

  // ErrorMessage
	if (retEntry == undefined) {
		let Text =  Type + ' - ' + Design + ' - ' + Color + ' - ' + Width+ ' - ' + Depth + ' - ' + Height;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13033',1)
		logError(ErrorMessage.Message(Text));
	}

	// Return Value
	return retEntry!;
}