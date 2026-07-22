find_BoardObjectMapping(Program:string, TypeElement:string, PartDesign:string, Thk:number, Color:string, BtmColor:string):any{

	// Wildcard parameters
	let WildcardParams: any = {	
		in_Program: Program,
		in_TypeElement: TypeElement,
		in_PartDesign: PartDesign
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_Color: Color,
		in_BtmColor: BtmColor
	};
	
	// Range parameters
	let RangeParams: any = {
		"Range1": {
			MinAttr: "in_ThkMin",
			MaxAttr: "in_ThkMax",
			Value: Thk
		}
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_BoardObjectMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = 'Program Name: ' + Program + 'Type Element: ' + TypeElement + 'Part Design:  ' + PartDesign + 'Color: ' + Color + 'Bottom Color: ' + BtmColor + 'Thickness: ' + Thk;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13001',1);
		logError(ErrorMessage.Message(Text));
	}
	return retVal;
}