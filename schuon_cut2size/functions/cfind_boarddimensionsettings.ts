cfind_BoardDimensionSettings(Color: string, Grain: string, BtmColor: string, Thk: number): ICT_ctab_BoardDimensionSettings {

  // Wildcard parameters
  let WildcardParams: any = {

  };

  // Fixed parameters
  let FixedParams: any = {
    in_Color: Color,
    in_Grain: Grain,
    in_BtmColor: BtmColor,
    in_PartThickness: Thk
  };

  // Range parameters
  let RangeParams: any = {
    
  };

  // Return multiple rows or a single row (UniqueOutput = true returns a single row)
  let UniqueOutput = true;

  // Call the function and return the value
  let retVal = GlobalFunc.process_BasicTableQuery(ct_ctab_BoardDimensionSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
  if (retVal == undefined) {
    let Text = 'Color: ' + Color + 'Grain: ' + Grain + 'Bottom color: ' + BtmColor + 'Thickness: ' + Thk;

    logError(Text);
  }
  return retVal;
}