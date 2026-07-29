find_SegmentFrontMapping(Program: string, Design: string, Color: string):ICT_tab_SegmentFrontMapping | undefined{

  // Wildcard parameters
  let WildcardParams: any = {
    in_FrontProgram: Program,
    in_FrontDesign: Design,    
    in_FrontColor: Color
  };

  // Fixed parameters
  let FixedParams: any = {};

  // Range parameters
  let RangeParams: any = {};

  // Return multiple rows or a single row (UniqueOutput = true returns a single row)
  let UniqueOutput = true;

  // Call the function and retrieve the value
  let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_SegmentFrontMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
  if (retVal == undefined) {
    let Text = Program + ' - ' + Design + ' - ' + Color;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13036', 1);
    logError(ErrorMessage.Message(Text));
  }

  // Return the value
  return retVal;

}