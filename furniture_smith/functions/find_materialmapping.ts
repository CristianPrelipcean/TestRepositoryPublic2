find_MaterialMapping(color: string, colorIdParent: string = 'All'): ICT_tab_MaterialMapping | undefined {

  let retEntry = ct_tab_MaterialMapping.find(p => p.in_ColorId === color && p.in_ColorIdParent === colorIdParent);

  // Error handling
  if (retEntry === undefined) {
    const ErrorMessage = GlobalFunc.find_ErrorList('Error 13023', 1);
    logError(ErrorMessage.Message(color + ' - ' + colorIdParent));
    retEntry = ct_tab_MaterialMapping.find(p => p.in_ColorId === 'Error');
    if (retEntry === undefined) {
      return undefined
    }
  }

  return retEntry;
}