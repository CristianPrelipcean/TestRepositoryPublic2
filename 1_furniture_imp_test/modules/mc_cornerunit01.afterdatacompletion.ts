  // Schuler Consulting
	// Create: May 2025
	// By Joao Lisboa
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of mc_Cornerunit01
	// Add the left sidepanel
	// Add the right sidepanel
	//
	//==========================================================================================================




  //==========================================================================================================
	//          Add the left sidepanel
	//==========================================================================================================

	// Define variable to store cabinet inside position relative to LeftSidePanel
	//let tmpBwLSp = 0;             
	//let tmpLSpPosBack = 0 ;       
	//let tmpLSpPosFront = 0 ;      
	//let tmpLSpPart = 'LeftSidePanel';   
	let retSpl: any;   

	// Call the process function
	let retSidepanelLeft = GlobalFunc.process_CornerunitSidepanelConstruction(this, 'Left')
	retSpl = JSON.parse(retSidepanelLeft);

	// Feedback from the process function
	//tmpBwLSp = retSpl.BwSp;                     // Manage starting position of the backwalls on the side
	//tmpLSpPosBack = retSpl.SpPosBack;           // Define back side position of the sidepanel (not in use)
	//tmpLSpPosFront = retSpl.SpPosFront;         // Frontposition of the sidepanel (free space calculation)
	//tmpLSpPart = retSpl.SpPart;                 // Name of the construction part (provided in the parts list for fittings like push to open)


	//==========================================================================================================
	//          Add the right sidepanel
	//==========================================================================================================

	// Define variable to store cabinet inside position relative to RightSidePanel
	//let tmpBwRSp = 0;
	//let tmpRSpPosBack = 0 ;
	//let tmpRSpPosFront = this.mod_CarcaseDepth;
	//let tmpRSpPart = 'RightSidePanel';
	let retSpr: any;

	// Call the process function
	let retSidepanelRight = GlobalFunc.process_CornerunitSidepanelConstruction(this, 'Right')
	retSpr = JSON.parse(retSidepanelRight);

	// Feedback from the process function
	//tmpBwRSp = retSpr.BwSp;                     // Manage starting position of the backwalls on the side
	//mpRSpPosBack = retSpr.SpPosBack;           // Define back side position of the sidepanel (not in use)
	//tmpRSpPosFront = retSpr.SpPosFront;         // Frontposition of the sidepanel (free space calculation)
	//tmpRSpPart = retSpr.SpPart;                 // Name of the construction part (provided in the parts list for fittings like push to open)







	//==========================================================================================================
	// Create the Variable CarcasePartInfo, stringify it and push it to mod_CarcasePartInfo
	//==========================================================================================================

	// Parse the data received
	let VertDividerInfo = JSON.parse(this.mod_VertDividerInfoList[0]);


	//--------------- Horizontal Parts -----------------

	// Initialize variables
	let HorizontalPartsType: string[] = ['-'];
	let HorizontalPartsPosY: number[] = [0];
	let HorizontalPartsPosZ: number[] = [0];
	let HorizontalPartsDimY: number[] = [0];
	let HorizontalPartsDimZ: number[] = [0];
	let HorizontalPartsFrontAngle: number[] = [0];

	// BottomShelf
	HorizontalPartsType.push('NoBtmShelf');
	HorizontalPartsPosY.push(0);
	HorizontalPartsPosZ.push(0);
	HorizontalPartsDimY.push(0);
	HorizontalPartsDimZ.push(0);
	HorizontalPartsFrontAngle.push(90);
	
	// FixedShelves
	/*
	for (let i = 2; i < this.mod_ShelffixedTypeList.length; i++)
	{
		HorizontalPartsType.push(this.mod_ShelffixedTypeList[i]);
		HorizontalPartsPosY.push(this.mod_ShelffixedPosList[i]);
		HorizontalPartsPosZ.push(tmpShelffixedPosZ[i - 2]);
		HorizontalPartsDimY.push(this.mod_ShelffixedThk);
		HorizontalPartsDimZ.push(tmpShelffixedDimZ[i - 2]);
		HorizontalPartsFrontAngle.push(90);
	}
	*/

	for (let i = 1; i <= this.mod_FrontAreaInfoList.length - 1; i++) {
		let frontAreaInfo = JSON.parse(this.mod_FrontAreaInfoList[i]);
		HorizontalPartsType.push(frontAreaInfo.FixedshelfBottom ? "FixedShelf" : "NoFixedShelf");
		HorizontalPartsPosY.push(frontAreaInfo.StartingPosition);
		HorizontalPartsPosZ.push(0);
		HorizontalPartsDimY.push(0);
		HorizontalPartsDimZ.push(0);
		HorizontalPartsFrontAngle.push(90);
	}

	//TopShelf (FrontPart)
	HorizontalPartsType.push('NoShelfTop');
	HorizontalPartsPosY.push(0);
	HorizontalPartsPosZ.push(0);
	HorizontalPartsDimY.push(0);
	HorizontalPartsDimZ.push(0);
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
		VerticalPartsPosX[i].push(retSpl.WidthPos);
		VerticalPartsPosZ[i].push(retSpl.DepthPos);
		VerticalPartsDimX[i].push(retSpl.Width);
		VerticalPartsDimZ[i].push(retSpl.Depth);
		VerticalPartsFrontAngle[i].push(90);

		/*
		// Vertical Dividers
		if (VertDividerInfo.Type[i] != 'None' && VertDividerInfo.Type[i] != 'NoVertDivider' && !VertDividerInfo.Type[i].includes('DustStrip')) {
			VerticalPartsType[i].push(VertDividerInfo.Type[i]);
			VerticalPartsPosX[i].push(vertDividerData.DividerWidthStartPosPerFront[i]);
			VerticalPartsPosZ[i].push(vertDividerData.DividerDepthStartPosPerFront[i]);
			VerticalPartsDimX[i].push(vertDividerData.DividerWidthPerFront[i]);
			VerticalPartsDimZ[i].push(vertDividerData.DividerDepthPerFront[i]);
			VerticalPartsFrontAngle[i].push(90);
		}
		*/

		//Right Side
		VerticalPartsType[i].push('RightSidePanel');
		VerticalPartsPosX[i].push(retSpr.WidthPos);
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





	