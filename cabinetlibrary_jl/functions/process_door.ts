process_Door(m:any){

	// Create Interface
	interface DoorInformation {
		configValid: boolean;
		VertDivider: string;
		FrontDescriptor: string;
		DoorQty: number;
		DescriptorList: number[];
		FrontWidthList: number[];
		TotalWidth: number;
		DoorDirection: string[];
		HandleMatrixList: string[];
		VertDividerList: string[];
	  }

	// Create Variables
	let configValid = true;
	let VertDivider = "None";
	let FrontDescriptor = "None";
	let DoorQty = 0;
	let DescriptorList: number[] = [];
	let FrontWidthList: number[] = [];
	let TotalWidth = 0;
	let DoorDirection: string[] = [];
	let HandleMatrixList: string[] = [];
	let VertDividerList: string[] = [];

	// Call table DoorSettings
	let retDoorSettings = GlobalFunc.find_DoorSettings(m.mod_ParentName!, m.mod_TypeElement!, m.mod_CarcaseDirectionInfo!, m.mod_FrontDesign!, m.mod_FrontColor!, m.mod_FrontWidth!, m.mod_DoorType!, m.mod_DoorDirection!, m.mod_VertDividerType!);

	// Check if the configuration is valid
	if (retDoorSettings !== undefined) {

		// Call the attributes
		VertDivider = retDoorSettings.VertDividerType!
		FrontDescriptor = m.mod_DoorType == "Automatic" ? retDoorSettings.FrontDescriptor! : m.mod_FrontDescriptor!;
		DoorQty = retDoorSettings.DoorQty!

		// Door dimensions
		DescriptorList = GlobalFunc.process_Descriptor(FrontDescriptor!, m.mod_FrontWidth!);
		if (DescriptorList.length > 0 && DoorQty > 1) {
			DescriptorList.forEach(p =>{
				FrontWidthList.push(p);
				TotalWidth += p;
			});
			FrontWidthList.push(m.mod_FrontWidth! - TotalWidth);
		}
		else{
			FrontWidthList.push(m.mod_FrontWidth!);
		}

		// Check if the configuration is valid
		if (DoorQty > 1 && DoorQty != FrontWidthList.length){
			let ErrorMessage = GlobalFunc.find_ErrorList('Error 22028', 1);
			logError(ErrorMessage.Message(''));
			configValid = false;
		}

		// Door direction
		DoorDirection.push(retDoorSettings.FirstDoorDirection!);
		DoorDirection.push(retDoorSettings.SecondDoorDirection!);

		// Handle matrix
		if (DoorQty == 1){
			HandleMatrixList.push(m.mod_HandlePosMatrix!);
		}
		else{
			HandleMatrixList.push(m.mod_HandlePosLeftMatrix!);
			HandleMatrixList.push(m.mod_HandlePosRightMatrix!);
		}

		// Vertical divider (only for duststrip)
		if (DoorQty > 1){
			if (VertDivider == 'DustStripLeft'){
				VertDividerList.push(VertDivider);
				VertDividerList.push('NoVertDivider');
			}
			else if (VertDivider == 'DustStripRight'){
				VertDividerList.push('NoVertDivider');
				VertDividerList.push(VertDivider);
			}
			else{
				VertDividerList.push('NoVertDivider');
				VertDividerList.push('NoVertDivider');
			}
		}
		else{
			VertDividerList.push('NoVertDivider');
		}
	} 
	else {
		configValid = false;
	}

	// Create the object and return it
	let DoorInfo: DoorInformation = {
		configValid: configValid,
		VertDivider: VertDivider,
		FrontDescriptor: FrontDescriptor,
		DoorQty: DoorQty,
		DescriptorList: DescriptorList,
		FrontWidthList: FrontWidthList,
		TotalWidth: TotalWidth,
		DoorDirection: DoorDirection,
		HandleMatrixList: HandleMatrixList,
		VertDividerList: VertDividerList
	  };
	
	  return DoorInfo;
}