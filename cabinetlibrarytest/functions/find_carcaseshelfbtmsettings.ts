find_CarcaseShelfbtmSettings (ModuleName:string, ShelfbtmConstruction: string, AdditionalInfo01: string = 'All'): ICT_tab_CarcaseShelfbtmSettings{

  let retEntry = ct_tab_CarcaseShelfbtmSettings.find(p => p.in_ModuleName == ModuleName && p.in_ShelfbtmConstruction == ShelfbtmConstruction && p.in_AdditionalInfo01 == AdditionalInfo01)!;

  if (retEntry == undefined) {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 14030', 1)
    logError(ErrorMessage.Message('ModuleName = ' + ModuleName + ', ShelfbtmConstruction = ' + ShelfbtmConstruction + ', AdditionalInfo01 = ' + AdditionalInfo01));
  }
  return retEntry!;

}