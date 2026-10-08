find_PanelWoodFrameConstruction(PartGroup: string,ConstructionId: string, FrontGrain: string, FillingGrain: string, FillingType: string): ICT_tab_PanelWoodFrameConstruction {

  // Wildcard parameters
  let WildcardParams: any = {
    in_PartGroup: PartGroup
  };

  // Fixed parameters
  let FixedParams: any = {
    in_FrontConstructionId: ConstructionId,
    in_FrontColorGrainGroupId: FrontGrain,
    in_FillingColorGrainGroupId: FillingGrain,
    in_FillingType: FillingType
  };

  // Range parameters
  let RangeParams: any = {};

  // Return multiple rows or a single row (UniqueOutput = true returns a single row)
  let UniqueOutput = true;

  // Call the function and retrieve the value
  let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_PanelWoodFrameConstruction, WildcardParams, FixedParams, RangeParams, UniqueOutput);
  if (retVal == undefined) {
    let Text = PartGroup + ' - ' + ConstructionId + ' - ' + FrontGrain + ' - ' + FillingGrain + ' - ' + FillingType;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 14036', 1);
    logError(ErrorMessage.Message(Text));
  }

  // Return the value
  return retVal;

}