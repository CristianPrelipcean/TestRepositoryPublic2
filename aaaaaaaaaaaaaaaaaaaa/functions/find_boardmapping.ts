find_BoardMapping(Color: string, Thk: number): ICT_tab_BoardMapping {

  // Wildcard parameters
  let WildcardParams: any = {

  };

  // Fixed parameters
  let FixedParams: any = {
    in_Color: Color
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
  let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_BoardMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
  if (retVal == undefined) {
    let Text = 'Color: ' + Color + 'Thickness: ' + Thk;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13001', 1);
    logError(ErrorMessage.Message(Text));
  }
  return retVal;
}