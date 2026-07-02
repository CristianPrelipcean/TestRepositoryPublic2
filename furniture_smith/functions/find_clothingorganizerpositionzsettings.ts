find_ClothingOrganizerPositionZSettings(Type: string, Design: string): ICT_tab_ClothingOrganizerPositionZSettings {
  // Call the function and return the value
  let retEntry = ct_tab_ClothingOrganizerPositionZSettings.find(p =>
    p.in_ClothesOrganizerType == Type &&
    p.in_ClothesOrganizerDesign == Design
  );

  // ErrorMessage
  if (retEntry == undefined) {
    let Text = Type + ' - ' + Design;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13040', 1)
    logError(ErrorMessage.Message(Text));
  }

  // Return Value
  return retEntry!;
}