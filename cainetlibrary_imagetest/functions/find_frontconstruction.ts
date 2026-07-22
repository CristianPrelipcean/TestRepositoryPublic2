find_FrontConstruction(FrontProgram:string, HStrip:string, HPos:string, Width:number, Height:number, PartGroup:string, FrontDesign:string, FrontColor: string = "All"):ICT_tab_FrontConstruction{

	// Wildcard parameters
	let WildcardParams: any = {	
		in_FrontProgram: FrontProgram,
		in_FrontDesign: FrontDesign,
		in_FrontColor: FrontColor,
		in_HandleStrip: HStrip,
		in_HandlePosType: HPos
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_PartGroup: PartGroup
	};
	
	// Range parameters
	let RangeParams: any = {
		"Range1": {
			MinAttr: "in_MinWidth",
			MaxAttr: "in_MaxWidth",
			Value: Width
		},
		"Range2": {
			MinAttr: "in_MinHeight",
			MaxAttr: "in_MaxHeight",
			Value: Height
		}
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and retrieve the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_FrontConstruction, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = PartGroup + ' - ' + FrontProgram + ' - ' + FrontDesign + ' - ' + Width + ' - ' + Height + ' - ' + HStrip + ' - ' + HPos;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11006',1);
		logError(ErrorMessage.Message(Text));
	}

	// Return the value
	return retVal;
		
}