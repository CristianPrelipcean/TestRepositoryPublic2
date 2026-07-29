find_FillerSettings(FillerType: string, Direction: string, AdditionalInfo01: string = 'All'): ICT_tab_FillerSettings{

  let retEntry = ct_tab_FillerSettings.find(p => p.in_FillerType == FillerType && p.in_Direction == Direction && p.in_AdditionalInfo01 == AdditionalInfo01)!;

  if (retEntry == undefined) {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 14031', 1)
    logError(ErrorMessage.Message('FillerType = ' + FillerType + ', Direction = ' + Direction + ', AdditionalInfo01 = ' + AdditionalInfo01));
  }
  return retEntry!;

}