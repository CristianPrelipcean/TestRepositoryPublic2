find_ClothingOrganizerExtraItemMapping(Type: string, Design: string, ExtraItemColor: string, CarcaseProgramm:string, HardwareColor: string): ICT_tab_ClothingOrganizerExtraItemMapping | undefined{

  const WildcardParams: any = {
    in_CarcaseProgram: CarcaseProgramm,
    in_ClothesOrganizerDesign: Design,
    in_ClothesOrganizerExtraItemColor: ExtraItemColor,
    in_ClothesOrganizerType: Type,
    in_HardwareColor: HardwareColor
  };

  // Fixed parameters
  const FixedParams: any = {};

  // Range parameters
  const RangeParams: any = {};

  // Return multiple rows or a single row (UniqueOutput = true returns a single row)
  const UniqueOutput = true;

  // Call the function and retrieve the value
  const retVal = GlobalFunc.process_BasicTableQuery(ct_tab_ClothingOrganizerExtraItemMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);

  // Return the value
  return retVal;

}