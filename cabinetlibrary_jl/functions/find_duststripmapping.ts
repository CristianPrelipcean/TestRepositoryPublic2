find_DuststripMapping(FrontProgram:string, FrontColor:string, FrontDesign:string):ICT_tab_DuststripMapping{

	// Wildcard parameters
	let WildcardParams: any = {	
		in_FrontProgram: FrontProgram,
		in_FrontColor: FrontColor,
		in_FrontDesign: FrontDesign
	};
	
	// Fixed parameters
	let FixedParams: any = {};
	
	// Range parameters
	let RangeParams: any = {};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_DuststripMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = 'FrontProgram: ' + FrontProgram + 'FrontColor: ' + FrontColor + 'FrontDesign: ' + FrontDesign;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13017',1);
		logError(ErrorMessage.Message(Text));
	}
	// Return Value
	return retVal;
}