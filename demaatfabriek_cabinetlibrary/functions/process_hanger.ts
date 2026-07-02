process_Hanger(m: parent, BackwallPosition: number, DistanceBehindBackwallMin: number, posTop: number = 0, freeSpace: string = '') {

	//---------------Initialize output variable---------------------------

	// Interface for the HangerDetails
	interface HangerDetails 
	{
		HangerType: string|undefined;
		HangerTypeObject: string|undefined;
		IncludeWallPlateRight: boolean|undefined;
		WallPlateRightLength: number|undefined;
		IncludeWallPlateLeft: boolean|undefined;
		WallPlateLeftLength: number|undefined;
		VerticalOffset: number|undefined;
		VerticalOffsetWallPlateToHanger: number|undefined;
		HardwareItem: string|undefined;
		ProcessingItem: string|undefined;
		GraphicItem: string | undefined;
		HorizontalFreeSpace: number | undefined;
	}

	let HangerData: HangerDetails = {
		HangerType: undefined,
		HangerTypeObject: undefined,
		IncludeWallPlateRight: undefined,
		WallPlateRightLength: undefined,
		IncludeWallPlateLeft: undefined,
		WallPlateLeftLength: undefined,
		VerticalOffsetWallPlateToHanger: undefined,
		VerticalOffset: undefined,
		HardwareItem: undefined,
		ProcessingItem: undefined,
		GraphicItem: undefined,
		HorizontalFreeSpace: undefined
	}

	// Get the free space data
	let freeSpaces = JSON.parse(freeSpace);
	let FullWidthFreeSpace = freeSpaces.FullWidthFreeSpace;
	let FullWidthStartPos = freeSpaces.FullWidthStartPos;
	let FullDepthStartPos = freeSpaces.FullDepthStartPos;
	let FreeSpaceDepthStartPos = freeSpaces.FreeSpaceDepthStartPos;
	let FreeSpaceWidth = freeSpaces.FreeSpaceWidth;
	let FreeSpaceWidthStartPos = freeSpaces.FreeSpaceWidthStartPos;

	
	//========================================================================
	// Hanger Selection
	//========================================================================
	
	if(m.mod_HangerType == 'Custom')
	{
	
		//=====================================
		// Call user exit for customization
		//=====================================
		
		// Call the user exit
		let retValUe = GlobalFunc.ue_HangerSelection(m, BackwallPosition, DistanceBehindBackwallMin, FullWidthFreeSpace);
	
		// Set the Output values
		HangerData.HangerType = retValUe.HangerType!;
		HangerData.HangerTypeObject = retValUe.HangerTypeObject;
		HangerData.IncludeWallPlateRight= retValUe.IncludeWallPlateRight!;
		HangerData.WallPlateRightLength = retValUe.WallPlateRightLength;
		HangerData.IncludeWallPlateLeft= retValUe.IncludeWallPlateLeft!;
		HangerData.WallPlateLeftLength = retValUe.WallPlateLeftLength;
		HangerData.VerticalOffset = retValUe.VerticalOffset!;
		HangerData.VerticalOffsetWallPlateToHanger = retValUe.VerticalOffsetWallPlateToHanger!;
		HangerData.HardwareItem = retValUe.HardwareItem!;
		HangerData.ProcessingItem = retValUe.ProcessingItem!;
		HangerData.GraphicItem = retValUe.GraphicItem!;
		HangerData.HorizontalFreeSpace = retValUe.HorizontalFreeSpace;

	}
	else if (m.mod_HangerType == 'Automatic')
	{
		//=====================================
		// Standard Library Solution
		//=====================================

		//---------------Get data from table HangerSettings---------------------------
		let retHangerSettings = GlobalFunc.find_HangerSettings(m.mod_TypeElement, m.mod_CarcaseHeight, m.mod_CarcaseWidth, 20, DistanceBehindBackwallMin, BackwallPosition); ////////////////////////////////// ROOT MODULE NOT DEFINED AND CALCULATION OF WEIGHT PENDING!!!!!!!!!

		//---------------Get data from table HangerMapping---------------------------
		let retHangerMapping = GlobalFunc.find_HangerMapping(retHangerSettings.HangerType!, m.mod_CarcaseWidth, m.mod_HangerColor);
		
		//---------------Get data from table ObjectMapping---------------------------
		let retHangerObject = GlobalFunc.find_ObjectMapping(retHangerMapping.Object!);
		
		//---------------Calculate Vertical Offset---------------------------
		let verticalOffset : number = 0;
		if(m.mod_HangerPosY == 'Automatic')
		{ verticalOffset = retHangerMapping.VerticalOffset!; }
		else if (m.mod_HangerPosY == 'Top')
		{ verticalOffset = 0; }
		else if (m.mod_HangerPosY == 'Middle')
		{ verticalOffset = -m.mod_CarcaseHeight / 2; }
		else if (m.mod_HangerPosY == 'Manual')
		{ verticalOffset = - m.mod_HangerOffsetPosY; }				

		//---------------Set output value---------------------------
		
		HangerData.HangerType = retHangerSettings.HangerType!;
		HangerData.HangerTypeObject = retHangerMapping.Object!;
		HangerData.IncludeWallPlateRight= retHangerMapping.IncludeWallPlateRight!;
		HangerData.WallPlateRightLength = retHangerMapping.WallPlateRightLength(this,FullWidthFreeSpace)!;
		HangerData.IncludeWallPlateLeft= retHangerMapping.IncludeWallPlateLeft!;
		HangerData.WallPlateLeftLength = retHangerMapping.WallPlateLeftLength(this,FullWidthFreeSpace)!;
		HangerData.VerticalOffset = verticalOffset;
		HangerData.VerticalOffsetWallPlateToHanger = retHangerMapping.VerticalOffsetWallPlateToHanger!;
		HangerData.HardwareItem = retHangerObject.HardwareItem!;
		HangerData.ProcessingItem = retHangerObject.ProcessingItem!;
		HangerData.GraphicItem = retHangerObject.GraphicItem!;
		HangerData.HorizontalFreeSpace = FullWidthFreeSpace;

	}
	else
	{
		
		//=====================================
		// Manual Selection
		//=====================================
		
		//---------------Get data from table HangerMapping---------------------------
		let retHangerMapping = GlobalFunc.find_HangerMapping(m.mod_HangerType!, m.mod_CarcaseWidth, m.mod_HangerColor);
		
		// //---------------Get data from table ObjectMapping---------------------------
		let retHangerObject = GlobalFunc.find_ObjectMapping(retHangerMapping.Object!);

		//---------------Calculate Vertical Offset---------------------------
		let verticalOffset : number = 0;
		if(m.mod_HangerPosY == 'Automatic')
		{ verticalOffset = retHangerMapping.VerticalOffset!; }
		else if (m.mod_HangerPosY == 'Top')
		{ verticalOffset = 0; }
		else if (m.mod_HangerPosY == 'Middle')
		{ verticalOffset = m.mod_CarcaseHeight / 2; }
		else if (m.mod_HangerPosY == 'Manual')
		{ verticalOffset = - m.mod_HangerOffsetPosY; }

		HangerData.HangerType = m.mod_HangerType!;
		HangerData.HangerTypeObject = retHangerMapping.Object!;
		HangerData.IncludeWallPlateRight= retHangerMapping.IncludeWallPlateRight!;
		HangerData.WallPlateRightLength = retHangerMapping.WallPlateRightLength(m, FullWidthFreeSpace)!;
		HangerData.IncludeWallPlateLeft= retHangerMapping.IncludeWallPlateLeft!;
		HangerData.WallPlateLeftLength = retHangerMapping.WallPlateLeftLength(m, FullWidthFreeSpace)!;
		HangerData.VerticalOffset = verticalOffset;
		HangerData.VerticalOffsetWallPlateToHanger = retHangerMapping.VerticalOffsetWallPlateToHanger!;
		HangerData.HardwareItem = retHangerObject.HardwareItem!;
		HangerData.ProcessingItem = retHangerObject.ProcessingItem!;
		HangerData.GraphicItem = retHangerObject.GraphicItem!;
		HangerData.HorizontalFreeSpace = FullWidthFreeSpace!;
	}

	//=====================================
	// Add the module
	//=====================================
	
	let Hanger = m.addOD_M_mc_HangerSystem01();

	// Pass the Hanger Informations to the HangerInfo attribute
	let HangerstrJson = JSON.stringify(HangerData);
	Hanger.mod_HangerInfo.push(HangerstrJson);

	// setOrigin
	let hangerCarcaseSpaceDepthStartpos = FreeSpaceDepthStartPos.length ? FreeSpaceDepthStartPos[FreeSpaceDepthStartPos.length - 1] : FullDepthStartPos;
	let hangerCarcaseSpaceWidthStartpos = FreeSpaceWidthStartPos.length ? FreeSpaceWidthStartPos[FreeSpaceWidthStartPos.length - 1] : FullWidthStartPos;
	Hanger.setOrigin(hangerCarcaseSpaceWidthStartpos, posTop, hangerCarcaseSpaceDepthStartpos);

	// Save origin in Attribute
	Hanger.mod_Originpos.push(m.mod_Originpos[0] + hangerCarcaseSpaceWidthStartpos);
	Hanger.mod_Originpos.push(m.mod_Originpos[1] + posTop);
	Hanger.mod_Originpos.push(m.mod_Originpos[2] + hangerCarcaseSpaceDepthStartpos);

	return HangerData;

}