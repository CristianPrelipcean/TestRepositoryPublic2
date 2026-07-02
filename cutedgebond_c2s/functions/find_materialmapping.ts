find_MaterialMapping(color: string): ICT_tab_MaterialMapping {
  let retEntry = ct_tab_MaterialMapping.find(p => p.in_ColorId == color);
  if (retEntry == undefined) {
    let Text = color;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13007', 1)
    logError(ErrorMessage.Message(Text));
  }
  return retEntry!;
}