find_FlipliftColorMapping(hardwareColor:string, hardwareType:string):ICT_tab_FlipliftColorMapping {
  let retEntry = ct_tab_FlipliftColorMapping.find(p => p.in_HardwareColor == hardwareColor && p.in_HardwareType == hardwareType);
  if (retEntry == undefined) {
    let Text = hardwareColor + ' - ' + hardwareType;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13019', 1)
    logError(ErrorMessage.Message(Text));
  }
  return retEntry!;
}