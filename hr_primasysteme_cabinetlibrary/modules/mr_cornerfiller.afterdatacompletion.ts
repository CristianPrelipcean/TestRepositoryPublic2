  // Schuler Consulting
	// Create: May 2025
	// By Joao Lisboa
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of adc_mr_CornerFiller
  // Add the carcase to the root-module
	//
	// Add the PlinthArea to the root-module
	// Cycle through the childs and manage the front elements
	// Cycle through the childs and search for fingergrip
	// Cycle through the childs get backwall information
	//
	// Revisions:
	//===================================================

	//===================================================
	//          Calculate Carcase Dimensions based in CornerunitDimensionLogic
	//===================================================

	let widthLeft: number = 0;
	let widthRight: number = 0;
	let depthRight: number = 0;
	let depthLeft: number = 0;
	let totalDimLeft: number = 0;
	let totalDimRight: number = 0;
	if (this.mod_CornerunitDimensionLogic == 'BasedInFrontDimension') {
		widthLeft = this.mod_WidthLeft;
		widthRight = this.mod_WidthRight;
		depthRight = this.mod_DepthRight;
		depthLeft = this.mod_DepthLeft; 
		totalDimLeft = depthRight + widthLeft;
		totalDimRight = depthLeft + widthRight; 
	}
	else if (this.mod_CornerunitDimensionLogic == 'BasedInWallDistance') {
		totalDimLeft = this.mod_TotalDimLeft;
		totalDimRight = this.mod_TotalDimRight;
		depthRight = this.mod_DepthRight;
		depthLeft = this.mod_DepthLeft;
		widthLeft = totalDimLeft - depthRight;
		widthRight = totalDimRight - depthLeft;
	}

	//===================================================
	// Calculate the toe kick position
	//===================================================

	let retInfo = GlobalFunc.process_PlinthAreaLegs(this);

	// Provide the position of the legs for creation of the contour
	const legPositions = {
		LineLeft: retInfo.LineLeft,
		LineRight: retInfo.LineRight,
		LineFront: retInfo.LineFront,
		LineBack: retInfo.LineBack
	};
	this.mod_PlinthAreaPositionInfo.push(JSON.stringify(legPositions));

	//===================================================
	//          Add the carcase to the root-module
	//===================================================
	try { 
		// Add the module
		//----------------------------------------------------
		
		let carc = this.addOD_M_mc_Cornerunit01(0);

		//Set values for attributes not used at the moment
		carc.mod_FingergripPos1 = 0;
		carc.mod_FingergripPos2 = 0;
		carc.mod_FingergripPos3 = 0;
		carc.mod_FingergripPos4 = 0;
		carc.mod_FingergripPos5 = 0;
		carc.mod_FingergripQtyMiddle = 0;
		carc.mod_FingergripTop = false;
		carc.mod_SlopeAngle = 0;
		carc.mod_SlopedCeilingConstruction = 'Construction01';
		carc.mod_SlopedCeilingDimensionLogic = 'FollowWallMaxHeight';
		carc.mod_BackHeight = 0;
		carc.mod_TopDepth = 0;

		// Set attributes of the carcase
		carc.mod_CarcaseId = 'Carcase_01';

		// Adjust dimensions of the carcase
		carc.mod_DepthRight = this.mod_FillerDepthRight;
		carc.mod_DepthLeft = this.mod_FillerDepthLeft;
		carc.mod_TotalDimLeft = this.mod_FillerDepthRight + widthLeft;
		carc.mod_TotalDimRight = this.mod_FillerDepthLeft + widthRight;
		carc.mod_WidthLeft = widthLeft;
		carc.mod_WidthRight = widthRight;

		// Calculate movement of carcase	
		let widthAdjustment = totalDimRight - widthRight - this.mod_FillerDepthLeft;
		let depthAdjustment = totalDimLeft - widthLeft - this.mod_FillerDepthRight;

		// setOrigin
		let StartPosCabinet = this.mod_PlinthAreaDesign_matrix.PlinthAreaType !== 'None' ? this.mod_PlinthAreaHeight! : 0;
		carc.setOrigin(widthAdjustment, StartPosCabinet, depthAdjustment);



		//===================================================
		//          Initialize variables for Dividers
		//===================================================
		let VertDividerType: string[] = [];
		let VertDividerFrontWidth: number[] = [];
		let VertDividerFrontName: string[] = [];
		let GlobalCount: number = 0;

	
		//===================================================
		//          Add the Fronts to the root-module
		//===================================================
		// Define variables
		//----------------------------------------------------
		let gapBtm = 0;
		let gapTop = 0;
		let height = 0;
		let frontPosStart = 0;

		// Call the funtion of the descriptor
		let fillerFrontHeights = GlobalFunc.process_Descriptor(this.mod_FrontDescriptor, this.mod_Height);
		// Add last position to the array
		fillerFrontHeights.push(this.mod_Height);

		// Insert one front for each result of the descriptor
		fillerFrontHeights.forEach((pos, index) => {

			// Increase the global count for each front in height
			GlobalCount++

			// Calculate the top gap for the current front based on the position of the front
			gapTop = index == fillerFrontHeights.length - 1 ? this.mod_FrontGapHorTop : this.mod_FrontGapHor / 2;
			// Calculate the btm gap for the current front based on the position of the front
			gapBtm = index == 0 ? this.mod_FrontPosStart : this.mod_FrontGapHor / 2;

			// Calculate the front height
			height = pos - frontPosStart - gapBtm - gapTop;
			const heightLeft = height;
			const heightRight = height;

			// Run the process to Insert the module and set attributes
			GlobalFunc.process_CornerFillerFrontpanelConstruction(this, 'mr_CornerFiller', this.mod_CornerunitStraightFillerConstruction, 'Left', widthLeft, widthRight, heightLeft, heightRight, totalDimRight, depthRight, frontPosStart + StartPosCabinet, 0, index + 1);

			// Set frontPosStart for the next front as the top position of current front
			frontPosStart = pos;

			//===================================================
			// Manage the Vert Dividers
			//===================================================
			VertDividerType[GlobalCount] = 'NoVertDivider';
			VertDividerFrontWidth[GlobalCount] = 0;
			VertDividerFrontName[GlobalCount] = 'mc_CornerFillerFront01';

			//===================================================
			// Calculate FrontInfo and provide it to the carcase
			//===================================================

			// Interface to provide the data for the carcase
			//-------------------------------------------------------------------------------------
			interface FrontInfo {
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

			// Create the object
			let frontInfo: FrontInfo = {
				//StartingPosition: p.mod_FrontPosStart!, //UNCOMMENT
				StartingPosition: 0,
				//FrontHeight: p.mod_FrontHeightSelection!, //UNCOMMENT
				FrontHeight: 0,
				//RealFrontHeight: p.mod_FrontHeight!, //UNCOMMENT
				RealFrontHeight: 0,
				//BackwallConstruction: p.mod_CarcaseBackwallConstruction!, //UNCOMMENT
				BackwallConstruction: 'NoBackwall',
				//BackwallPosition: p.mod_BackwallPos!, // UNCOMMENT
				BackwallPosition: 0,
				//FixedshelfBottom: p.mod_ShelffixedBtm!, //UNCOMMENT
				FixedshelfBottom: false,
				FingergripBottom: false,
				//FingergripTop: !!p.mod_FingergripTop, //UNCOMMENT
				FingergripTop: !! false,
				FringergripType: this.mod_FingergripType
			}

			// Stringify the object and push it to the list attribute
			carc.mod_FrontAreaInfoList.push(JSON.stringify(frontInfo));

		});

		//================================================================================
		//          Stringify the Divider Information and pass it to the carcase
		//================================================================================

		let VertDividerInfo: any = {
			Type: VertDividerType,
			FrontWidth: VertDividerFrontWidth,
			FrontName: VertDividerFrontName,
			PosX: undefined,
			DimX: undefined,
			FreeSpaceWidth: undefined,
			FreeSpaceWidthStartPos: undefined
		};

		let strJson = JSON.stringify(VertDividerInfo);
		carc.mod_VertDividerInfoList.push(strJson);


		//===================================================
		// Seal carcase and get attribute CarcasePartInfo
		//===================================================
		let sealedCarc = carc.seal();
		let sealedCarc_CarcasePartInfo = JSON.parse(sealedCarc.mod_CarcasePartInfo[0]);


		//===================================================
		// Pass attribute CarcasePartInfo to each front
		//===================================================	
		let i = 0;

		// Insert one front for each result of the descriptor
		fillerFrontHeights.forEach((pos, index) => {
			i++;
			// Get the information regarding the HorizontalParts in an Array
			let HorizontalPartsType: string[] = [];
			HorizontalPartsType.push(sealedCarc_CarcasePartInfo.HorizontalPartsType[i]);
			let HorizontalPartsPosY: number[] = [];
			HorizontalPartsPosY.push(sealedCarc_CarcasePartInfo.HorizontalPartsPosY[i]);
			let HorizontalPartsPosZ: number[] = [];
			HorizontalPartsPosZ.push(sealedCarc_CarcasePartInfo.HorizontalPartsPosZ[i]);
			let HorizontalPartsDimY: number[] = [];
			HorizontalPartsDimY.push(sealedCarc_CarcasePartInfo.HorizontalPartsDimY[i]);
			let HorizontalPartsDimZ: number[] = [];
			HorizontalPartsDimZ.push(sealedCarc_CarcasePartInfo.HorizontalPartsDimZ[i]);
			let HorizontalPartsFrontAngle: number[] = [];
			HorizontalPartsFrontAngle.push(sealedCarc_CarcasePartInfo.HorizontalPartsFrontAngle[i]);

			if (this.mod_CarcaseShelftopConstruction != 'RailTopBackHorizontal' && this.mod_CarcaseShelftopConstruction != 'RailTopBackVertical') { // Only push the top part if it exists
				HorizontalPartsType.push(sealedCarc_CarcasePartInfo.HorizontalPartsType[i + 1]);
				HorizontalPartsPosY.push(sealedCarc_CarcasePartInfo.HorizontalPartsPosY[i + 1]);
				HorizontalPartsPosZ.push(sealedCarc_CarcasePartInfo.HorizontalPartsPosZ[i + 1]);
				HorizontalPartsDimY.push(sealedCarc_CarcasePartInfo.HorizontalPartsDimY[i + 1]);
				HorizontalPartsDimZ.push(sealedCarc_CarcasePartInfo.HorizontalPartsDimZ[i + 1]);
				HorizontalPartsFrontAngle.push(sealedCarc_CarcasePartInfo.HorizontalPartsFrontAngle[i + 1]);
			}

			// Adjust vertical part positions because carcase has been moved before so it's calculation is not absolute positions
			let verticalPartPosX: number[] = sealedCarc_CarcasePartInfo.VerticalPartsPosX[i].map((x: number) => x + widthAdjustment);
			let verticalPartPosZ: number[] = sealedCarc_CarcasePartInfo.VerticalPartsPosZ[i].map((z: number) => z + depthAdjustment);

			// Set the attribute CarcasePartInfo regarding each front
			let CarcasePartInfo: any = {
				HorizontalPartsType: HorizontalPartsType,
				HorizontalPartsPosY: HorizontalPartsPosY,
				HorizontalPartsPosZ: HorizontalPartsPosZ,
				HorizontalPartsDimY: HorizontalPartsDimY,
				HorizontalPartsDimZ: HorizontalPartsDimZ,
				HorizontalPartsFrontAngle: HorizontalPartsFrontAngle,
				VerticalPartsType: sealedCarc_CarcasePartInfo.VerticalPartsType[i],
				VerticalPartsPosX: verticalPartPosX,
				VerticalPartsPosZ: verticalPartPosZ,
				VerticalPartsDimX: sealedCarc_CarcasePartInfo.VerticalPartsDimX[i],
				VerticalPartsDimZ: sealedCarc_CarcasePartInfo.VerticalPartsDimZ[i],
				VerticalPartsFrontAngle: sealedCarc_CarcasePartInfo.VerticalPartsFrontAngle[i]
			};

			this.m.forEach(p => {
				if (p instanceof OD_M_mc_CornerFillerFront01) {
				let CarcasePartInfoJson = JSON.stringify(CarcasePartInfo);
				p.mod_CarcasePartInfo.push(CarcasePartInfoJson);
				}
			});

			
			
		
		});


		//===================================================
		//          Create vector / docking
		//===================================================

		let TopEndCabinet = StartPosCabinet + this.mod_Height;

		// Left side
		this.addDockingInfo(Dock.LeftBottom, new Vector3(0, 0, totalDimLeft), new Vector3(depthLeft, 0, totalDimLeft));
		this.addDockingInfo(Dock.LeftTop, new Vector3(0, TopEndCabinet, totalDimLeft), new Vector3(depthLeft, TopEndCabinet, totalDimLeft));

		// Right side
		this.addDockingInfo(Dock.RightBottom, new Vector3(totalDimRight, 0, 0), new Vector3(totalDimRight, 0, depthRight));
		this.addDockingInfo(Dock.RightTop, new Vector3(totalDimRight, TopEndCabinet, 0), new Vector3(totalDimRight, TopEndCabinet, depthRight));

		// Left backwall side
		this.addDockingInfo(Dock.LeftBackBottom, new Vector3(0, 0, 0), new Vector3(0, 0, totalDimLeft));
		this.addDockingInfo(Dock.LeftBackTop, new Vector3(0, TopEndCabinet, 0), new Vector3(0, TopEndCabinet, totalDimLeft));

		// Right backwall side 
		this.addDockingInfo(Dock.RightBackBottom, new Vector3(0, 0, 0), new Vector3(totalDimRight, 0, 0));
		this.addDockingInfo(Dock.RightBackTop, new Vector3(0, TopEndCabinet, 0), new Vector3(totalDimRight, TopEndCabinet, 0));

		//===================================================
		//          Call the UserExit of this module
		//===================================================
		
		GlobalFunc.ue_CornerFiller(this);
	}
	catch (error: any) { // Failed to insert the Carcase
		logError('mr_CornerFiller - AfterDatacompletion: ' + error.message);
	}