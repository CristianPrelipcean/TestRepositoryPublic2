find_CornerFillerFrontpanelConstruction(ParentModule: string, CornerFillerFrontConstruction: string, CarcaseDirection: string = 'All'): ICT_tab_CornerFillerFrontpanelConstruction[]{

  let retEntry = ct_tab_CornerFillerFrontpanelConstruction.filter(p => p.in_ParentModule == ParentModule && p.in_CornerFillerFrontConstruction == CornerFillerFrontConstruction && p.in_CarcaseDirection == CarcaseDirection)!;

  if (retEntry == undefined || retEntry.length == 0) {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 11018', 1)
    logError(ErrorMessage.Message(ParentModule + " - " + CornerFillerFrontConstruction + " - " + CarcaseDirection));
  }
  return retEntry!;

} 