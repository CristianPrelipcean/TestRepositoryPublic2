find_HoodNicheConfiguration(CarcaseConstructionId: string, HoodId: string): ICT_tab_HoodNicheConfiguration[]{
/*
  let retEntry = ct_tab_HoodNicheConfiguration.find(p => p.in_CarcaseConstructionId == CarcaseConstructionId)!;

  if (retEntry == undefined) {
    let Text = "no entry found for " + CarcaseConstructionId;
    // to do new ErrorMsg
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13024', 1);
    logError(ErrorMessage.Message(Text));
  } 
*/
	let WildcardParams: any = {	
		in_CarcaseConstructionId: CarcaseConstructionId,
		in_HoodId: HoodId
	};
	
	// Fixed parameters
	let FixedParams: any = {};
	
	// Range parameters
	let RangeParams: any = {
	};

  	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=false;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_HoodNicheConfiguration, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {

	let Text = "No Niche-Construction found for " + CarcaseConstructionId + " HoodId: " + HoodId
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13024',1);
		logError(ErrorMessage.Message(Text));
	}
	return retVal;

}