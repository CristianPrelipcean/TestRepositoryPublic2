find_EdgeNumberSettings(PartName: string | undefined = undefined, Edge:string | undefined = undefined):ICT_tab_EdgeNumberSettings{

	// Wildcard parameters
	let WildcardParams: any = {			
		in_PartName: PartName
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_Edge: Edge
};
	
	// Range parameters
	let RangeParams: any = {
		
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_EdgeNumberSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		logError('Error 14007: Could not find entry in tab_EdgeNumberSettings for PartName: ' + PartName + ' and Edge: ' + Edge);
	}
	return retVal;
}