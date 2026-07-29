find_PartSettings(Part:string, AdditionalInfo1: string = 'All', returnError = true):ICT_tab_PartSettings{

	// Wildcard parameters
	let WildcardParams: any = {	
		in_AdditionalInfo1: AdditionalInfo1		
	};

	// Fixed parameters
	let FixedParams: any = {
		in_Part: Part
	};
	
	// Range parameters
	let RangeParams: any = {};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and retrieve the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_PartSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined && returnError) {
		let Text = 'Part: ' + Part + ', AdditionalInfo1: ' + AdditionalInfo1;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14003',1);
		logError(ErrorMessage.Message(Text));
	}

	// Return the value
	return retVal;

}