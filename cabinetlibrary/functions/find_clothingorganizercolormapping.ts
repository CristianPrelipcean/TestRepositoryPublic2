find_ClothingOrganizerColorMapping(Color: string, Type: string, Design: string): ICT_tab_ClothingOrganizerColorMapping {

  // Wildcard parameters
	let WildcardParams: any = {	
		in_HardwareColor: Color,
		in_Type: Type,
		in_Design: Design
	};
	
	// Fixed parameters
	let FixedParams: any = {};
	
	// Range parameters
	let RangeParams: any = {};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and retrieve the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_ClothingOrganizerColorMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
    let Text = Type + ' - ' + Design + ' - ' + Color;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13037', 1)
    logError(ErrorMessage.Message(Text));
	}

	// Return the value
  return retVal;
  
}