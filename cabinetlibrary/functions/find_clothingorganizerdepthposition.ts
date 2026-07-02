find_ClothingOrganizerDepthPosition(Type: string, Design: string): ICT_tab_ClothingOrganizerDepthPosition {
  // Call the function and return the value
  let retEntry = ct_tab_ClothingOrganizerDepthPosition.find(p =>
    p.in_ClothingOrganizerType == Type &&
    p.in_ClothingOrganizerDesign == Design
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