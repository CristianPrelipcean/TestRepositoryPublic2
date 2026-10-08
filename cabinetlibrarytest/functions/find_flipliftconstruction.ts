find_FlipliftConstruction(constructionId:string):ICT_tab_FlipliftConstruction {
  let retEntry = ct_tab_FlipliftConstruction.find(p => p.in_ConstructionId == constructionId);
  if (retEntry == undefined) {
    let Text = constructionId;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 11011', 1)
    logError(ErrorMessage.Message(Text));
  }
  return retEntry!;
}