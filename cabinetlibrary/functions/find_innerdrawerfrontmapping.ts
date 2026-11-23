find_InnerDrawerFrontMapping(DrawerBoxDesign: string, DrawerBoxProgram: string, FrontRule: string): ICT_tab_InnerDrawerFrontMapping{
  // Wildcard parameters
  let WildcardParams: any = {};
	
	// Fixed parameters
  let FixedParams: any = {
    in_DrawerBoxDesign: DrawerBoxDesign,
    in_DrawerBoxProgram: DrawerBoxProgram,
    in_FrontRule: FrontRule,
  };
	
	// Range parameters
	let RangeParams: any = {};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

  let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_InnerDrawerFrontMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
  if (retVal == undefined) {
    let Text = DrawerBoxDesign + ' - ' + DrawerBoxProgram + ' - ' + FrontRule;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13042', 1);
    logError(ErrorMessage.Message(Text));
  }

  return retVal;
}