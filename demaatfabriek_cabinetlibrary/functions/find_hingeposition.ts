find_HingePosition(TypeElement: string, FrontConstructionId:string, AdditionalInfo1: string, AdditionalInfo2:string, FrontHeight:number, FrontWidth:number, Weight:number, FingergripTypeTop:string, FingergripTypeBtm:string, HandleDesign: string, HandlePosType:string):ICT_tab_HingePosition{
	
	// Wildcard parameters
	let WildcardParams: any = {			
		in_TypeElement: TypeElement,
		in_AdditionalInfo1: AdditionalInfo1,
		in_AdditionalInfo2: AdditionalInfo2,
		in_FrontConstructionId: FrontConstructionId,
		in_HandleDesign: HandleDesign,
		in_HandlePosType: HandlePosType
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_FingergripTypeTop: FingergripTypeTop,
		in_FingergripTypeBtm: FingergripTypeBtm
	};
	
	// Range parameters
	let RangeParams: any = {
		"Range1": {
			MinAttr: "in_FrontHeightMin",
			MaxAttr: "in_FrontHeightMax",
			Value: FrontHeight
		},
		"Range2": {
			MinAttr: "in_FrontWidthMin",
			MaxAttr: "in_FrontWidthMax",
			Value: FrontWidth
		}
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_HingePosition, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = TypeElement + ' and FrontConstructionId: ' + FrontConstructionId + ' and AdditionalInfo1: ' + AdditionalInfo1 + ' and AdditionalInfo2: ' + AdditionalInfo2 + ' and FrontHeight: ' + FrontHeight + ' and FrontWidth: ' + FrontWidth + ' and Weight: ' + Weight + ' and FingergripTypeTop: ' + FingergripTypeTop + ' and FingergripTypeBtm: ' + FingergripTypeBtm + ' and HandleDesign: ' + HandleDesign + ' and HandlePosType: ' + HandlePosType;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 15002', 1)
		logError(ErrorMessage.Message(Text));
	}
	return retVal;

}