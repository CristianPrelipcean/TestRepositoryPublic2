find_CarcasePartsShape(Part: string, Fingergrip: string, AdditionalInfo01: string, AdditionalInfo02: string, AdditionalInfo03:string, AdditionalInfo04:string):ICT_tab_CarcasePartsShape[]{

	// Wildcard parameters
	let WildcardParams: any = {	
    in_Fingergrip: Fingergrip,
    in_AdditionalInfo01: AdditionalInfo01,
    in_AdditionalInfo02: AdditionalInfo02,
		in_AdditionalInfo03: AdditionalInfo03,
		in_AdditionalInfo04: AdditionalInfo04
	};
	
	// Fixed parameters
	let FixedParams: any = {
    in_Part: Part
	};
	
	// Range parameters
	let RangeParams: any = {
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=false;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_CarcasePartsShape, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined || retVal.length == 0) {
    let Text = Part + ' - ' + Fingergrip + ' - ' + AdditionalInfo01 + ' - ' + AdditionalInfo02 + ' - ' + AdditionalInfo03 + ' - ' + AdditionalInfo04;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14027',1);
		logError(ErrorMessage.Message(Text));
	}
	// Return Value
	return retVal;
}