	
	// Schuler Consulting
	// Create: Okt 2022
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of mc_Storageunit01
	// Add the left sidepanel
	// Add the right sidepanel
	// Add the bottom shelf
	// Add the top shelf
	// Add the backwall
	// Freespace calculation
	// Create the part information
	// Add the hangers
	//
	// Revisions:
	// By Ludwig Weber
	// Complete new script
	// Put all the logics in functions
	// March 2025
	//
	//==========================================================================================================

	//==========================================================================================================
	// Interface
	//==========================================================================================================

	interface FrontInfo {
		StartingPosition: number;        // Starting position of the front
		FrontHeight: number;             // Height of the front set from the UserExit
		RealFrontHeight: number;         // Calculated front height without gaps
		BackwallConstruction: string;    // Backwall construction selected on the front
		BackwallPosition: number;        // Backwall position selected on the front
		FixedshelfBottom: boolean;       // Fixed shelf selected on the front
	}

	//==========================================================================================================
	// Pre-calculations for the backwall
	//==========================================================================================================
	let FirstBackWallPosition = this.mod_BackwallPos;
	let FirstBackWallConstruction = this.mod_CarcaseBackwallConstruction;
	let LastBackWallPosition = this.mod_BackwallPos;
	let LastBackWallConstruction = this.mod_CarcaseBackwallConstruction;

	let totalFrontAreaInfoList = this.mod_FrontAreaInfoList.length;
	let j=0;
	this.mod_FrontAreaInfoList.forEach(elem => {
		let front: FrontInfo = JSON.parse(elem);
		j++
		
		FirstBackWallPosition = j == 1 ? front.BackwallPosition : FirstBackWallPosition;
		FirstBackWallConstruction = j == 1 ? front.BackwallConstruction : FirstBackWallConstruction;

		if (j == totalFrontAreaInfoList) {
			LastBackWallPosition =  front.BackwallPosition;
			LastBackWallConstruction = front.BackwallConstruction;
			if (this.mod_SlopeAngle != 0) {

				// Read Settings table
				let slopedCeilingSettings = GlobalFunc.find_SlopedCeilingSettings(this.mod_SlopedCeilingConstruction!);

				LastBackWallPosition = slopedCeilingSettings.BackwallPos!;
				LastBackWallPosition != front.BackwallPosition ? logInfo('Automatic adjustment: Last backwall position is now ' + LastBackWallPosition + ' instead of ' + front.BackwallPosition) : '';
				front.BackwallPosition = slopedCeilingSettings.BackwallPos!;

				LastBackWallConstruction = slopedCeilingSettings.CarcaseBackwallConstruction!;
				LastBackWallConstruction != front.BackwallConstruction ? logInfo('Automatic adjustment: Last backwall construction is now ' + LastBackWallConstruction + ' instead of ' + front.BackwallConstruction) : '';
				front.BackwallConstruction = slopedCeilingSettings.CarcaseBackwallConstruction!;
				this.mod_FrontAreaInfoList[j - 1] = (JSON.stringify(front));

				// If there's only one backwall then the first and last backwall are the same, so we must update the first backwall with the automatic adjustment
				if (totalFrontAreaInfoList == 1) { 
					FirstBackWallPosition = LastBackWallPosition;
					FirstBackWallConstruction = LastBackWallConstruction;
				}
			}
		}
		
	});

	//==========================================================================================================
	//          Add the left sidepanel
	//==========================================================================================================

	// Define variable to store cabinet inside position relative to LeftSidePanel
	let tmpBwLSp = 0;             
	let tmpLSpPosBack = 0 ;       
	let tmpLSpPosFront = 0 ;      
	let tmpLSpPart = 'LeftSidePanel';   
	let retSpl: any;   

	// Call the process function
	let retSidepanelLeft = GlobalFunc.process_StorageunitSidepanelConstruction(this, 'Left', FirstBackWallConstruction, FirstBackWallPosition)
	retSpl = JSON.parse(retSidepanelLeft);

	// Feedback from the process function
	tmpBwLSp = retSpl.BwSp;                     // Manage starting position of the backwalls on the side
	tmpLSpPosBack = retSpl.SpPosBack;           // Define back side position of the sidepanel (not in use)
	tmpLSpPosFront = retSpl.SpPosFront;         // Frontposition of the sidepanel (free space calculation)
	tmpLSpPart = retSpl.SpPart;                 // Name of the construction part (provided in the parts list for fittings like push to open)

	//==========================================================================================================
	//          Add the right sidepanel
	//==========================================================================================================

	// Define variable to store cabinet inside position relative to RightSidePanel
	let tmpBwRSp = 0;
	let tmpRSpPosBack = 0 ;
	let tmpRSpPosFront = this.mod_CarcaseDepth;
	let tmpRSpPart = 'RightSidePanel';
	let retSpr: any;

	// Call the process function
	let retSidepanelRight = GlobalFunc.process_StorageunitSidepanelConstruction(this, 'Right', FirstBackWallConstruction, FirstBackWallPosition)
	retSpr = JSON.parse(retSidepanelRight);

	// Feedback from the process function
	tmpBwRSp = retSpr.BwSp;                     // Manage starting position of the backwalls on the side
	tmpRSpPosBack = retSpr.SpPosBack;           // Define back side position of the sidepanel (not in use)
	tmpRSpPosFront = retSpr.SpPosFront;         // Frontposition of the sidepanel (free space calculation)
	tmpRSpPart = retSpr.SpPart;                 // Name of the construction part (provided in the parts list for fittings like push to open)

	// Calculate the full horizontal freespace
	let freeSpaceWidth = tmpBwRSp - tmpBwLSp;
	let freeSpaceWidthPos = tmpBwLSp;

	//==========================================================================================================
	//          Add the bottom shelf
	//==========================================================================================================

	// Call the process function
	let retBtmShelf = GlobalFunc.process_StorageunitShelfbtmConstruction(this, FirstBackWallConstruction, FirstBackWallPosition);
	let retBtm = JSON.parse(retBtmShelf);

	// Feedback from the process function
	let tmpBwBtm = retBtm.BwBtm;               // Manage starting position of the first backwall
	let tmpBtmPosBack = retBtm.BtmPosBack;     // Define back side position of the bottom shelf (fixed shelf starting position)
	let tmpBtmPosFront = retBtm.BtmPosFront;   // Frontposition of the bottom shelf (free space calculation)
	let tmpBtmPart = retBtm.BtmPart;           // Name of the construction part (provided in the parts list for fittings like push to open)   

	//==========================================================================================================
	//          Add the top shelf
	//==========================================================================================================

	// Call the process function
	let retTopShelf = GlobalFunc.process_StorageunitShelftopConstruction(this, LastBackWallConstruction, LastBackWallPosition);
	let retTop = JSON.parse(retTopShelf);

	// Feedback from the process function
	let tmpBwTop = retTop.BwTop;                // Manage backwall height
	let tmpTopPosBack = retTop.TopPosBack;      // Define back side position of the top shelf (fixed shelf starting position)
	let tmpTopPosFront = retTop.TopPosFront;    // Frontposition of the top shelf (free space calculation)
	let tmpTopPart = retTop.TopPart;            // Name of the construction part (provided in the parts list for fittings like push to open)
	let tmpSpaceTop = retTop.SpaceTop;          // Define the end position of the freespace in height

	// Calculate the full vertical freespace
	let freeSpaceHeight = tmpBwTop - tmpBwBtm;
	let freeSpaceHeightPos = tmpBwBtm;

	//==========================================================================================================
	//          Add the fixed shelves
	//==========================================================================================================

	// Call the process function
	let retShelfFixed = GlobalFunc.process_StorageunitShelffixedConstruction(this);
	let retFixedShelves = JSON.parse(retShelfFixed);

	//==========================================================================================================
	//          Add the backwalls
	//==========================================================================================================

	// Call the process function
	let retBackwall = GlobalFunc.process_StorageunitBackwallConstruction(this, tmpLSpPart, tmpRSpPart, tmpBtmPart, tmpTopPart, freeSpaceHeight, freeSpaceWidth, freeSpaceWidthPos, freeSpaceHeightPos, retShelfFixed);
	let retBackwalls = JSON.parse(retBackwall);

	//==========================================================================================================
	//          Calculate free space
	//==========================================================================================================

	let retFreeSpace = GlobalFunc.process_StorageunitFreeSpaceCalculations(this, tmpBwLSp, tmpBwRSp, tmpBwBtm, tmpSpaceTop, retShelfFixed, retBackwall)
	let freeSpaces = JSON.parse(retFreeSpace);

	// Feedback from the process function
	let FullWidthFreeSpace = freeSpaces.FullWidthFreeSpace;
	let FullWidthStartPos = freeSpaces.FullWidthStartPos;
	let FullHeightFreeSpace = freeSpaces.FullHeightFreeSpace;
	let FullHeightStartPos = freeSpaces.FullHeightStartPos;
	let FullDepthFreeSpace = freeSpaces.FullDepthFreeSpace;
	let FullDepthStartPos = freeSpaces.FullDepthStartPos;
	let PosTopShelf = freeSpaces.PosTopShelf;

	let FreeSpaceDepth = freeSpaces.FreeSpaceDepth;
	let FreeSpaceDepthStartPos = freeSpaces.FreeSpaceDepthStartPos;
	let FreeSpaceHeight = freeSpaces.FreeSpaceHeight;
	let FreeSpaceHeightStartPos = freeSpaces.FreeSpaceHeightStartPos;
	let FreeSpaceWidth = freeSpaces.FreeSpaceWidth;
	let FreeSpaceWidthStartPos = freeSpaces.FreeSpaceWidthStartPos;

	//==========================================================================================================
	//          Add the vertical divider
	//==========================================================================================================

	// Parse the data received
	let VertDividerInfo = JSON.parse(this.mod_VertDividerInfoList[0]);

	// Call the process function
	let retVertDivider = GlobalFunc.process_StorageunitVertdividerConstruction(this, FreeSpaceWidth, FreeSpaceHeight, FreeSpaceDepth, FreeSpaceWidthStartPos, FreeSpaceHeightStartPos, FreeSpaceDepthStartPos);
	let vertDividerData = JSON.parse(retVertDivider);

	//==========================================================================================================
	// Create the Variable CarcaseSpaceDimension, stringify it and push it to mod_CarcaseSpaceDimension
	//==========================================================================================================

	let CarcaseSpaceDimension: any = {
		FullWidthFreeSpace: FullWidthFreeSpace,
		FullHeightFreeSpace: FullHeightFreeSpace,
		FullDepthFreeSpace: FullDepthFreeSpace,
		FullWidthStartPos: FullWidthStartPos,
		FullHeightStartPos: FullHeightStartPos,
		FullDepthStartPos: FullDepthStartPos,
		PosTopShelf: PosTopShelf,
		WidthFreeSpace: FreeSpaceWidth,
		HeightFreeSpace: FreeSpaceHeight,
		DepthFreeSpace: FreeSpaceDepth,
		WidthFreeStartPos: FreeSpaceWidthStartPos,
		HeightFreeStartPos: FreeSpaceHeightStartPos,
		DepthFreeStartPos: FreeSpaceDepthStartPos
	};

	let strJson = JSON.stringify(CarcaseSpaceDimension);
	this.mod_CarcaseSpaceDimension.push(strJson);

	//==========================================================================================================
	// Create the Variable CarcasePartInfo, stringify it and push it to mod_CarcasePartInfo
	//==========================================================================================================

	//--------------- Horizontal Parts -----------------

	// Initialize variables
	let HorizontalPartsType: string[] = ['-'];
	let HorizontalPartsPosY: number[] = [0];
	let HorizontalPartsPosZ: number[] = [0];
	let HorizontalPartsDimY: number[] = [0];
	let HorizontalPartsDimZ: number[] = [0];
	let HorizontalPartsFrontAngle: number[] = [0];

	// BottomShelf
	HorizontalPartsType.push(this.mod_CarcaseShelfbtmConstruction);
	HorizontalPartsPosY.push(retBtm.HeightPos);
	HorizontalPartsPosZ.push(retBtm.DepthPos);
	HorizontalPartsDimY.push(retBtm.Height);
	HorizontalPartsDimZ.push(retBtm.Depth);
	HorizontalPartsFrontAngle.push(90);
	
	// FixedShelves
	for (let i = 1; i <= this.mod_FrontAreaInfoList.length - 1; i++) {
		let frontAreaInfo = JSON.parse(this.mod_FrontAreaInfoList[i]);
		HorizontalPartsType.push(frontAreaInfo.FixedshelfBottom ? "FixedShelf" : "NoFixedShelf");
		HorizontalPartsPosZ.push(FullDepthStartPos);
		HorizontalPartsDimY.push(frontAreaInfo.FixedshelfBottom ? this.mod_ShelffixedThk : 0);
		HorizontalPartsDimZ.push(FullDepthFreeSpace);
		HorizontalPartsFrontAngle.push(90);

		// Calculation for the pushtoopen -> fixedshelf height position
		const tolerance = 30;
		const approxPos = frontAreaInfo.StartingPosition;
		const matchingShelf = retFixedShelves.find((shelf: { HeightPos: number }) => Math.abs(shelf.HeightPos - approxPos) <= tolerance);
		const finalPos = matchingShelf ? matchingShelf.HeightPos : 0;
		HorizontalPartsPosY.push(finalPos);
	}

	//TopShelf (FrontPart)
	HorizontalPartsType.push(tmpTopPart);
	HorizontalPartsPosY.push(retTop.HeightPos);
	HorizontalPartsPosZ.push(retTop.DepthPos);
	HorizontalPartsDimY.push(retTop.Height);
	HorizontalPartsDimZ.push(retTop.Depth);
	HorizontalPartsFrontAngle.push(90);


	//--------------- Vertical Parts -----------------

	// Initialize variables
	let VerticalPartsType: string[][] = [];
	let VerticalPartsPosX: number[][] = [];
	let VerticalPartsPosZ: number[][] = [];
	let VerticalPartsDimX: number[][] = [];
	let VerticalPartsDimZ: number[][] = [];
	let VerticalPartsFrontAngle: number[][] = [];

	for (let i = 1; i < VertDividerInfo.Type.length; i++) {

		// Create the arrays for this iteration
		VerticalPartsType[i] = VerticalPartsType[i] || [];
		VerticalPartsPosX[i] = VerticalPartsPosX[i] || [];
		VerticalPartsPosZ[i] = VerticalPartsPosZ[i] || [];
		VerticalPartsDimX[i] = VerticalPartsDimX[i] || [];
		VerticalPartsDimZ[i] = VerticalPartsDimZ[i] || [];
		VerticalPartsFrontAngle[i] = VerticalPartsFrontAngle[i] || [];
		
		//Left Side
		VerticalPartsType[i].push('LeftSidePanel');
		VerticalPartsPosX[i].push(retSpl.WidthPos + this.mod_CarcaseMovement);
		VerticalPartsPosZ[i].push(retSpl.DepthPos);
		VerticalPartsDimX[i].push(retSpl.Width);
		VerticalPartsDimZ[i].push(retSpl.Depth);
		VerticalPartsFrontAngle[i].push(90);

		// Vertical Dividers
		if (VertDividerInfo.Type[i] != 'None' && VertDividerInfo.Type[i] != 'NoVertDivider' && !VertDividerInfo.Type[i].includes('DustStrip')) {
			VerticalPartsType[i].push(VertDividerInfo.Type[i]);
			VerticalPartsPosX[i].push(vertDividerData.DividerWidthStartPosPerFront[i]);
			VerticalPartsPosZ[i].push(vertDividerData.DividerDepthStartPosPerFront[i]);
			VerticalPartsDimX[i].push(vertDividerData.DividerWidthPerFront[i]);
			VerticalPartsDimZ[i].push(vertDividerData.DividerDepthPerFront[i]);
			VerticalPartsFrontAngle[i].push(90);
		}

		//Right Side
		VerticalPartsType[i].push('RightSidePanel');
		VerticalPartsPosX[i].push(retSpr.WidthPos + this.mod_CarcaseMovement);
		VerticalPartsPosZ[i].push(retSpr.DepthPos);
		VerticalPartsDimX[i].push(retSpr.Width);
		VerticalPartsDimZ[i].push(retSpr.Depth);
		VerticalPartsFrontAngle[i].push(90);
	}

	// Create CarcasePartInfo
	let CarcasePartInfo: any = {
		HorizontalPartsType: HorizontalPartsType,
		HorizontalPartsPosY: HorizontalPartsPosY,
		HorizontalPartsPosZ: HorizontalPartsPosZ,
		HorizontalPartsDimY: HorizontalPartsDimY,
		HorizontalPartsDimZ: HorizontalPartsDimZ,
		HorizontalPartsFrontAngle: HorizontalPartsFrontAngle,
		VerticalPartsType: VerticalPartsType,
		VerticalPartsPosX: VerticalPartsPosX,
		VerticalPartsPosZ: VerticalPartsPosZ,
		VerticalPartsDimX: VerticalPartsDimX,
		VerticalPartsDimZ: VerticalPartsDimZ,
		VerticalPartsFrontAngle: VerticalPartsFrontAngle		
	};

	let CarcasePartInfoJson = JSON.stringify(CarcasePartInfo);
	this.mod_CarcasePartInfo.push(CarcasePartInfoJson);

	//==========================================================================================================
	//          Add the lights
	//==========================================================================================================

	GlobalFunc.process_StorageunitLightConstruction(this, retTop, retBtm);

	//==========================================================================================================
	//          Add the hangers
	//==========================================================================================================

	if (this.mod_HangerType != 'NoHanger') {

		// Get data from last backwall
		let lastBackwall = retBackwalls[retBackwalls.length - 1];
		let lastSpaceBehindBw = lastBackwall.DepthPos;
		let lastDepthPosBw = lastBackwall.Depth + lastSpaceBehindBw;

		// Call the process function
		GlobalFunc.process_Hanger(this, lastDepthPosBw, lastSpaceBehindBw, tmpBwTop, retFreeSpace);
	}
