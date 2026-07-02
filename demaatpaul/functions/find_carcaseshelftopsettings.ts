find_CarcaseShelftopSettings(ModuleName: string, ShelftopConstruction: string, AdditionalInfo1: string = 'All'): ICT_tab_CarcaseShelftopSettings[]{

  let retEntry = ct_tab_CarcaseShelftopSettings.filter(p => p.in_ModuleName == ModuleName && p.in_ShelfTopConstruction == ShelftopConstruction && p.in_AdditionalInfo1 == AdditionalInfo1)!;

  if (retEntry == undefined || retEntry.length == 0) {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 14026', 1)
    logError(ErrorMessage.Message(ModuleName + " - " + ShelftopConstruction + " - " + AdditionalInfo1));
  }
  return retEntry!;

}