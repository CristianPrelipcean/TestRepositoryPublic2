find_DrawerBoxWeightTypeSettings(TypeElement:string, FrontWidth:number, FrontHeight:number, BoxDepth:string, BoxHeight:string, FrontpanelWeight: number):ICT_tab_DrawerBoxWeightTypeSettings{

	// Wildcard parameters
	let WildcardParams: any = {		
		in_TypeElement: TypeElement,
		in_DrawerBoxDepthType: BoxDepth,
		in_DrawerBoxHeightType: BoxHeight
	};
	
	// Fixed parameters
	let FixedParams: any = {
	};
	
	// Range parameters
	let RangeParams: any = {
		"Range1": {
			MinAttr: "in_FrontWidthMin",
			MaxAttr: "in_FrontWidthMax",
			Value: FrontWidth
		},
		"Range2": {
			MinAttr: "in_FrontHeightMin",
			MaxAttr: "in_FrontHeightMax",
			Value: FrontHeight
		},
		"Range3": {
			MinAttr: "in_FrontpanelWeightMin",
			MaxAttr: "in_FrontpanelWeightMax",
			Value: FrontpanelWeight
		}
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_DrawerBoxWeightTypeSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text: string = `${TypeElement} - ${FrontWidth} - ${FrontHeight} - ${BoxDepth} - ${BoxHeight} - ${FrontpanelWeight}`;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14005',1)
		logError(ErrorMessage.Message(Text));
	}
	return retVal;
	
}