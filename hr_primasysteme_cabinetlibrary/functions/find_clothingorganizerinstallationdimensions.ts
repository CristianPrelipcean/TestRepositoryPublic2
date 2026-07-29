find_ClothingOrganizerInstallationDimensions (Design: string): ICT_tab_ClothingOrganizerInstallationDimensions {

	// Wildcard parameters
	let WildcardParams: any = {	
		in_ClothingOrganizerDesign: Design,
	};
	
	// Fixed parameters
	let FixedParams: any = {};
	
	// Range parameters
	let RangeParams: any = {};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and retrieve the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_ClothingOrganizerInstallationDimensions, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
    let Text = Design;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13041', 1)
    logError(ErrorMessage.Message(Text));
	}

	// Return the value
  return retVal;
}