find_SpacerConstruction(SpacerModule: string): ICT_tab_SpacerConstruction {

  // Wildcard parameters
  let WildcardParams: any = {};
    

  // Fixed parameters
  let FixedParams: any = {
    in_SpacerModule: SpacerModule,
  };

  // Range parameters
  let RangeParams: any = {};

  // Return multiple rows or a single row (UniqueOutput = true returns a single row)
  let UniqueOutput = true;

  let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_SpacerConstruction, WildcardParams, FixedParams, RangeParams, UniqueOutput);
  if (retVal == undefined) {
    let Text = SpacerModule;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13044', 1);
    logError(ErrorMessage.Message(Text));
  }

  return retVal;

}