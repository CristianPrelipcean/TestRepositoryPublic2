find_ShelfDiversMapping(ShelfAdjDesign: String, Width: Number,Depth: Number, Height: Number): ICT_tab_ShelfDiversMapping{
	// Wildcard parameters
	let WildcardParams: any = {	
		in_ShelfAdjDesign   : ShelfAdjDesign
  };
  // Fixed parameters
	let FixedParams: any = {
	};
	// Range parameters
	let RangeParams: any = {
		"Range1": {
			MinAttr: "in_MinWidth",
			MaxAttr: "in_MaxWidth",
			Value: Width
		},
		"Range2": {
			MinAttr: "in_MinDepth",
			MaxAttr: "in_MaxDepth",
			Value: Depth
    },
    "Range3": {
			MinAttr: "in_MinHeight",
			MaxAttr: "in_MaxHeight",
			Value: Depth
		}
	};
	// Return multiple rows or a single row (UniqueOutput = true returns a single row)
	let UniqueOutput=true;

  // Call the function and retrieve the value
	let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_ShelfDiversMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
	if (retVal == undefined) {
    let Text = "no entry found for " + ShelfAdjDesign + ":  " + Width + " / " + Depth + " / " + Height ;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13024',1);
		logError(ErrorMessage.Message(Text));
	}
	// Return the value
	return retVal;
  
}