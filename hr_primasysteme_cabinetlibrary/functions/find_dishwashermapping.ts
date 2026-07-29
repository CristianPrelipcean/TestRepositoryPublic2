find_DishwasherMapping(Supplier: string,DishwasherId: string):ICT_tab_DishwasherMapping{

	let retEntry = ct_tab_DishwasherMapping.find(p => p.in_Supplier == Supplier && p.in_DishwasherId == DishwasherId)!;

	if (retEntry == undefined) {
		let Text = Supplier + ', ' + DishwasherId;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13028',1);
		logError(ErrorMessage.Message(Text));
	}

	return retEntry;
}