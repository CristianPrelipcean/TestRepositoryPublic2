find_FramePartConnectionMapping(PartGroup:string, TypeElement:string, FrontProgram:string, Thk: number):any{

	// Wildcard parameters
	let WildcardParams: any = {	
		in_PartGroup: PartGroup,
		in_TypeElement: TypeElement,
		in_FrontProgram: FrontProgram
	};
	
	// Fixed parameters
	let FixedParams: any = {};
	
	// Range parameters
	let RangeParams: any = {
		"Range1": {
			MinAttr: "in_ThkMin",
			MaxAttr: "in_ThkMax",
			Value: Thk
		}
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_FramePartConnectionMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		logError('Error 13022: Could not find entry in tab_FramePartConnectionMapping for input value: ' + Thk);
	}
	return retVal;
}