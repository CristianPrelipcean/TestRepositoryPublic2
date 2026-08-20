cfind_BoardBtmColorMapping(Color: string, BtmColor: string, Thk: number): ICT_ctab_BoardBtmColorMapping [] {

  // Wildcard parameters
  let WildcardParams: any = {

  };

  // Fixed parameters
  let FixedParams: any = {
    in_Color: Color,
    in_BtmColor: BtmColor
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
  let UniqueOutput = false;

  // Call the function and return the value
  let retVal = GlobalFunc.process_BasicTableQuery(ct_ctab_BoardBtmColorMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
  if (retVal == undefined) {
    let Text = 'Color: ' + Color + 'Thickness: ' + Thk;
    logError('Could not found value for: ' + Text);
  }
  return retVal;
}