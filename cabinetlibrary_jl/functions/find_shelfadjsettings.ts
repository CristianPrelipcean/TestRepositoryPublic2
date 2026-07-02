find_ShelfadjSettings(CarcaseColor:string, FrontDesign:string, FrontProgram:string, ShelfadjType:string, CarcaseSpaceWidth: number, CarcaseSpaceDepth: number):ICT_tab_ShelfadjSettings{

	// Wildcard parameters
	let WildcardParams: any = {	
		in_CarcaseColor: CarcaseColor,
		in_FrontDesign: FrontDesign,
		in_FrontProgram: FrontProgram
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_ShelfadjType: ShelfadjType
	};
	
	// Range parameters
	let RangeParams: any = {
		"Range1": {
			MinAttr: "in_CarcaseSpaceWidthMin",
			MaxAttr: "in_CarcaseSpaceWidthMax",
			Value: CarcaseSpaceWidth
		},
		"Range2": {
			MinAttr: "in_CarcaseSpaceDepthMin",
			MaxAttr: "in_CarcaseSpaceDepthMax",
			Value: CarcaseSpaceDepth
		}
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_ShelfadjSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		//logError('Error 14013: Could not find entry in tab_ShelfadjSettings for input values: ' + ShelfadjType + '-' + CarcaseSpaceWidth + '-' + CarcaseSpaceDepth);
		let Text = 'CarcaseColor: ' + CarcaseColor + ', FrontDesign: ' + FrontDesign + ', FrontProgram: ' + FrontProgram + ', ShelfadjType: ' + ShelfadjType + ', CarcaseSpaceWidth: ' + CarcaseSpaceWidth + ', CarcaseSpaceDepth: ' + CarcaseSpaceDepth;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14013',1);
		logError(ErrorMessage.Message(Text));
	}
	return retVal!;
	}