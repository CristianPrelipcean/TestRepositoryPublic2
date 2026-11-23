find_HoodAssemblyMapping(ConstructionId: String, CabinetWith: Number, CabinetHeight: Number, CabinetDepth: Number, IntegrationType: String, ConstructionType: String): ICT_tab_HoodAssemblyMapping{
 
	// Wildcard parameters
	let WildcardParams: any = {	
		in_ConstructionId: ConstructionId,
		in_IntegrationType: IntegrationType,
		in_ConstructionType: ConstructionType
	};
	// Fixed parameters
	let FixedParams: any = {
	};
	// Range parameters
	let RangeParams: any = {
		"Range1": {
			MinAttr: "in_CabinetMinWidth",
			MaxAttr: "in_CabinetMaxWidth",
			Value: CabinetWith
		}/*,
		"Range2": {
			MinAttr: "in_MinHeight",
			MaxAttr: "in_MaxHeight",
			Value: Height
		}*/
	};
	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

  // Call the function and retrieve the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_HoodAssemblyMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
    let Text = "no entry found for " + ConstructionId + " - " + IntegrationType + " - " + ConstructionType + " - " + CabinetWith + " * " + CabinetHeight + " * " + CabinetDepth;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13024',1);
		logError(ErrorMessage.Message(Text));
	}
	// Return the value
	return retVal;
}