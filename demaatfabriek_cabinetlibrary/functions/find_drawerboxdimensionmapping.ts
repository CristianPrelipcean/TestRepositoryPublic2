find_DrawerBoxDimensionMapping(BoxDesign:string, BoxProgram:string, BoxColor:string, SpaceDepth:number, SpaceHeight:number):ICT_tab_DrawerBoxDimensionMapping{

	// Wildcard parameters
	let WildcardParams: any = {			
		in_BoxProgram: BoxProgram,
		in_BoxColor: BoxColor
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_BoxDesign: BoxDesign
	};
	
	// Range parameters
	let RangeParams: any = {
		"Range1": {
			MinAttr: "in_SpaceDepthMin",
			MaxAttr: "in_SpaceDepthMax",
			Value: SpaceDepth
		},
		"Range2": {
			MinAttr: "in_SpaceHeightMin",
			MaxAttr: "in_SpaceHeightMax",
			Value: SpaceHeight
		}
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_DrawerBoxDimensionMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = BoxDesign + ' - ' + SpaceDepth + ' - ' + SpaceHeight;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13008',1)
		logError(ErrorMessage.Message(Text));
	}
	return retVal;
}