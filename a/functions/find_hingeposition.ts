find_HingePosition(Program:string, FrontHeight:number, FrontWidth:number):ICT_tab_HingePosition{

	// Wildcard parameters
	let WildcardParams: any = {	
		in_Program: Program
	};
	
	// Fixed parameters
	let FixedParams: any = {
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
		let Text = 'Program Name: ' + Program + 'Front Height: ' +  FrontHeight + 'Front Width: ' + FrontWidth;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 15003',1);
		logError(ErrorMessage.Message(Text));
	}
	return retVal;
}