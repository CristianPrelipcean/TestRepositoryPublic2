find_HandlePosConstruction(HandlePosMatrix: string, HandlePosHorizontal: string, HandlePosVertical: string, HandleOrientation: string):ICT_tab_HandlePosConstruction{
  let retEntry = ct_tab_HandlePosConstruction.find(p => p.in_HandlePosMatrix == HandlePosMatrix && p.in_HandlePosHorizontal == HandlePosHorizontal && p.in_HandlePosVertical == HandlePosVertical && p.in_HandleOrientation == HandleOrientation);
	if (retEntry == undefined) {
    let Text = 'Handle Pos Matrix: ' + HandlePosMatrix + 'Handle Postion Horizontal: ' + HandlePosHorizontal + 'Handle Postion Vertical: ' + HandlePosVertical + 'Handle Orientation: ' + HandleOrientation;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11002',1);
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}