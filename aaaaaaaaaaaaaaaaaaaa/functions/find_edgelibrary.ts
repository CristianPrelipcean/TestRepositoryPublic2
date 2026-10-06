find_EdgeLibrary(EdgeObject: string): ICT_tab_EdgeLibrary {
  let retEntry = ct_tab_EdgeLibrary.find(p => p.in_EdgeCode == EdgeObject);
  if (retEntry == undefined) {
    let Text = 'Edge code: ' + EdgeObject;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 12002', 1);
    logError(ErrorMessage.Message(Text));
  }
  return retEntry!;
}