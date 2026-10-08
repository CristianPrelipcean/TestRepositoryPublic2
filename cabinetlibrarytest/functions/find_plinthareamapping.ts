find_PlinthAreaMapping(MatrixPositionType: number, PlinthAreaDesign: string, PlinthAreaElementColor: string, PlinthAreaExtraItem: string, PlinthAreaHeight: number, ShelfBtmThk: number, ColorRelevant: boolean = false, ExtraItemRelevant: boolean = false):ICT_tab_PlinthAreaMapping{
  
	// Wildcard parameters
	let WildcardParams: any = {};
	
	// Fixed parameters
	const FixedParams: any = {
		in_MatrixPositionType: MatrixPositionType,
		in_PlinthAreaDesign: PlinthAreaDesign,
		...(ColorRelevant && { in_PlinthAreaElementColor: PlinthAreaElementColor }),
		...(ExtraItemRelevant && { in_PlinthAreaExtraItem: PlinthAreaExtraItem })
	};
	
	// Range parameters
	let RangeParams: any = {
		"Range1": {
		MinAttr: "in_PlinthAreaHeightMin",
		MaxAttr: "in_PlinthAreaHeightMax",
		Value: PlinthAreaHeight
    },
    "Range2": {
		MinAttr: "in_ShelfBtmThkMin",
		MaxAttr: "in_ShelfBtmThkMax",
		Value: ShelfBtmThk
    }
	};

	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

	// Call the function and return the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_PlinthAreaMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
		let Text = MatrixPositionType + ' - ' + PlinthAreaDesign + ' - ' + PlinthAreaElementColor + ' - ' + PlinthAreaExtraItem + ' - ' + PlinthAreaHeight + ' - ' + ShelfBtmThk;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13007',1)
		logError(ErrorMessage.Message(Text));
	}
	return retVal;

}