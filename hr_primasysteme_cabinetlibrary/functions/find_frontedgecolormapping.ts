find_FrontEdgeColorMapping(FrontProgram:string, FrontColor:string):ICT_tab_FrontEdgeColorMapping{

	// Wildcard parameters
	let WildcardParams: any = {	
		in_FrontProgram: FrontProgram
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_FrontColor: FrontColor
	};
	
	// Range parameters
	let RangeParams: any = {};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_FrontEdgeColorMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);

	// Return Value
	return retVal;
}