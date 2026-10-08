ue_HangerSelection(m: parent, BackwallPosition: number, DistanceBehindBackwallMin: number, HorizontalFreeSpace: number){

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
		GraphicItem: string|undefined;
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

//---------------Get data from table HangerSettings---------------------------
		let retHangerSettings = GlobalFunc.find_HangerSettings(m.mod_TypeElement, m.mod_CarcaseHeight, m.mod_CarcaseWidth, 20, DistanceBehindBackwallMin, BackwallPosition); ////////////////////////////////// ROOT MODULE NOT DEFINED AND CALCULATION OF WEIGHT PENDING!!!!!!!!!

		// Guard
		if (retHangerSettings == undefined) {
			return HangerData;
		}
		
		//---------------Get data from table HangerMapping---------------------------
		let retHangerMapping = GlobalFunc.find_HangerMapping(retHangerSettings.HangerType!, m.mod_CarcaseWidth, m.mod_HangerColor);
		
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

		//---------------Set output value---------------------------
		
		HangerData.HangerType = retHangerSettings.HangerType!;
		HangerData.HangerTypeObject = retHangerMapping.Object!;
		HangerData.IncludeWallPlateRight= retHangerMapping.IncludeWallPlateRight!;
		HangerData.WallPlateRightLength = retHangerMapping.WallPlateRightLength(this,HorizontalFreeSpace)!;
		HangerData.IncludeWallPlateLeft= retHangerMapping.IncludeWallPlateLeft!;
		HangerData.WallPlateLeftLength = retHangerMapping.WallPlateLeftLength(this,HorizontalFreeSpace)!;
		HangerData.VerticalOffset = verticalOffset;
		HangerData.VerticalOffsetWallPlateToHanger = retHangerMapping.VerticalOffsetWallPlateToHanger!;
		HangerData.HardwareItem = retHangerObject.HardwareItem!;
		HangerData.ProcessingItem = retHangerObject.ProcessingItem!;
		HangerData.GraphicItem = retHangerObject.GraphicItem!;
	HangerData.HorizontalFreeSpace = HorizontalFreeSpace!;

return HangerData;
}