find_MaterialMapping(color: string, solveError: boolean = true): ICT_tab_MaterialMapping  {

  let retEntry = ct_tab_MaterialMapping.find(p => p.in_ColorId == color);

  if (solveError) {
    // Error handling
    if (retEntry == undefined) {
      let Text = color;
      let ErrorMessage = GlobalFunc.find_ErrorList('Error 13007', 1)
      logInfo(ErrorMessage.Message(Text));
      
      retEntry = ct_tab_MaterialMapping.find(p => p.in_ColorId === 'Error');
    }  
  }

  return retEntry!;
}