cfind_LotGroupMapping(TypeElement:string, Program:string):ICT_ctab_LotGroupMapping{
	
	// Wildcard parameters
	let WildcardParams: any = {	
    in_TypeElement: TypeElement,
    in_Program: Program
	};
	
	// Fixed parameters
	let FixedParams: any = {

	};
	
	// Range parameters
	let RangeParams: any = {};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_ctab_LotGroupMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = ' TypeElement: ' + TypeElement + ' / Program: ' + Program;
		logError(Text);
	}
	return retVal;
}