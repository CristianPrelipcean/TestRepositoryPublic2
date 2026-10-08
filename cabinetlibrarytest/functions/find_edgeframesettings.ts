find_EdgeFrameSettings(PartGroup:string,FrontProgram:string, FrontColor:string, AdditionalInfo1:string):ICT_tab_EdgeFrameSettings{

	// Wildcard parameters
	let WildcardParams: any = {			
		in_PartGroup: PartGroup,
		in_FrontProgram: FrontProgram,
		in_FrontColor: FrontColor,
		in_AdditionalInfo1: AdditionalInfo1
	};
	
	// Fixed parameters
	let FixedParams: any = {};
	
	// Range parameters
	let RangeParams: any = {};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_EdgeFrameSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
    logError('Error 14025: Could not find entry in tab_EdgeFrameSettings for input values: ' + PartGroup + ' - ' + FrontProgram + ' - ' + FrontColor + ' - ' + AdditionalInfo1);
	}
	return retVal;
}