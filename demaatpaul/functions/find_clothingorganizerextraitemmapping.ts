find_ClothingOrganizerExtraItemMapping(Type: string, Design: string, ExtraItemColor: string, CarcaseProgramm:string, HardwareColor: string): ICT_tab_ClothingOrganizerExtraItemMapping{

  let retEntry = ct_tab_ClothingOrganizerExtraItemMapping.find(p =>
    p.in_CarcaseProgram == CarcaseProgramm &&
    p.in_ClothesOrganizerDesign == Design &&
    p.in_ClothesOrganizerExtraItemColor == ExtraItemColor &&
    p.in_ClothesOrganizerType == Type &&
    p.in_HardwareColor == HardwareColor
  );

  if (retEntry == undefined) {
    let Text = Type + ' - ' + Design + ' - ' + ExtraItemColor + ' - ' + CarcaseProgramm + ' - ' + HardwareColor;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13034', 1)
    logError(ErrorMessage.Message(Text));
  }

  return retEntry!;

}