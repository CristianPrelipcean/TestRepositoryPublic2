find_FlipliftMapping(flipliftType: string, hardwareType: string, weightType: number, direction: string, height: number, color: string): ICT_tab_FlipliftMapping {
  
  let retEntry = ct_tab_FlipliftMapping.find(p =>
    p.in_FlipliftType == flipliftType &&
    p.in_HardwareType == hardwareType &&
    p.in_WeightTypeMin <= weightType && p.in_WeightTypeMax >= weightType &&
    p.in_HeightMin <= height && p.in_HeightMax >= height &&
    p.in_Direction == direction &&
    p.in_Color == color
  );

  if (retEntry == undefined) {
    let Text = flipliftType + ' - ' + hardwareType + ' - ' + weightType + ' - ' + height + ' - ' + direction + ' - ' + color;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13020', 1)
    logError(ErrorMessage.Message(Text));
  }
  return retEntry!;
}