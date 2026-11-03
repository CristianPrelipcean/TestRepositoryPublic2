cfind_2ColorBoardMapping(TopColor: string, BtmColor: string, Thk: number): ICT_ctab_2ColorBoardMapping {

  // Wildcard parameters
  let WildcardParams: any = {

  };

  // Fixed parameters
  let FixedParams: any = {
    in_TopColor: TopColor,
    in_BtmColor: BtmColor,
  };

  // Range parameters
  let RangeParams: any = {
    "Range1": {
      MinAttr: "in_ThkMin",
      MaxAttr: "in_ThkMax",
      Value: Thk
    }
  };

  // Return multiple rows or a single row (UniqueOutput = true returns a single row)
  let UniqueOutput = true;

  // Call the function and return the value
  let retVal = GlobalFunc.process_BasicTableQuery(ct_ctab_2ColorBoardMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
  if (retVal == undefined) {
    let Text = 'Top color: ' + TopColor + 'Bottom color: ' + BtmColor + 'Thickness: ' + Thk;

    logError(Text);
  }
  return retVal;
}