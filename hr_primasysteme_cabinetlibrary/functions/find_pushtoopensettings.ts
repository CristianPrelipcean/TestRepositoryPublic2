find_PushtoopenSettings(TypeElement:string, FrontType: string, FrontConstructionId:string, FrontOpeningDirection:string, PushToOpenLine:string, PushToOpenPosition:string, PushToOpenType:string):ICT_tab_PushtoopenSettings[]{
  // Wildcard parameters
	let WildcardParams: any = {	
		in_TypeElement: TypeElement,
		in_FrontConstructionId: FrontConstructionId,
		in_FrontOpeningDirection: FrontOpeningDirection,
		in_PushToOpenLine: PushToOpenLine
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_FrontType: FrontType,
		in_PushToOpenPosition: PushToOpenPosition,
		in_PushToOpenType: PushToOpenType,
	};
	
	// Range parameters
	let RangeParams: any = {};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=false;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_PushtoopenSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = ' TypeElement: ' + TypeElement + ' / FrontType: ' + FrontType + ' / FrontConstructionId: ' + FrontConstructionId + ' / FrontOpeningDirection: ' + FrontOpeningDirection + ' / PushToOpenLine: ' + PushToOpenLine + ' / PushToOpenPosition: ' + PushToOpenPosition + ' / PushToOpenType: ' + PushToOpenType;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14020', 1)
		logError(ErrorMessage.Message(Text));
	}
	return retVal;

}
