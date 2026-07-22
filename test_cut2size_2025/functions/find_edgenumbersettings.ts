find_EdgeNumberSettings(TypeElement:string, Edge:string):ICT_tab_EdgeNumberSettings[]{

	// Wildcard parameters
	let WildcardParams: any = {	
		in_TypeElement: TypeElement
	};
	
	// Fixed parameters
	let FixedParams: any = {
	in_Edge: Edge
	};
	
	// Range parameters
	let RangeParams: any = {};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=false;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_EdgeNumberSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = 'Edge: ' + Edge;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14001',1);
		logError(ErrorMessage.Message(Text));
	}
	return retVal;
}