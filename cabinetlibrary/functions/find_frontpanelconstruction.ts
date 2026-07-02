find_FrontPanelConstruction(PartGroup: string,ConstructionId: string, GrainGroupId: string): ICT_tab_FrontPanelConstruction {

  // Wildcard parameters
  let WildcardParams: any = {
    in_PartGroup: PartGroup
  };

  // Fixed parameters
  let FixedParams: any = {
    in_FrontConstructionId: ConstructionId,
    in_GrainGroupId: GrainGroupId
  };

  // Range parameters
  let RangeParams: any = {};

  // Return multiple rows or a single row (UniqueOutput = true returns a single row)
  let UniqueOutput = true;

  // Call the function and retrieve the value
  let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_FrontPanelConstruction, WildcardParams, FixedParams, RangeParams, UniqueOutput);
  if (retVal == undefined) {
    let Text = PartGroup + ' - ' + ConstructionId + ' - ' + GrainGroupId;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 14035', 1);
    logError(ErrorMessage.Message(Text));
  }

  // Return the value
  return retVal;

}