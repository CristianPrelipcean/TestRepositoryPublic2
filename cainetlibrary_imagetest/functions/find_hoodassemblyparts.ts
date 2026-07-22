find_HoddAssemblyParts(ConstructionId: string): ICT_tab_HoodAssemblyParts {

	// Wildcard parameters
	let WildcardParams: any = {	
		in_HoodConstructionId: ConstructionId
	};
	
	// Fixed parameters
	let FixedParams: any = {};
	
	// Range parameters
	let RangeParams: any = {
	};

  	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=false;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_HoodAssemblyParts, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = "No Parts found for " + ConstructionId
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13024',1);
		logError(ErrorMessage.Message(Text));
	}
	return retVal;
}
