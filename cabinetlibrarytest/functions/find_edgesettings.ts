find_EdgeSettings(TypeElement:string, Part:string, EdgeTypeFront:string, EdgeTypeLeft:string, EdgeTypeBack:string, EdgeTypeRight:string):any{

	// Wildcard parameters
	let WildcardParams: any = {	
		in_TypeElement: TypeElement,
		in_Part: Part
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_EdgeTypeFront: EdgeTypeFront,
		in_EdgeTypeLeft: EdgeTypeLeft,
		in_EdgeTypeBack: EdgeTypeBack,
		in_EdgeTypeRight: EdgeTypeRight
	};
	
	// Range parameters
	let RangeParams: any = {};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_EdgeSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = EdgeTypeFront + ' - ' + EdgeTypeLeft + ' - ' + EdgeTypeBack + ' - ' + EdgeTypeRight;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14021',1)
		logError(ErrorMessage.Message(Text));
	}
	return retVal;
}