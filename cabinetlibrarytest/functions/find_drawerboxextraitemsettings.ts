find_DrawerBoxExtraItemSettings(FrontProgram: string, OpeningType: string, Width: number, Depth: number):ICT_tab_DrawerBoxExtraItemSettings[]{

	// Wildcard parameters
	let WildcardParams: any = {			
		in_FrontProgram: FrontProgram,
		in_OpeningType: OpeningType
	};
	
	// Fixed parameters
	let FixedParams: any = {};
	
	// Range parameters
	let RangeParams: any = {
		"Range1": {
			MinAttr: "in_WidthMin",
			MaxAttr: "in_WidthMax",
			Value: Width
		},
		"Range2": {
			MinAttr: "in_DepthMin",
			MaxAttr: "in_DepthMax",
			Value: Depth
		}
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=false;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_DrawerBoxExtraItemSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = 'Frontprogram: ' + FrontProgram + ' , OpeningType: ' + OpeningType + ' , Width: ' + Width + ' , Depth: ' + Depth;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14018',1)
		logError(ErrorMessage.Message(Text));
	}
	return retVal;
}