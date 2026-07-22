process_StockPanelSelection(Elem: any, Part: any, ElementType: string, ElementCategory: string, ParentId: string, PanelCategory: string):boolean{

	//========================================================
	// Local variables
	//========================================================
	const partId = Part._partId;
	const length = Part._width;
	const width = Part._depth;
	const thk = Part._thickness;

	//========================================================
	// Try to get a board
	//========================================================

	const boardMapping = GlobalFunc.find_BoardMapping(Part.pa_TopColor, thk);

	// Guard: nothing found
	if (!boardMapping?.BoardId) {
		return false;
	}
	const board = GlobalFunc.find_BoardLibrary(boardMapping.BoardId);
	const boardId = board?.MaterialCode ?? '';

	// Guard: no valid boardId
	if (!boardId) {
		return false;
	}

	//========================================================
	// Try to get the stock part
	//========================================================
	const stockPart = ct_tab_CarcasePanelSelection.find(p =>
		p.in_PartId === partId &&
		p.in_BoardId === boardId &&
		length >= p.in_LengthMin &&
		length <= p.in_LengthMax &&
		width >= p.in_WidthMin &&
		width <= p.in_WidthMax
	);

	// Guard: nothing found
	if (!stockPart) {
		return false;
	}

	//========================================================
	// Continue with found stock part
	//========================================================

	const stockPanel = Elem.addbomout_StockPanel();

	stockPanel.bom_Material = stockPart.StockPartId;
	stockPanel.bom_Length = stockPart.Length;
	stockPanel.bom_Width = stockPart.Width;
	stockPanel.bom_Finalthk = stockPart.Thickness;
	stockPanel.bom_Route = stockPart.Rework;

	return true;
}