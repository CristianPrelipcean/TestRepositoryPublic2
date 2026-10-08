find_HingeMapping(HingeType:string, Application:string, MountingPlateType:string, MountingPlateHeight:string, OpeningType:string, Color:string):ICT_tab_HingeMapping{
	
	// Wildcard parameters
	let WildcardParams: any = {	
		in_OpeningType: OpeningType,
		in_Color: Color
	};
	
	// Fixed parameters
	let FixedParams: any = {
		in_HingeType: HingeType,
		in_Application: Application,
		in_MountingPlateType: MountingPlateType,
		in_MountingPlateHeight: MountingPlateHeight
	};
	
	// Range parameters
	let RangeParams: any = {};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_HingeMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = ' HingeType: ' + HingeType + ' / Application: ' + Application + ' / MountingPlateType: ' + MountingPlateType + ' / MountingPlateHeight: ' + MountingPlateHeight + ' / OpeningType: ' + OpeningType + ' / Color: ' + Color;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13014', 1)
		logError(ErrorMessage.Message(Text));
	}
	return retVal;
}