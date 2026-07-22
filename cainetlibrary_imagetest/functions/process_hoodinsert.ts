process_HoodInsert(HoodSupplier: string, HoodId: string, IntegrationType: string, ConstructionType: string, CabinetWidth: number, CabinetHeight: number, CabinetDepth: number): {
  DatasetComplete: boolean;
  GraphicId: string;
  ConstructionId: string;
  CarcaseConstructionId: string;
  RearOffset: number;
  BottomShortening: number; 
}
{
  const result = {
    DatasetComplete: false,
    GraphicId: "",
    ConstructionId: "",
    CarcaseConstructionId: "",
    RearOffset: 0,
    BottomShortening: 0
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
  // Schritt 1 – Mapping auswerten
  // ----------------------------------------
  const hoodmapping = GlobalFunc.find_HoodMapping(HoodSupplier, HoodId);

  if (!hoodmapping) {
    return result;
  }

  result.ConstructionId = hoodmapping.ConstructionId ? hoodmapping.ConstructionId:"" ;
  //result.GraphicId = hoodmapping.GraphicId ? hoodmapping.GraphicId:"";
  result.GraphicId = hoodmapping.GraphicId ?? "";

  const hoodconstruction = GlobalFunc.find_HoodConstruction(HoodSupplier, HoodId);
  if (!hoodconstruction) {
    return result;
  }

  let hoodHeight  = hoodconstruction.Height ?? 0;
  let hoodWidth   = hoodconstruction.Width ?? 0;
  let hoodDepth   = hoodconstruction.Depth ?? 0;

  // wenn alles richtig ist im fehlerfall sind wir vorher ausgestiegen.
  result.DatasetComplete = true;
  return result;
}