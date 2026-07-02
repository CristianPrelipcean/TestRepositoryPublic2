calc_HardwareObjectInfo(Object:string):any
  {

    //========================================================================
	  // Helper Function to retrieve the hardware data
	  //========================================================================
    
		//---------------Get data from table ObjectMapping---------------------------
		let objMapping = GlobalFunc.find_ObjectMapping(Object!);
		
		///////////////// GraphicLibrary //////////
		//---------------Get data from table GraphicLibraryMapping---------------------------
		let hardGraphicMapping = GlobalFunc.find_GraphicLibraryMapping(objMapping.GraphicItem!);

		//---------------Get data from table GraphicLibrary---------------------------
		let graphicItem: any[]=[];
		let i: number=0;
		hardGraphicMapping.forEach(hgm=>
			{
				i++;
				if(i>1)
				{
					logError('ERROR - ONLY ONE GRAPHIC IS EXPECTED');
				}
				else
				{
					let tempvar = GlobalFunc.find_GraphicLibrary(hgm.Model3DGroupName!);
					graphicItem.push(tempvar);
				}
			});
		
		///////////////// OutputData //////////
		//---------------Initialize variable---------------------------
		let HardwareDetails: any = {};
		
		//---------------Assign data to variable---------------------------
		HardwareDetails.HardwareItem=objMapping.HardwareItem!;
		HardwareDetails.ProcessingItem=objMapping.ProcessingItem!;
		HardwareDetails.Graphics=graphicItem[0];
		
		//---------------Output variable with data---------------------------
		return HardwareDetails;

	}