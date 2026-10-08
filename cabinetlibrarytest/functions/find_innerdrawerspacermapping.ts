find_InnerDrawerSpacerMapping(Hinge: string, HingeSide: string, FrontOverlay: string, SpacerRule: string): ICT_tab_InnerDrawerSpacerMapping{
  // Wildcard parameters
  let WildcardParams: any = {
    in_Hinge: Hinge,
  };
    
	
	// Fixed parameters
  let FixedParams: any = {
    in_HingeSide: HingeSide,
    in_FrontOverlay: FrontOverlay,
    in_SpacerRule: SpacerRule,
  };
	
	// Range parameters
	let RangeParams: any = {};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

  let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_InnerDrawerSpacerMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
  if (retVal == undefined) {
    let Text = Hinge + ' - ' + HingeSide + ' - ' + FrontOverlay + ' - ' + SpacerRule;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13043', 1);
    logError(ErrorMessage.Message(Text));
  }

  return retVal;
}