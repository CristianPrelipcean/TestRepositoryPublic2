find_FlipliftWeightTypeMapping(flipliftType:string, hardwareType:string, height:number):ICT_tab_FlipliftWeightTypeMapping {
  let retEntry = ct_tab_FlipliftWeightTypeMapping.find(p => p.in_FlipliftType == flipliftType && p.in_HardwareType == hardwareType && p.in_HeightMin <= height && p.in_HeightMax >= height);
  if (retEntry == undefined) {
    let Text = flipliftType + ' - ' + hardwareType + ' - ' + height;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13021', 1)
    logError(ErrorMessage.Message(Text));
  }
  return retEntry!;
}