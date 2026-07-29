find_FrameFillingMapping(PartGroup: string, FrontProgram: string, FrontDesign: string, FrontColor: string): ICT_tab_FrameFillingMapping{

	// Wildcard parameters
	let WildcardParams: any = {	
		in_FrontProgram: FrontProgram,
		in_FrontDesign: FrontDesign,
		in_FrontColor: FrontColor
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_PartGroup: PartGroup
	};
	
	// Range parameters
	let RangeParams: any = {};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and retrieve the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_FrameFillingMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = PartGroup + ' - ' + FrontProgram + ' - ' + FrontDesign + ' - ' + FrontColor;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13029',1);
		logError(ErrorMessage.Message(Text));
	}

	// Return the value
  return retVal;
  
}