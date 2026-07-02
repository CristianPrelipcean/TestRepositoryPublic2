find_ShelfadjQtyPosSettings(TypeElement:string, FrontModule:string, FrontModuleType:string, CarcaseSpaceHeight: number):any{

	// Wildcard parameters
	let WildcardParams: any = {	
		in_FrontModule: FrontModule,
		in_FrontModuleType: FrontModuleType,
		in_TypeElement: TypeElement
	};
	
	// Fixed parameters
	let FixedParams: any = {};
	
	// Range parameters
	let RangeParams: any = {
		"Range1": {
			MinAttr: "in_CarcaseSpaceHeightMin",
			MaxAttr: "in_CarcaseSpaceHeightMax",
			Value: CarcaseSpaceHeight
		}
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_ShelfadjQtyPosSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		logError('Error 14012: Could not find entry in tab_ShelfadjQtyPosSettings for input values: ' + CarcaseSpaceHeight);
	}
	return retVal;
}