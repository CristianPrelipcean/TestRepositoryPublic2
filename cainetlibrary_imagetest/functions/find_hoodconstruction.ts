find_HoodConstruction(Supplier: string, HoodId: string):ICT_tab_HoodConstruction{

  let retEntry = ct_tab_HoodConstruction.find(p => p.in_HoodId)!;

  if (retEntry == undefined) {
    let Text = HoodId;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13024', 1);
    logError(ErrorMessage.Message(Text)); 
  }
  return retEntry!;
}