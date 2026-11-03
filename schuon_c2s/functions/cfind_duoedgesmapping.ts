cfind_DuoEdgesMapping(MainEdgeColor: string): ICT_ctab_DuoEdgesMapping {

  // Wildcard parameters
  let WildcardParams: any = {

  };

  // Fixed parameters
  let FixedParams: any = {
    in_MainEdgeColor: MainEdgeColor
  };

  // Range parameters
  let RangeParams: any = {
  };

  // Return multiple rows or a single row (UniqueOutput = true returns a single row)
  let UniqueOutput = true;

  // Call the function and return the value
  let retVal = GlobalFunc.process_BasicTableQuery(ct_ctab_DuoEdgesMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
  if (retVal == undefined) {
    let Text = 'Main edge color: ' + MainEdgeColor;

    logError(Text);
  }

return retVal;
}