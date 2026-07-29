find_CarcasePartConnectionMapping(ParentModule:string, TypeElement:string, Area:string,AreaConnectionType:string, FittingConnection:string, HardwareColor:string):ICT_tab_CarcasePartConnectionMapping[]{

	// Wildcard parameters
	let WildcardParams: any = {	
		in_ParentModule: ParentModule,
		in_TypeElement: TypeElement,
		in_Area: Area,
		in_AreaConnectionType: AreaConnectionType,
		in_HardwareColor: HardwareColor
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_FittingConnection: FittingConnection
	};
	
	// Range parameters
	let RangeParams: any = {};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=false;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_CarcasePartConnectionMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = ParentModule + ' - ' + TypeElement + ' - ' + Area + ' - ' + AreaConnectionType + ' - ' + FittingConnection + ' - ' + HardwareColor;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13010',1)
		logError(ErrorMessage.Message(Text));
	}
	return retVal;

}