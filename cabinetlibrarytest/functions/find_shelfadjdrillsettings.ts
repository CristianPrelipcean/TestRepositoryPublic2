find_ShelfadjDrillSettings(TypeElement:string,FrontModule:string, FrontModuleType:string, VertDividerType:string, ShelfadjType:string, ShelfadjThk:number, CCSpaceWidth:number, CCSpaceDepth:number):ICT_tab_ShelfadjDrillSettings{

	// Wildcard parameters
	let WildcardParams: any = {			
		in_TypeElement: TypeElement,
		in_FrontModule: FrontModule,
		in_FrontModuleType: FrontModuleType,
		in_VertDividerType: VertDividerType,
		in_ShelfadjType: ShelfadjType
	};
	
	// Fixed parameters
	let FixedParams: any = {};
	
	// Range parameters
	let RangeParams: any = {
		"Range1": {
			MinAttr: "in_ShelfadjThkMin",
			MaxAttr: "in_ShelfadjThkMax",
			Value: ShelfadjThk
		},
		"Range2": {
			MinAttr: "in_CCSpaceWidthMin",
			MaxAttr: "in_CCSpaceWidthMax",
			Value: CCSpaceWidth
		},
		"Range3": {
			MinAttr: "in_CCSpaceDepthMin",
			MaxAttr: "in_CCSpaceDepthMax",
			Value: CCSpaceDepth
		}
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_ShelfadjDrillSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		logError('Error 14015: Could not find entry in tab_ShelfadjDrillSettings for input values: ' + CCSpaceWidth + ' - ' + CCSpaceDepth + ' - ' + ShelfadjThk);
	}
	return retVal;
}