find_HandleConstruction(FrontType: string, PosHor: string, PosVert: string, PosTyp: string, HandlePosHor: string, HandlePosVert: string): ICT_tab_HandleConstruction{
	
	// Wildcard parameters
	let WildcardParams: any = {	
		in_FrontType: FrontType
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_PosHorizontal: PosHor,
		in_PosVertical: PosVert,
		in_PosType: PosTyp,
		in_HandlePosHorizontal: HandlePosHor,
		in_HandlePosVertical: HandlePosVert
	};
	
	// Range parameters
	let RangeParams: any = {};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_HandleConstruction, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = FrontType + '-' + PosHor + '-' + PosVert + '-' + PosTyp + '-' + HandlePosHor + '-' + HandlePosVert;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11002',1)
		logError(ErrorMessage.Message(Text));
	}
	return retVal;

}