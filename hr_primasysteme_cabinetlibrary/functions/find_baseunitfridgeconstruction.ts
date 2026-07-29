find_BaseunitFridgeConstruction(ConstructionId: string): ICT_tab_BaseunitFridgeConstruction {

  let retEntry = ct_tab_BaseunitFridgeConstruction.find(p => p.in_ConstructionId == ConstructionId);

  if (retEntry == undefined) {
    let Text = ConstructionId;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 11015', 1);
    logError(ErrorMessage.Message(Text));
  }

  return retEntry!;
}