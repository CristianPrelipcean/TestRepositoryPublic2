find_ClothingOrganizerMapping(Type: string, Design: string, Color: string, Position: string): ICT_tab_ClothingOrganizerMapping {

	// Wildcard parameters
	let WildcardParams: any = {	
		in_Type: Type,
		in_Design: Design,
		in_Color: Color,
		in_ConnectionPosition: Position,
	};
	
	// Fixed parameters
	let FixedParams: any = {};
	
	// Range parameters
	let RangeParams: any = {};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and retrieve the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_ClothingOrganizerMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
    let Text = Type + ' - ' + Design + ' - ' + Color + ' - ' + Position;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13039', 1)
    logError(ErrorMessage.Message(Text));
	}

	// Return the value
  return retVal;
}