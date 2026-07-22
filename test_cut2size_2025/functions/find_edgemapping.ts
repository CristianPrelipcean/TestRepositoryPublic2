find_EdgeMapping(EdgeClass:string, EdgeTechnology:string, Color:string, BoardThk:number):any{

		// Wildcard parameters
		let WildcardParams: any = {	
			in_EdgeTechnology: EdgeTechnology,
			in_Color: Color
		};
		
		// Fixed parameters
		let FixedParams: any = {
			in_EdgeClass: EdgeClass,
		};
		
		// Range parameters
		let RangeParams: any = {
			"Range1": {
				MinAttr: "in_BoardThkMin",
				MaxAttr: "in_BoardThkMax",
				Value: BoardThk
			}
		};
	
		// Return multiple rows or a single row (UniqueOutput = true returns a single row)
		let UniqueOutput=true;
	
		// Call the function and return the value
		let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_EdgeMapping, WildcardParams, FixedParams, RangeParams, UniqueOutput);
		if (retVal == undefined) {
			let Text = 'Edge Class: ' + EdgeClass + 'Edge Technology: ' + EdgeTechnology + 'Color: ' + Color + 'Board Thickness: ' + BoardThk;
			let ErrorMessage = GlobalFunc.find_ErrorList('Error 13002',1);
			logError(ErrorMessage.Message(Text));
		}
		return retVal;
	}