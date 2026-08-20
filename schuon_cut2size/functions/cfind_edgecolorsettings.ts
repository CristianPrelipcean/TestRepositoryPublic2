cfind_EdgeColorSettings(BoardColor: string, BoardThk: number, EdgeBanding: string): ICT_ctab_EdgeColorSettings {

  // Wildcard parameters
  let WildcardParams: any = {
    
  };

  // Fixed parameters
  let FixedParams: any = {
    in_BoardColor: BoardColor,
    in_BoardThk: BoardThk,
    in_EdgeBanding: EdgeBanding
  };

  // Range parameters
  let RangeParams: any = {
    
  };

  // Return multiple rows or a single row (UniqueOutput = true returns a single row)
  let UniqueOutput = true;

  // Call the function and return the value
  let retVal = GlobalFunc.process_BasicTableQuery(ct_ctab_EdgeColorSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
  if (retVal == undefined) {
    let Text = 'Board color: ' + BoardColor + 'Board thickness: ' + BoardThk + 'Edge banding: ' + EdgeBanding;

    logError(Text);
  }
  return retVal;
}