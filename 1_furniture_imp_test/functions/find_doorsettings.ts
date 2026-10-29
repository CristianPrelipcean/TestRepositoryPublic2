find_DoorSettings(CabinetType:string, TypeElement:string, CarcaseDirection: string, FrontDesign:string, FrontColor:string, Width:number, DoorType:string, DoorDirection:string, VertDivider:string):ICT_tab_DoorSettings{

	// Wildcard parameters
	let WildcardParams: any = {	
		in_CabinetType: CabinetType,
		in_TypeElement: TypeElement,
		in_CarcaseDirection: CarcaseDirection,
		in_FrontDesign: FrontDesign,
		in_FrontColor: FrontColor
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_DoorType: DoorType,
		in_DoorDirection: DoorDirection,
		in_VertDivider: VertDivider
	};
	
	// Range parameters
	let RangeParams: any = {
		"Range1": {
		MinAttr: "in_WidthMin",
		MaxAttr: "in_WidthMax",
		Value: Width
		}
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_DoorSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = TypeElement + ' - ' + CarcaseDirection + ' - ' + FrontDesign + ' - ' + FrontColor + ' - ' + CabinetType + ' - ' + Width + ' - ' + DoorType + ' - ' + DoorDirection + ' - ' + VertDivider;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14019',1);
		logError(ErrorMessage.Message(Text));
	}
	// Return Value
	return retVal;
}