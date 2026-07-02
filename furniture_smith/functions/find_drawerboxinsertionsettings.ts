find_DrawerBoxInsertionSettings(TypeElement:string, FrontProgram:string, HandleDesign:string, HandlePosType:string, FrontStartPos:number, ShelffixedBtm:boolean):ICT_tab_DrawerBoxInsertionSettings{

	// Wildcard parameters
	let WildcardParams: any = {			
		in_TypeElement: TypeElement,
		in_FrontProgram: FrontProgram,
		in_HandleDesign: HandleDesign,
		in_HandlePosType: HandlePosType
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_ShelffixedBtm: ShelffixedBtm
	};
	
	// Range parameters
	let RangeParams: any = {
		"Range1": {
			MinAttr: "in_FrontStartPosMin",
			MaxAttr: "in_FrontStartPosMax",
			Value: FrontStartPos
		}
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_DrawerBoxInsertionSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = TypeElement + ' - ' + FrontProgram + ' - ' + HandleDesign  + ' - ' + HandlePosType + ' - ' + FrontStartPos;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14004',1)
		logError(ErrorMessage.Message(Text));
	}
	return retVal;
}