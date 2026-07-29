find_PlinthAreaSettings(TypeElement: string, PlinthAreaDesign:string,  PositionLeftMatrix:string, PositionRightMatrix:string, PositionBackMatrix:string, PositionFrontMatrix:string, CarcaseWidth:number, CarcaseDepth:number, Weight:number):ICT_tab_PlinthAreaSettings[]{
  
	// Wildcard parameters
	let WildcardParams: any = {	
		in_TypeElement: TypeElement
	};
	
	// Fixed parameters
	let FixedParams: any = {
    in_PlinthAreaDesign: PlinthAreaDesign,
    in_PositionLeftMatrix: PositionLeftMatrix,
    in_PositionRightMatrix: PositionRightMatrix,
    in_PositionBackMatrix: PositionBackMatrix,
    in_PositionFrontMatrix: PositionFrontMatrix
	};
	
	// Range parameters
	let RangeParams: any = {
		"Range1": {
		MinAttr: "in_CarcaseWidthMin",
		MaxAttr: "in_CarcaseWidthMax",
		Value: CarcaseWidth
    },
    "Range2": {
		MinAttr: "in_CarcaseDepthMin",
		MaxAttr: "in_CarcaseDepthMax",
		Value: CarcaseDepth
    },
    "Range3": {
		MinAttr: "in_WeightMin",
		MaxAttr: "in_WeightMax",
		Value: Weight
    }
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=false;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_PlinthAreaSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = TypeElement + ' - ' + PlinthAreaDesign + ' - ' + PositionLeftMatrix + ' - ' + PositionRightMatrix + ' - ' + PositionBackMatrix + ' - ' + PositionFrontMatrix + ' - ' + CarcaseWidth + ' - ' + CarcaseWidth + ' - ' + Weight;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14011',1)
		logError(ErrorMessage.Message(Text));
	}
	return retVal;

}