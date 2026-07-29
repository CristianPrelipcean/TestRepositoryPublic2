find_HingeSettings(TypeElement:string, FrontType: string, AdditionalInfo1: string, AdditionalInfo2: string,FrontConstructionId:string, DoorThickness:number, Angle:number, InteriorCabinet:string):ICT_tab_HingeSettings{
	// Wildcard parameters
	let WildcardParams: any = {			
		in_TypeElement: TypeElement,
		in_AdditionalInfo1: AdditionalInfo1,
		in_AdditionalInfo2: AdditionalInfo2,
		in_FrontConstructionId: FrontConstructionId,
		in_InteriorCabinet: InteriorCabinet
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_Angle: Angle
	};
	
	// Range parameters
	let RangeParams: any = {
		"Range1": {
			MinAttr: "in_DoorThicknessMin",
			MaxAttr: "in_DoorThicknessMax",
			Value: DoorThickness
		}
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_HingeSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = 'TypeElement: ' + TypeElement + ' and AdditionalInfo1: ' + AdditionalInfo1 + ' and AdditionalInfo2: ' + AdditionalInfo2 + ' and FrontConstructionId: ' + FrontConstructionId + ' and DoorThickness: ' + DoorThickness + ' and Angle: ' + Angle + ' and InteriorCabinet: ' + InteriorCabinet;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14014', 1)
		logError(ErrorMessage.Message(Text));
	}
	return retVal;

	
}