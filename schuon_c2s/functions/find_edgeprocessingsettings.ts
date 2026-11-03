find_EdgeProcessingSettings(TypeElement:string, EdgeTransition:string, EdgeThk:number, EdgeThkNeighbour:number):any{

		// Wildcard parameters
		let WildcardParams: any = {	
			in_TypeElement: TypeElement

		};
		
		// Fixed parameters
		let FixedParams: any = {
      in_EdgeTransition: EdgeTransition,
      in_EdgeThk: EdgeThk,
      in_EdgeThkNeighbour: EdgeThkNeighbour
		};
		
		// Range parameters
		let RangeParams: any = {};
	
		// Return multiple rows or a single row (UniqueOutput = true returns a single row)
		let UniqueOutput=true;
	
		// Call the function and return the value
		let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_EdgeProcessingSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
		if (retVal == undefined) {
			let Text = 'Type element: ' + TypeElement + 'Edge transition: ' + EdgeTransition +  'Edge thickness: ' + EdgeThk + 'Edge thickness neighbour: ' + EdgeThkNeighbour;
			let ErrorMessage = GlobalFunc.find_ErrorList('Error 14004',1);
			logError(ErrorMessage.Message(Text));
		}
		return retVal;
	}