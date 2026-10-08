find_CarcaseSidepanelSettings(ModuleName:string, SidepanelType: string, Side: string, AdditionalInfo01: string = 'All'): ICT_tab_CarcaseSidepanelSettings{

  let retEntry = ct_tab_CarcaseSidepanelSettings.find(p => p.in_ModuleName == ModuleName && p.in_SidepanelType == SidepanelType && p.in_Side == Side && p.in_AdditionalInfo01 == AdditionalInfo01)!;

  if (retEntry == undefined) {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 14029', 1)
    logError(ErrorMessage.Message('ModuleName = ' + ModuleName + ', SidepanelType = ' + SidepanelType + ', Side = ' + Side + ', AdditionalInfo01 = ' + AdditionalInfo01));
  }
  return retEntry!;

}