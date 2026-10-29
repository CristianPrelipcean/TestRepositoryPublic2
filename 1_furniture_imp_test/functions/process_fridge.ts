process_Fridge(m: any, carc: any, FrontNumber: number = 0, LastFront: number = 0, OvenOnTop: boolean = false) {

	//===================================================================================
	// Interfaces
	//===================================================================================

	// Interface for the fixed shelves
	interface ShelfFixedInfo {
		PosY: number;                  // Height position of the fixed shelf
		Fingergrip: boolean;           // Fingergrip in front of the fixed shelf
		Position: string;              // Position of the fixed shelf related to the fingergrip and front gap
		FingergripType: string;        // Version of fingergrip to get the dimensions
		Backside: string;              // Attribute for "Contact" or "ThrougBw"
		Part: string;                  // Shelffixed or Rail
	}

	// Interface for the front data (backwalls and free space)
	interface FrontInfo {
		FrontCategory: string            // Identificator of sepecial fronts
		StartingPosition: number;        // Starting position of the front
		FrontHeight: number;             // Height of the front set from the UserExit
		RealFrontHeight: number;         // Calculated front height without gaps
		BackwallConstruction: string;    // Backwall construction selected on the front
		BackwallPosition: number;        // Backwall position selected on the front
		FixedshelfBottom: boolean;       // Fixed shelf selected on the front
		FingergripBottom: boolean;       // Fingergrip on bottom (true / false)
		FingergripTop: boolean;          // Fingergrip on top (true / false)
		FringergripType: string;         // Type of fingergrip (dimensions)
	}

	// Interface for the fridge data (for mf_Fridge)
	interface FridgeData {
		FridgePos: number;
		FrontHgt1: number;
		FrontHgt2: number;
		FrontPos2: number;
		GraphicId: string;
		SplitDoor: boolean
	}

	let fridgeInfo: FridgeData = {
		FridgePos: 0,
		FrontHgt1: 0,
		FrontHgt2: 0,
		FrontPos2: 0,
		GraphicId: "None",
		SplitDoor: false
	}

	//===================================================================================
	// Helper functions
	//===================================================================================

	// Function to create ShelfFixedInfo
	//-------------------------------------------------------------------------------------

	function CreateShelfFixedInfo(posY: number, backside: string = 'ThroughBw'): ShelfFixedInfo {
		return {
			PosY: posY,
			Fingergrip: false,
			Position: 'GapMiddle',
			FingergripType: 'None', 
			Backside: backside,
			Part: 'part_Shelffixed'
		};
	}

	// Function to create FrontInfo
	//-------------------------------------------------------------------------------------

	function CreateFrontInfo(startingPosition: number, frontHeightSelection: number, totalHeight: number): FrontInfo {
		return {
			FrontCategory: "Fridge",
			StartingPosition: startingPosition,
			FrontHeight: frontHeightSelection,
			RealFrontHeight: totalHeight,
			BackwallConstruction: m.mod_CarcaseBackwallConstruction,
			BackwallPosition: m.mod_BackwallPos,
			FixedshelfBottom: true,
			FingergripBottom: false,
			FingergripTop: false,		
			FringergripType: 'NoFingergrip'
		};
	}	

	//===================================================================================
	//          Main calculations
	//===================================================================================

	// Create data for the fridge
	//-------------------------------------------------------------------------

	// Variables
	let hlfGap = m.mod_FrontGapHor / 2;
	let fridgePos = 0;

	// Get the data from the tables
	const fridgeSupplier = m.mod_FridgeSupplier === 'None' || m.mod_FridgeId === 'None' ? 'None' : m.mod_FridgeSupplier;
	const fridgeId = m.mod_FridgeSupplier === 'None' || m.mod_FridgeId === 'None' ? 'None' : m.mod_FridgeId;

	const fridgeData = GlobalFunc.find_FridgeMapping(fridgeSupplier, fridgeId);
	const fridgeConstruction = GlobalFunc.find_FridgeConstruction(fridgeData.ConstructionId!);
	fridgeInfo.SplitDoor = fridgeConstruction.SplitDoor!;
	fridgeInfo.GraphicId = fridgeData.GraphicId!;

	// Try to find the niche construction for the fridge
	//-------------------------------------------------------------------------

	const fridgeNiche = GlobalFunc.find_FridgeNicheConstruction(m.mod_FrontPosStart, m.mod_FrontHeight, fridgeConstruction.DefaultHeight, fridgeConstruction.SplitDoor!, fridgeConstruction.MinHeightDoorBtm, m.mod_FridgeCarcasePositionType);
	const positionType = m.mod_FridgeCarcasePositionType === 'Automatic' ? fridgeNiche?.PositionType ?? m.mod_FridgeCarcasePositionType : m.mod_FridgeCarcasePositionType;
	const btmShelfType = fridgeNiche?.BtmShelfType ?? 'None';
	const topShelfType = fridgeNiche?.TopShelfType ?? 'None';
	const carcaseDesc = m.mod_FridgeCarcaseSpaceDescriptor === '' ? fridgeNiche?.CarcaseDescriptor ?? '' : m.mod_FridgeCarcaseSpaceDescriptor;
	const frontDesc = m.mod_FridgeFrontHeightDescriptor === '' ? fridgeNiche?.FrontDescriptor ?? '' : m.mod_FridgeFrontHeightDescriptor;
	const backwallTop = fridgeNiche?.BackwallPosTop ?? 0;

	// Calculation of the front heights and fridge position
	//-------------------------------------------------------------------------

	if (fridgeConstruction.SplitDoor) {

		// Front heights
		let frontHeights = GlobalFunc.process_Descriptor(frontDesc, m.mod_FrontHeight);
		fridgeInfo.FrontHgt1 = frontHeights[0] - hlfGap;
		fridgeInfo.FrontHgt2 = m.mod_FrontHeight - frontHeights[0] - hlfGap;
		fridgeInfo.FrontPos2 = frontHeights[0] + hlfGap;

    	// Calculate position of the fridge
		let midPos = (fridgeConstruction.MaxHeightDoorBtm - fridgeConstruction.MinHeightDoorBtm) / 2 + fridgeConstruction.MinHeightDoorBtm;
		fridgePos = frontHeights[0] - midPos;
	}
	else {

		// Front height
		fridgeInfo.FrontHgt1 = m.mod_FrontHeight;

		// Calculate position of the fridge
		if (positionType == 'Bottom') {
			fridgePos = m.mod_ShelffixedThk / 2;
		}
		else if (positionType == 'Top') {
			fridgePos = m.mod_FrontHeight - fridgeConstruction.DefaultHeight - m.mod_ShelffixedThk / 2;
		}
		else {
			let totalSpace = m.mod_FrontHeight - fridgeConstruction.DefaultHeight;
			let freeSpaces = GlobalFunc.process_Descriptor(carcaseDesc, totalSpace);
			fridgePos = freeSpaces[0];
		}
	}

	// Add the shelves
	//-------------------------------------------------------------------------

	let shelfTopBw = 'ThroughBw';
	let shelfMainBw = 'ThroughBw';
	if (m.mod_CarcaseBackwallConstruction == 'Grooved_LR'){
		shelfTopBw = 'ContactBw';
		shelfMainBw = 'ContactBw'
	}
	else{
		shelfTopBw = 'ThroughBw';
		shelfMainBw = 'ThroughBw';
	}

	//----- If the fridge is the first front -----

	if (FrontNumber == 1) {

		// First shelf if the fridge is not on the bottom
		if (positionType != 'Bottom' || !fridgeConstruction.SplitDoor){
			if (btmShelfType != 'None'){
				let shelfPosition = m.mod_FrontPosStart + fridgePos - m.mod_ShelffixedThk / 2;	
				carc.mod_ShelffixedInfoList.push(JSON.stringify(CreateShelfFixedInfo(shelfPosition, shelfMainBw)));
			}
		}

		// If the fridge is on the bottom correct the fridgePos
		else{
			fridgePos = m.mod_ShelfbtmThk + m.g.basic_ShelfbtmOffsetBtm;
		}
		
		// Second shelf if the fridge is not on the top
		if(positionType != 'Top' && topShelfType == 'Storage'){
			let shelfPosition = m.mod_FrontPosStart + fridgePos - m.mod_ShelffixedThk / 2;
			shelfPosition += fridgeConstruction.DefaultHeight + m.mod_ShelffixedThk;
			carc.mod_ShelffixedInfoList.push(JSON.stringify(CreateShelfFixedInfo(shelfPosition, shelfMainBw)));
			shelfTopBw = 'ContactBw';
		}
	}

	//----- If the fridge is not the first front -----

	else {

		// First shelf must always be added
		let shelfPosition = m.mod_FrontPosStart;
		carc.mod_ShelffixedInfoList.push(JSON.stringify(CreateShelfFixedInfo(shelfPosition, shelfMainBw)));

		// Second shelf if the fridge is not on the bottom (under the fridge)
		if(btmShelfType != 'None'){	
			shelfPosition += fridgePos - m.mod_ShelffixedThk / 2; 		
			carc.mod_ShelffixedInfoList.push(JSON.stringify(CreateShelfFixedInfo(shelfPosition, shelfMainBw)));
		}

		// Third shelf if the fridge is not on the top (over the fridge)
		if (OvenOnTop == false && topShelfType == 'Storage') {
			shelfPosition += fridgeConstruction.DefaultHeight + m.mod_ShelffixedThk;
			carc.mod_ShelffixedInfoList.push(JSON.stringify(CreateShelfFixedInfo(shelfPosition, shelfMainBw)));
			shelfTopBw = 'ContactBw';
		}

		// Third shelf if the oven is on top (over the fridge)
		else if (OvenOnTop == true && positionType != 'Top' && topShelfType == 'Storage') {
			shelfPosition += fridgeConstruction.DefaultHeight + m.mod_ShelffixedThk;
			carc.mod_ShelffixedInfoList.push(JSON.stringify(CreateShelfFixedInfo(shelfPosition, shelfMainBw)));
			shelfTopBw = 'ContactBw';
		}
	}	

	// Add the final fixed shelf if it is needed
	//-------------------------------------------------------------------------

	if (LastFront == 0 && positionType != 'Top' && OvenOnTop == false) {
		let shelfPosition = m.mod_FrontPosStart + m.mod_FrontHeightSelection - m.mod_FrontGapHor / 2;
		carc.mod_ShelffixedInfoList.push(JSON.stringify(CreateShelfFixedInfo(shelfPosition, shelfTopBw)));
	}

	// Add the frontInfo (Backwalls)
	//-------------------------------------------------------------------------

	carc.mod_FrontAreaInfoList.push(JSON.stringify(CreateFrontInfo(m.mod_FrontPosStart, m.mod_FrontHeightSelection, m.mod_FrontHeight)))

	// Output the data for the mf_Fridge
	//-------------------------------------------------------------------------
	
	fridgeInfo.FridgePos = fridgePos;
	m.mod_FridgeInfo = JSON.stringify(fridgeInfo);
}