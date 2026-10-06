find_EdgeJointTypeMapping(TypeElement: string, EdgeFront: boolean, EdgeLeft: boolean, EdgeBack: boolean, EdgeRight: boolean, DimensionType: string):ICT_tab_EdgeJointTypeMapping{

	// Wildcard parameters
	let WildcardParams: any = {	
		in_TypeElement: TypeElement,
		in_IsLengthGreaterEqualWidth: DimensionType
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_EdgeFront: EdgeFront,
		in_EdgeLeft: EdgeLeft,
		in_EdgeBack: EdgeBack,
		in_EdgeRight: EdgeRight
	};
	
	// Range parameters
	let RangeParams: any = {
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_EdgeJointTypeMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = 'Type Element: ' + TypeElement +  'Edge Front:  ' + EdgeFront + 'Edge Left: ' + EdgeLeft + 'Edge Back: ' + EdgeBack + 'Edge Right: ' + EdgeRight + 'IsLengthGreaterEqualWidth: ' + DimensionType;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13004',1);
		logError(ErrorMessage.Message(Text));
	}
	return retVal;
}