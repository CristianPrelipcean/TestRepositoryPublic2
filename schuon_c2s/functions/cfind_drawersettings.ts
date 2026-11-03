cfind_DrawerSettings(Type: string, Design: string, Height: string, FrontConType: string): ICT_ctab_DrawerSettings {

  // Wildcard parameters
  let WildcardParams: any = {

  };

  // Fixed parameters
  let FixedParams: any = {
    in_DrawerType: Type,
    in_DrawerDesign: Design,
    in_DrawerHeight: Height,
    in_DrawerBoxMountingType: FrontConType
   
  };

  // Range parameters
  let RangeParams: any = {

  };


  // Return multiple rows or a single row (UniqueOutput = true returns a single row)
  let UniqueOutput = true;

  // Call the function and return the value
  let retVal = GlobalFunc.process_BasicTableQuery(ct_ctab_DrawerSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
  if (retVal == undefined) {
    let Text = 'Type: ' + Type + 'Design: ' + Design + 'Height: ' + Height + 'FrontConType: ' + FrontConType;
    logError(Text);
  }
  return retVal;
}