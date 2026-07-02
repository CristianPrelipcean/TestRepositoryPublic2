process_HoodInsert(HoodSupplier: string, HoodId: string, IntegrationType: string, ConstructionType: string, CabinetWidth: number, CabinetHeight: number, CabinetDepth: number): {
  DatasetComplete: boolean;
  GraphicId: string;
  ConstructionId: string;
  CarcaseConstructionId: string;
  RearOffset: number;
  BottomShortening: number; 
    HoodAssemblyInfo: ICT_tab_HoodConstruction; 
}
{
  const result = {
    DatasetComplete: false,
    GraphicId: "",
    ConstructionId: "",
    CarcaseConstructionId: "",
    RearOffset: 0,
    BottomShortening: 0,
	HoodAssemblyInfo: {in_HoodId: ""} as ICT_tab_HoodConstruction
  };

  // ----------------------------------------
  // Guard 1 – Pflichtparameter prüfen
  // ----------------------------------------
  //const isStringOrNumber = (v: unknown): v is string | number =>
  //  typeof v === 'string' || typeof v === 'number';
  const isString = (v: unknown): v is string =>
    typeof v === 'string' ;


  const isNumber = (v: unknown): v is number =>
    typeof v === 'number';

  if (
    !isString(HoodSupplier) ||
    !isString(HoodId) ||
    !isString(IntegrationType) ||
    !isString(ConstructionType) ||
    !isNumber(CabinetWidth) ||
    !isNumber(CabinetHeight) ||
    !isNumber(CabinetDepth)
  ) {
    return result;
  }
  // ----------------------------------------
  // Step 1 Get Hood-Mapping
  // --> Consturction for the Hood
  // ----------------------------------------
  const hoodmapping = GlobalFunc.find_HoodMapping(HoodSupplier, HoodId);

  if (!hoodmapping) {
    return result;
  }

  result.ConstructionId = hoodmapping.ConstructionId ? hoodmapping.ConstructionId:"" ;
  result.GraphicId = hoodmapping.GraphicId ?? "";

  // ----------------------------------------
  // Step 2 Get Hood Installation Info
  // ----------------------------------------
  const hoodconstruction = GlobalFunc.find_HoodConstruction(HoodSupplier, HoodId);
  if (!hoodconstruction) {
    return result;
  }
  /*
  let hoodHeight  = hoodconstruction.Height ?? 0;
  let hoodWidth   = hoodconstruction.Width ?? 0;
  let hoodDepth   = hoodconstruction.Depth ?? 0;
  */
  // ToDo from Insertpoint of the hood
  result.RearOffset = 0; //hoodconstruction.Tower2Depth ?? 0;
  // Save the Installation Info from Hood 
  result.HoodAssemblyInfo = hoodconstruction ;

  // everything ok!
  result.DatasetComplete = true;
  return result;
}