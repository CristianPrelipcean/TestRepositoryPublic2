find_EdgeJointTypeMapping(TypeElement:string, EdgeTechnology:string, EdgeFrontClass:string, EdgeLeftClass:string, EdgeBackClass:string, EdgeRightClass:string):any{

	// Wildcard parameters
	let WildcardParams: any = {	
		in_TypeElement: TypeElement,
		in_EdgeTechnology: EdgeTechnology
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_EdgeFrontClass: EdgeFrontClass,
		in_EdgeLeftClass: EdgeLeftClass,
		in_EdgeBackClass: EdgeBackClass,
		in_EdgeRightClass: EdgeRightClass
	};
	
	// Range parameters
	let RangeParams: any = {
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_EdgeJointTypeMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = 'Type Element: ' + TypeElement + 'Edge Technology: ' + EdgeTechnology + 'Edge Front Class:  ' + EdgeFrontClass + 'Edge Left Class: ' + EdgeLeftClass + 'Edge Back Class: ' + EdgeBackClass + 'Edge Right Class: ' + EdgeRightClass;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13004',1);
		logError(ErrorMessage.Message(Text));
	}
	return retVal;
}