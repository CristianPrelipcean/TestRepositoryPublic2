process_BomGeneration(Elem: any, Part: any, ElementType: string, ElementCategory: string, ParentId: string, Mode: string, PanelCategory: string) {

	//========================================================
	// StockParts
	//========================================================
	if (Mode === 'StockParts') {

		const stockPartFound = GlobalFunc.process_StockPanelSelection(Elem, Part, ElementType, ElementCategory, ParentId, PanelCategory);

		// If a suitable stock part was found, BOM generation is complete
		if (stockPartFound === true) {
			return;
		}

		// If no suitable stock part was found, continue with BoardAndEdges
		GlobalFunc.process_BoardBom(Elem, Part, ElementType, ElementCategory, ParentId);
		GlobalFunc.process_EdgebandBom(Elem, Part, ParentId, 'EdgeFront');
		GlobalFunc.process_EdgebandBom(Elem, Part, ParentId, 'EdgeRight');
		GlobalFunc.process_EdgebandBom(Elem, Part, ParentId, 'EdgeBack');
		GlobalFunc.process_EdgebandBom(Elem, Part, ParentId, 'EdgeLeft');
		return;
	}

	//========================================================
	// BoardAndEdges
	//========================================================
	if (Mode === 'BoardAndEdges') {

		GlobalFunc.process_BoardBom(Elem, Part, ElementType, ElementCategory, ParentId);
		GlobalFunc.process_EdgebandBom(Elem, Part, ParentId, 'EdgeFront');
		GlobalFunc.process_EdgebandBom(Elem, Part, ParentId, 'EdgeRight');
		GlobalFunc.process_EdgebandBom(Elem, Part, ParentId, 'EdgeBack');
		GlobalFunc.process_EdgebandBom(Elem, Part, ParentId, 'EdgeLeft');
		return;
	}

	//========================================================
	// SimpleBoard
	//========================================================
	if (Mode === 'SimpleBoard') {

		GlobalFunc.process_BoardBom(Elem, Part, ElementType, ElementCategory, ParentId);
		return;
	}
}