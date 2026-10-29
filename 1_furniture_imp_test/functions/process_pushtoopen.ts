process_Pushtoopen(m: parent, FrontPositionY: number, FrontHeight: number, iFrontOverlay: any, FrontOpeningDirection: string, FrontType: string, FrontConstructionId: string) {

	//====================================================================
	// Initialize variables
	//====================================================================
	interface iPushToOpenInfo {
		Part?: string;
		PositionHeight?: string;
		PositionWidth?: string;
		Type?: string;
		CarcaseHardwareItem?: string;
		CarcaseProcessingItem?: string;
		CarcaseGraphic?: string;
		PartThk?: number;
		Offset?: number;
		PosThk?: number;
		MinFrontGapCarcase?: number;
	}

	let PushToOpenInfo: iPushToOpenInfo = {
		Part: undefined,
		PositionHeight: undefined,
		PositionWidth: undefined,
		Type: undefined,
		CarcaseHardwareItem: undefined,
		CarcaseProcessingItem: undefined,
		CarcaseGraphic: undefined,
		PartThk: undefined,
		Offset: undefined,
		PosThk: undefined,
		MinFrontGapCarcase: undefined
	};

	//====================================================================
	// Calculate Front Position in relation to PushToOpenLine
	//====================================================================
	let positionPushToOpenLine: string = '';
	let distance_pushToOpenLine_Top: number = 0;
	let distance_pushToOpenLine_Btm: number = 0;
	if (FrontPositionY > m.mod_PushtoopenLine) {
		positionPushToOpenLine = 'Above';
	}
	else if (FrontPositionY + FrontHeight < m.mod_PushtoopenLine) {
		positionPushToOpenLine = 'Bellow';
	}
	else {
		positionPushToOpenLine = 'AtTheLine';
		distance_pushToOpenLine_Top = FrontPositionY + FrontHeight - m.mod_PushtoopenLine;
		distance_pushToOpenLine_Btm = m.mod_PushtoopenLine - FrontPositionY;
	}

	//====================================================================
	// find Push To Open Settings
	//====================================================================

	let retPushToOpenSettings = GlobalFunc.find_PushtoopenSettings(m.mod_TypeElement, FrontType, FrontConstructionId, FrontOpeningDirection, positionPushToOpenLine, m.mod_PushtoopenPosition, m.mod_PushtoopenType).sort (x => x.Priority);

	//====================================================================
	// find Push To Open Mapping
	//====================================================================

	//---------------Cycle through all results and break when a result is valid-----------------
	for (let s of retPushToOpenSettings) {
		let position: string = '';
		let frontOverlay: number = 999999999;
		let partThk: number = 999999999;
		let part: string = '';

		if (s.Position == 'Top') {
			frontOverlay = iFrontOverlay.Top;
			partThk = iFrontOverlay.TopThk;
			position = 'Top';
			part = 'Top';
		}
		else if (s.Position == 'Bottom') {
			frontOverlay = iFrontOverlay.Bottom;
			partThk = iFrontOverlay.BottomThk;
			position = 'Bottom';
			part = 'Bottom';
		}
		else if (s.Position == 'Side' && FrontOpeningDirection == 'Left') {
			frontOverlay = iFrontOverlay.Right;
			partThk = iFrontOverlay.RightThk;
			position = 'Side';
			part = 'Right';
		}
		else if (s.Position == 'Side' && FrontOpeningDirection == 'Right') {
			frontOverlay = iFrontOverlay.Left;
			partThk = iFrontOverlay.LeftThk;
			position = 'Side';
			part = 'Left';
		}
		else if (s.Position == 'ClosestTopBottom' && distance_pushToOpenLine_Top <= distance_pushToOpenLine_Btm) {
			frontOverlay = iFrontOverlay.Top;
			partThk = iFrontOverlay.TopThk;
			position = 'Top';
			part = 'Top';
		}
		else if (s.Position == 'ClosestTopBottom' && distance_pushToOpenLine_Top > distance_pushToOpenLine_Btm) {
			frontOverlay = iFrontOverlay.Bottom;
			partThk = iFrontOverlay.BottomThk;
			position = 'Bottom';
			part = 'Bottom';
		}
	
		//---------------Find PushToOpen Mapping-----------------
		let retPushToOpenMapping = GlobalFunc.find_PushtoopenMapping(position, s.Type!, partThk, frontOverlay, 1, m.mod_PushtoopenColor);  // Weight Pending

		//---------------If PushToOpen Mapping is valid then break and return PushToOpenInfo-----------------
		if (retPushToOpenMapping != undefined) {

			let ptoCarcaseHardwareInfo = GlobalFunc.calc_HardwareObjectInfo(retPushToOpenMapping.ObjectCarcase!);

			//---------------Calculate position in width where the PushToOpen will be applied-----------------
			let positionWidth: string = "";
			if (FrontOpeningDirection == 'Left') {
				positionWidth = 'Right';
			}
			else if (FrontOpeningDirection == 'Right') {
				positionWidth = 'Left';
			}
			else
			{
				positionWidth = 'Center';
			}

			//---------------Calculate position in height where the PushToOpen will be applied-----------------
			let positionHeight: string = "";
			if (positionPushToOpenLine == 'Above'){
				positionHeight = "Bottom";
			}
			else if (positionPushToOpenLine == 'Bellow'){
				positionHeight = "Top";
			}
			else {
				positionHeight = "AtTheLine";
			}
			
			//---------------Calculate Position in thickness (in the part where the PushToOpen will be applied)-----------------
			let posThk: number = 0;
			if (s.Type == "DrilledCenter") {
				posThk = partThk / 2;
			}
			else if (s.Type == "DrilledAdjustable") {
				posThk = retPushToOpenMapping.DrillAdjustablePosThk!;
			}
			else {
				posThk = 0;
			}

			PushToOpenInfo.Part = part; // In which part should the PushToOpen be applied
			PushToOpenInfo.PositionHeight = positionHeight; // In which position in height should the PushToOpen be applied
			PushToOpenInfo.PositionWidth = positionWidth; // In which position in width should the PushToOpen be applied
			PushToOpenInfo.Type = s.Type; // Which type of PushToOpen to use (DrilledCenter / DrilledAdjustable / WithAdapterHousing)
			PushToOpenInfo.CarcaseHardwareItem = ptoCarcaseHardwareInfo.HardwareItem!; //Hardware Item of the PushToOpen
			PushToOpenInfo.CarcaseProcessingItem = ptoCarcaseHardwareInfo.ProcessingItem!; //Processing Item of the PushToOpen
			PushToOpenInfo.CarcaseGraphic = ptoCarcaseHardwareInfo.Graphics!; // Graphic data (from table GraphicLibrary) of the PushToOpen
			PushToOpenInfo.PartThk = partThk; // Part thickness (part where the PushToOpen will be applied)
			PushToOpenInfo.Offset = s.Offset! + m.mod_PushtoopenOffset; // Offset (in the part where the PushToOpen will be applied)
			PushToOpenInfo.PosThk = posThk; // Position in thickness (in the part where the PushToOpen will be applied)
			PushToOpenInfo.MinFrontGapCarcase = retPushToOpenMapping.MinFrontGapCarcase; // Minimum FrontGapCarcase allowed for the selected PushToOpen
			logDebug('part: ' + part + ' positionHeight: ' + positionHeight + ' positionWidth: ' + positionWidth);
			break;
		}
	}
return PushToOpenInfo

}
