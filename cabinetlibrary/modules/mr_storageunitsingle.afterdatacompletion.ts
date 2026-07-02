
	// Schuler Consulting
	// Create: Okt 2022
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of mr_StorageUnit_Single
	// Add the carcase to the root-module
	// Add the PlinthArea to the root-module
	// Cycle through the childs and manage the front elements
	// Cycle through the childs and search for fingergrip
	// Cycle through the childs get backwall information
	//
	// Revisions:
	// July 2024
	// by Henning Wiesbrock
	// Add mf_RackArea and function process_RackAreaOversizeCarcase
	//
	// April 2025
	// By Ludwig Weber
	// Add the endless cabinets
	// Add the automatism for the sloped ceiling
	// Add oven, hob and fridge management
	//===================================================


	//===================================================
	//   Add function process_RackAreaOversizeCarcase
	//===================================================

	let RackAreaOversize = GlobalFunc.process_RackAreaOversizeCarcase(this);

	//===================================================
	//          Add the carcase to the root-module
	//===================================================

	// Add the module
	//----------------------------------------------------

	let carc = this.addOD_M_mc_Storageunit01(0);
	const carcaseId = 'Carcase_01';

	// StartPosition of Cabinet
	const StartPosCabinet = this.mod_PlacementLevels === 'OnFloor' ? this.mod_PlinthAreaHeight : 0;


	//======================================================================
	// Dimensioning variables (room and sloped ceiling)
	//======================================================================

	let angle = 0;
	let wallAngle = 0;
	let backHeight = 0;
	let wallBackheight = 0;
	let height = this.mod_CarcaseHeight;
	let topDepth = this.mod_TopDepth;

	//======================================================================
	// Read and validate module context information
	//======================================================================

	const moduleContextInfo = JSON.parse(this.mod_ModuleContextInformationList[0] ?? "{}");
	const hasModuleContextInfo = moduleContextInfo.DataComplete === true;
	if (!hasModuleContextInfo) {
		logInfo("Module context information returned incomplete data.");
	}

	//======================================================================
	// Apply sloped ceiling information from module context
	//======================================================================

	if (hasModuleContextInfo && moduleContextInfo.SlopedCeiling && moduleContextInfo.SlopedCeilingDirection === "toBack"
	) {
		wallAngle = moduleContextInfo.SlopedCeilingAngle;
		wallBackheight = moduleContextInfo.SlopedCeilingLevel;
	}

	//======================================================================
	// Determine automatic filler situation
	//======================================================================

	const maxWallDistance = 290;
	const wallDistanceLeft = hasModuleContextInfo ? moduleContextInfo.DistanceWallLeft : 999;
	const wallDistanceRight = hasModuleContextInfo ? moduleContextInfo.DistanceWallRight : 999;
	const isNearWallLeft = wallDistanceLeft >= 0 && wallDistanceLeft <= maxWallDistance;
	const isNearWallRight = wallDistanceRight >= 0 && wallDistanceRight <= maxWallDistance;
	const autoFillerLeft = hasModuleContextInfo && !moduleContextInfo.HasDockingLeft && isNearWallLeft;
	const autoFillerRight = hasModuleContextInfo && !moduleContextInfo.HasDockingRight && isNearWallRight;

	//======================================================================
	// Apply automatic filler and upright logic to return and visibility values
	//======================================================================

	const returnPlinthLeft = autoFillerLeft ? false : moduleContextInfo.ReturnPlinthLeft;
	const returnPlinthRight = autoFillerRight ? false : moduleContextInfo.ReturnPlinthRight;
	const returnCeilingFillerLeft = autoFillerLeft ? false : moduleContextInfo.ReturnCeilingFillerLeft;
	const returnCeilingFillerRight = autoFillerRight ? false : moduleContextInfo.ReturnCeilingFillerRight;

	let needsVisibleSideLeft = autoFillerLeft ? false : moduleContextInfo.NeedsVisibleSideLeft;
	let needsVisibleSideRight = autoFillerRight ? false : moduleContextInfo.NeedsVisibleSideRight;
	const autoUprightLeft = this.mod_CarcaseVisLeftAutomaticType === 'AddUpright' && needsVisibleSideLeft;
	const autoUprightRight = this.mod_CarcaseVisRightAutomaticType === 'AddUpright' && needsVisibleSideRight;
	needsVisibleSideLeft = needsVisibleSideLeft && !autoUprightLeft;
	needsVisibleSideRight = needsVisibleSideRight && !autoUprightRight;

	//======================================================================
	// Create information object for visibility and automatism control
	//======================================================================

	const storageunitInfo = {
		PlinthAreaVisLeft: resolveVisibility(this.mod_PlinthAreaVisLeftSelection, returnPlinthLeft),
		PlinthAreaVisRight: resolveVisibility(this.mod_PlinthAreaVisRightSelection, returnPlinthRight),
		CeilingAreaVisLeft: resolveVisibility(this.mod_CeilingAreaVisLeftSelection, returnCeilingFillerLeft),
		CeilingAreaVisRight: resolveVisibility(this.mod_CeilingAreaVisRightSelection, returnCeilingFillerRight),
		CarcaseVisLeft: resolveVisibility(this.mod_CarcaseVisLeftSelection, needsVisibleSideLeft),
		CarcaseVisRight: resolveVisibility(this.mod_CarcaseVisRightSelection, needsVisibleSideRight),
		AutoFillerLeft: autoFillerLeft,
		AutoFillerRight: autoFillerRight,
		AutoUprightLeft: autoUprightLeft,
		AutoUprightRight: autoUprightRight,
		WallDistanceLeft: wallDistanceLeft,
		WallDistanceRight: wallDistanceRight	
	};
	this.mod_InformationList[0] = JSON.stringify(storageunitInfo);

	//======================================================================
	// Helper function to resolve the visibility based on the selection and the automatic value
	//======================================================================

	type VisibilityValue = 1 | 0;
	function resolveVisibility(selection: string, automaticValue: boolean): VisibilityValue {
		switch (selection) {
			case "Automatic":
				return automaticValue ? 1 : 0;

			case "Visible":
				return 1;

			case "NotVisible":
				return 0;

			default: {
				logError(`Unknown visibility selection: ${selection}`);
				return 0;
			}
		}
	}

	//======================================================================
	// Add automatic fillers
	//======================================================================

	const createAutoFiller = (direction: "Left" | "Right", width: number, originX: number) => {
		const filler = this.addOD_M_mc_FillerStraight01(1);

		filler.mod_FrontPosStart = this.mod_FrontPosStart;
		filler.mod_Height = this.mod_CarcaseHeight - this.mod_FrontGapHorTop;
		filler.mod_Direction = direction;
		filler.mod_FillerType = "LShape";
		filler.mod_TypeElement = "Filler";
		filler.mod_Width = width;
		filler.mod_CarcaseId = carcaseId;
		filler.setOrigin(originX, StartPosCabinet, 0);
	};

	if (autoFillerLeft) createAutoFiller("Left", wallDistanceLeft, -wallDistanceLeft);
	if (autoFillerRight) createAutoFiller("Right", wallDistanceRight, this.mod_Width);

	//======================================================================
	// Add automatic uprights
	//======================================================================

	const createAutoUpright = (direction: "Left" | "Right", originX: number) => {
		const upright = this.addOD_M_mc_Upright01(1);

		upright.mod_Height = this.mod_CarcaseHeight + this.mod_GlobalFrontOversizeBtm + this.mod_GlobalFrontOversizeTop;
		upright.mod_Depth = this.mod_Depth + 22 + moduleContextInfo.DistanceWallBack;
		upright.mod_UprightConstruction = 'CarcaseHeight';
		upright.mod_UprightColor = this.mod_FrontColor;
		upright.mod_UprightFloorProfileColor = 'DemoStainlessSteel';
		upright.mod_UprightOverdimensionBtm = 0;
		upright.mod_UprightOverdimensionTop = 0;
		upright.mod_UprightOverhang = 22;
		upright.mod_UprightProgram = this.mod_FrontProgram;
		upright.mod_UprightSide = direction;
		upright.mod_TypeElement = "Upright";
		upright.setOrigin(originX, StartPosCabinet - this.mod_GlobalFrontOversizeBtm, -moduleContextInfo.DistanceWallBack);
	};

	if (autoUprightLeft) createAutoUpright("Left", -this.mod_UprightThk);
	if (autoUprightRight) createAutoUpright("Right", this.mod_Width);
	
	//======================================================================
	// Calculate the dimension logic for sloped ceiling
	//======================================================================

	// Use the Wall data
	if (this.mod_SlopedCeilingDimensionLogic_matrix.UseWallData) { 

		//Calculate the maximum height
		if (this.mod_SlopedCeilingDimensionLogic_matrix.Height == 'Max') { 
			angle = wallAngle;
			backHeight = wallBackheight - StartPosCabinet - this.g.basic_SlopedCeilingHeightReduction;
		}

		// Calculate the height based on the user height definition (only if it touches the sloped ceiling)
		else if (this.mod_SlopedCeilingDimensionLogic_matrix.Height == 'User' && StartPosCabinet + this.mod_Height > wallBackheight) { 
			angle = wallAngle;
			backHeight = wallBackheight - StartPosCabinet - this.g.basic_SlopedCeilingHeightReduction;
		}
		else {
			angle = 0
			backHeight = this.mod_BackHeight - StartPosCabinet;
		}
	}

	// Data completly defined by user
	else {
		angle = this.mod_SlopeAngle
		backHeight = this.mod_BackHeight - StartPosCabinet;
	}

	// It's a SlopedCeiling Cabinet
	if (angle != 0) { 
		// Calculate height and top depth using maximum height possible
		let maxheight = GlobalFunc.find_CarcaseSlopedCeilingDimension(this.mod_SlopedCeilingConstruction, 'BasedInTopDepth').Height(this, backHeight, angle);
		let maxheightTopDepth = GlobalFunc.find_CarcaseSlopedCeilingDimension(this.mod_SlopedCeilingConstruction, 'BasedInTopDepth').TopDepth(this, backHeight, angle);

		// Calculate the Height
		height = GlobalFunc.find_CarcaseSlopedCeilingDimension(this.mod_SlopedCeilingConstruction, this.mod_SlopedCeilingDimensionLogic_matrix.DimensionLogic).Height(this, backHeight, angle);

		// Calculate the Top Depth
		topDepth = GlobalFunc.find_CarcaseSlopedCeilingDimension(this.mod_SlopedCeilingConstruction, this.mod_SlopedCeilingDimensionLogic_matrix.DimensionLogic).TopDepth(this, backHeight, angle);

		// If the height is bigger than the maximum height, we limit the cabinet to the maximum height
		if (height > maxheight) { 
			height = maxheight;
			topDepth = maxheightTopDepth;
		}
		height != this.mod_CarcaseHeight ? logWarning('Automatic adjustment: Carcase height is now ' + height + ' instead of ' + this.mod_CarcaseHeight) : '';
		topDepth != this.mod_TopDepth ? logWarning('Automatic adjustment: Top depth is now ' + topDepth + ' instead of ' + this.mod_TopDepth) : '';

		// Read Settings table
		const slopedCeilingSettings = GlobalFunc.find_SlopedCeilingSettings(this.mod_SlopedCeilingConstruction!);

		// Adjust CarcaseConnectionLeftBtm
		if (slopedCeilingSettings.CarcaseConnectionLeftBtm != this.mod_CarcaseConnectionLeftBtm) {
			logWarning('Automatic adjustment: Carcase connection LeftBtm is now ' + slopedCeilingSettings.CarcaseConnectionLeftBtm + ' instead of ' + this.mod_CarcaseConnectionLeftBtm);
			carc.mod_CarcaseConnectionLeftBtm = slopedCeilingSettings.CarcaseConnectionLeftBtm;
		}

		// Adjust CarcaseConnectionLeftTop
		if (slopedCeilingSettings.CarcaseConnectionLeftTop != this.mod_CarcaseConnectionLeftTop) {
			logWarning('Automatic adjustment: Carcase connection LeftTop is now ' + slopedCeilingSettings.CarcaseConnectionLeftTop + ' instead of ' + this.mod_CarcaseConnectionLeftTop);
			carc.mod_CarcaseConnectionLeftTop = slopedCeilingSettings.CarcaseConnectionLeftTop;
		}

		// Adjust CarcaseConnectionRightBtm
		if (slopedCeilingSettings.CarcaseConnectionRightBtm != this.mod_CarcaseConnectionRightBtm) {
			logWarning('Automatic adjustment: Carcase connection RightBtm is now ' + slopedCeilingSettings.CarcaseConnectionRightBtm + ' instead of ' + this.mod_CarcaseConnectionRightBtm);
			carc.mod_CarcaseConnectionRightBtm = slopedCeilingSettings.CarcaseConnectionRightBtm;
		}

		// Adjust CarcaseConnectionRightTop
		if (slopedCeilingSettings.CarcaseConnectionRightTop != this.mod_CarcaseConnectionRightTop) {
			logWarning('Automatic adjustment: Carcase connection RightTop is now ' + slopedCeilingSettings.CarcaseConnectionRightTop + ' instead of ' + this.mod_CarcaseConnectionRightTop);
			carc.mod_CarcaseConnectionRightTop = slopedCeilingSettings.CarcaseConnectionRightTop;
		}

		// Adjust CarcaseShelftopConstruction
		if (slopedCeilingSettings.CarcaseShelftopConstruction != this.mod_CarcaseShelftopConstruction) {
			logWarning('Automatic adjustment: Carcase Shelf top construction is now ' + slopedCeilingSettings.CarcaseShelftopConstruction + ' instead of ' + this.mod_CarcaseShelftopConstruction);
			carc.mod_CarcaseShelftopConstruction = slopedCeilingSettings.CarcaseShelftopConstruction;
		}
	}

	// Calculation of the carcase width and starting Position (Endless cabinets)
	//----------------------------------------------------

	function GetSideAdjustment(type: string, thickness: number): number {
		switch (type) {
			case 'OutSp':
			case 'NoSpAtOutSpOversized':
				return 0;
			case 'NoSpAtOutSp':
				return thickness;
			case 'NoSpAtMiSp':
			case 'MiSp':
				return thickness / 2;
			default:
				return 0;
		}
	}

	function GetCarcaseMovement(leftType: string, leftThk: number): number {
		switch (leftType) {
			case 'MiSp':
			case 'NoSpAtMiSp':
				return -leftThk / 2;
			case 'NoSpAtOutSp':
				return -leftThk;
			default:
				return 0;
		}
	}

	function CalculateCarcaseWidth(leftType: string, rightType: string, width: number, leftThk: number, rightThk: number): number {
		const leftAdjustment = GetSideAdjustment(leftType, leftThk);
		const rightAdjustment = GetSideAdjustment(rightType, rightThk);
		return width + leftAdjustment + rightAdjustment;
	}

	// Set the values to the relevant attributes of the carcase
	//----------------------------------------------------

	//let StartPosCabinet = this.mod_PlinthAreaDesign_matrix.PlinthAreaType !== 'None' ? this.mod_PlinthAreaHeight! : 0;
	let CarcaseMovement = GetCarcaseMovement(this.mod_SidepanelleftType, this.mod_SidepanelleftThk);

	carc.mod_CarcaseWidth = CalculateCarcaseWidth(this.mod_SidepanelleftType, this.mod_SidepanelrightType, this.mod_Width, this.mod_SidepanelleftThk, this.mod_SidepanelrightThk);
	carc.mod_CarcaseMovement = CarcaseMovement;
	carc.mod_CarcaseDepth = this.mod_Depth + RackAreaOversize;
	carc.mod_CarcaseHeight = height;
	carc.mod_TopDepth = topDepth;
	carc.mod_SlopeAngle = angle;
	carc.mod_BackHeight = backHeight;
	carc.mod_SidepanelleftType = this.mod_SidepanelleftType;
	carc.mod_SidepanelrightType = this.mod_SidepanelrightType;
	carc.mod_CarcaseId = carcaseId;
	carc.mod_CarcaseVisLeft = storageunitInfo.CarcaseVisLeft === 1;
	carc.mod_CarcaseVisRight = storageunitInfo.CarcaseVisRight === 1;

	// Set origin of the carcase
	//----------------------------------------------------

	carc.setOrigin(CarcaseMovement, StartPosCabinet, 0);

	// Save origin in Attribute
	carc.mod_Originpos.push(CarcaseMovement);
	carc.mod_Originpos.push(StartPosCabinet);
	carc.mod_Originpos.push(0);

	//===================================================
	//          Cycle through the childs and manage the front elements
	//===================================================

	// Define variables
	let GlobalCount: number = 0;
	let LastFrontElem: number = 0;
	let LastFrontHeight: number = 0;
	let CountFingerGrip: number = 0;
	let FingergripBottom = false;
	let tmpGapMid: number = 0;
	let FingerGripLine: number = 0;
	let StartPos = this.mod_FrontPosStart + StartPosCabinet;
	let tmpLastStartPos: number[] = []; //Stores the position of each front
	tmpLastStartPos[0] = 0;
	let tmpLastGap: number[] = []; //Stores the gap between each fronts (either normal gap or fingergrip gap)
	tmpLastGap[0] = 0;
	let tmpLastFrontFingergrip: boolean[] = [false]; // Stores if the front has fingergrip
	tmpLastFrontFingergrip[0] = false;

	// Initialize fingergrip information for the carcase
	carc.mod_FingergripTop = false;
	carc.mod_FingergripQtyMiddle = 0;
	carc.mod_FingergripPos1 = 0;
	carc.mod_FingergripPos2 = 0;
	carc.mod_FingergripPos3 = 0;
	carc.mod_FingergripPos4 = 0;
	carc.mod_FingergripPos5 = 0;

	//Initialize Backwall constriuction and Backwall position
	carc.mod_CarcaseBackwallConstructionList[1] = this.mod_CarcaseBackwallConstruction!;
	carc.mod_BackwallPosList[1] = this.mod_BackwallPos!;

	//Initialize variables for Dividers
	let VertDividerType: string[] = [];
	let VertDividerFrontWidth: number[] = [];
	let VertDividerFrontName: string[] = [];

	// Define variable to change Shelffixed when Drawer above RackArea
	let FixedShelf: string = this.g.basic_RackAreaShelftopConstruction;

	//===================================================
	// Create Front ID and Count total quantities
	//===================================================

	const typeCounters = {
		Drawer: 0,
		Pullout: 0,
		PantryPullout: 0,
		Door: 0,
		Fliplift: 0,
		Fixedfront: 0,
		Oven: 0,
		Fridge: 0,
		RackArea: 0
	};

	this.m.forEach(p => {
		if (p instanceof OD_M_mf_Door) {
			p.mod_FrontId = 'Door_' + (++typeCounters.Door);
		} else if (p instanceof OD_M_mf_Fliplift) {
			p.mod_FrontId = 'Fliplift_' + (++typeCounters.Fliplift);
		} else if (p instanceof OD_M_mf_Drawer) {
			p.mod_FrontId = 'Drawer_' + (++typeCounters.Drawer);
		} else if (p instanceof OD_M_mf_Pullout) {
			p.mod_FrontId = 'Pullout_' + (++typeCounters.Pullout);
		} else if (p instanceof OD_M_mf_PantryPullout) {
			p.mod_FrontId = 'PantryPullout_' + (++typeCounters.PantryPullout);
		} else if (p instanceof OD_M_mf_Fixedfront) {
			p.mod_FrontId = 'Fixedfront_' + (++typeCounters.Fixedfront);
		} else if (p instanceof OD_M_mf_Oven) {
			p.mod_FrontId = 'Oven_' + (++typeCounters.Oven);
		} else if (p instanceof OD_M_mf_Fridge) {
			p.mod_FrontId = 'Door_' + (++typeCounters.Fridge);
		} else if (p instanceof OD_M_mf_RackArea) {
			p.mod_FrontId = 'RackArea_' + (++typeCounters.RackArea);
		}
	});

	const FrontClasses = [
		OD_M_mf_Door,
		OD_M_mf_Fliplift,
		OD_M_mf_Drawer,
		OD_M_mf_Pullout,
		OD_M_mf_PantryPullout,
		OD_M_mf_Oven,
		OD_M_mf_Fridge,
		OD_M_mf_RackArea,
		OD_M_mf_Fixedfront,
	];

	// Calculate opening depth of the drawers
	const DrawerOpenDepth = (this.mod_Depth - 100) / typeCounters.Drawer;
	let DrawerOpeningDepth = DrawerOpenDepth * typeCounters.Drawer;

	// Cycle
	this.m.forEach((p, i, arr) => {

		const prev = arr[i - 1];
		const next = arr[i + 1];
		const prevM = prev && FrontClasses.some(cls => prev instanceof cls) ? prev : undefined;
		const nextM = next && FrontClasses.some(cls => next instanceof cls) ? next : undefined;

		//===============================================================================================
		// Manage the hob
		//===============================================================================================

		if (p instanceof OD_M_mf_Hob) {

			// Movement in height
			p.setOrigin(this.mod_Width / 2, StartPosCabinet + this.mod_Height + this.mod_CountertopThk, this.mod_Depth + this.g.basic_CountertopOverhangFront);

			// Seal the hob
			let sealedHob = p.seal();

			// Height of the blocked area for the hob
			let hobHeightBlockedSpace = sealedHob.mod_HobInfo[0] - this.mod_CountertopThk;
			carc.mod_HobHeightBlockedSpace = hobHeightBlockedSpace;

			// Read the hob data (to provide it for the drawings via the contour)
			if (sealedHob.mod_CountertopInfo.length > 0 && sealedHob.mod_CountertopInfo[0] != null) {
				this.mod_CountertopInfo.push(sealedHob.mod_CountertopInfo[0]);
			}
		}

		//===============================================================================================
		// Manage the sink
		//===============================================================================================

		if (p instanceof OD_M_mf_Sink) {

			// Movement in height
			p.setOrigin(this.mod_Width / 2, StartPosCabinet + this.mod_Height + this.mod_CountertopThk, this.mod_Depth + this.g.basic_CountertopOverhangFront);

			// Seal the sink
			let sealedSink = p.seal();

			// Read sink data (to provide it for the drawings via the contour)
			if (sealedSink.mod_CountertopInfo.length > 0 && sealedSink.mod_CountertopInfo[0] != null) {
				this.mod_CountertopInfo.push(sealedSink.mod_CountertopInfo[0]);
			}
		}

		//===============================================================================================
		// Manage generic dimensions and gaps for all front elements
		//===============================================================================================

		if(p instanceof OD_M_mf_Oven){
			tmpLastStartPos.push(StartPos - StartPosCabinet);
			tmpLastGap.push(this.mod_FrontGapHor / 2);
		}
		
		if (p instanceof OD_M_mf_Door || p instanceof OD_M_mf_Fliplift || p instanceof OD_M_mf_Drawer || p instanceof OD_M_mf_Pullout || p instanceof OD_M_mf_PantryPullout || p instanceof OD_M_mf_Fridge || p instanceof OD_M_mf_RackArea || p instanceof OD_M_mf_Fixedfront) {

			// Create Carcase ID and Attributes
			GlobalCount++;
			p.mod_CarcaseId = carcaseId;
			p.mod_CarcaseDepth = this.mod_Depth;
			p.mod_CarcaseWidth = this.mod_Width;
			p.mod_CarcaseHeight = height;
			p.mod_FrontPosStart = StartPos - StartPosCabinet;

			// Set the opening distance for the drawer
			if (p instanceof OD_M_mf_Drawer || p instanceof OD_M_mf_Pullout || p instanceof OD_M_mf_PantryPullout) {
				p.mod_DrawerOpeningDistance = DrawerOpeningDepth;
				DrawerOpeningDepth -= DrawerOpenDepth;
			}

			// setOrigin
			p.setOrigin(0, StartPos, this.mod_Depth);

			p.mod_Originpos[0] = 0;
			p.mod_Originpos[1] = StartPos;
			p.mod_Originpos[2] = this.mod_Depth;

			// Check first and last front element
			if (StartPos + p.mod_FrontHeightSelection! >= height + StartPosCabinet) { LastFrontElem = 1 }

			// Error if front element start over the carcase top end
			if (StartPos >= height + StartPosCabinet) {
				let ErrorMessage = GlobalFunc.find_ErrorList('Error 22019', 1);
				logError(ErrorMessage.Message(''));
			}

			// Calculation of front height and set information to carcase regarding fingergrip
			if (LastFrontElem == 1 && p.mod_FingergripTop == true) {
				carc.mod_FingergripTop = true;
				p.mod_FrontHeight = height - (StartPos - StartPosCabinet + this.mod_FingergripType_matrix.LShapeGapAbove!)
				LastFrontHeight = height - (StartPos - StartPosCabinet);
				StartPos = height;
				tmpLastStartPos.push(StartPos - StartPosCabinet);
				tmpLastGap.push(-this.mod_FingergripType_matrix.CShapeOverlapAbove!);
				if (tmpLastFrontFingergrip[tmpLastFrontFingergrip.length - 1] == true) { p.mod_FingergripBtmType = carc.mod_FingergripType! }
				else { p.mod_FingergripBtmType = 'NoFingergrip' }
				tmpLastFrontFingergrip.push(true);
				p.mod_FingergripTopType = carc.mod_FingergripType!;

			}
			else if (LastFrontElem == 1 && p.mod_FingergripTop == false) {
				p.mod_FrontHeight = height - (StartPos - StartPosCabinet + this.mod_FrontGapHorTop);
				LastFrontHeight = height - (StartPos - StartPosCabinet);
				StartPos = height;
				tmpLastStartPos.push(StartPos - StartPosCabinet);
				tmpLastGap.push(this.mod_FrontGapHorTop);
				if (tmpLastFrontFingergrip[tmpLastFrontFingergrip.length - 1] == true) { p.mod_FingergripBtmType = carc.mod_FingergripType! }
				else { p.mod_FingergripBtmType = 'NoFingergrip' }
				tmpLastFrontFingergrip.push(false);
				p.mod_FingergripTopType = 'NoFingergrip';
			}
			else {
				if (p.mod_FingergripTop == true) {

					tmpGapMid = this.mod_FingergripType_matrix.CShapeHeight! - (this.mod_FingergripType_matrix.CShapeOverlapBelow! + this.mod_FingergripType_matrix.CShapeOverlapAbove!);
					p.mod_FrontHeight! = p.mod_FrontHeightSelection! - tmpGapMid;
					StartPos += p.mod_FrontHeightSelection! - tmpGapMid - this.mod_FingergripType_matrix.CShapeOverlapBelow! + this.mod_FingergripType_matrix.CShapeHeight! - this.mod_FingergripType_matrix.CShapeOverlapAbove!;

					FingerGripLine = StartPos + this.mod_FingergripType_matrix.CShapeOverlapAbove! - (StartPosCabinet + this.mod_FingergripType_matrix.CShapeHeight! / 2);
					CountFingerGrip++;

					switch (CountFingerGrip) {
						case 1:
							carc.mod_FingergripPos1 = FingerGripLine;
							break;
						case 2:
							carc.mod_FingergripPos2 = FingerGripLine;
							break;
						case 3:
							carc.mod_FingergripPos3 = FingerGripLine;
							break;
						case 4:
							carc.mod_FingergripPos4 = FingerGripLine;
							break;
						case 5:
							carc.mod_FingergripPos5 = FingerGripLine;
							break;
						default:
							let ErrorMessage = GlobalFunc.find_ErrorList('Error 22020', 1);
							logError(ErrorMessage.Message(''));
							break;
					}
					tmpLastStartPos.push(StartPos - StartPosCabinet);
					tmpLastGap.push(-this.mod_FingergripType_matrix.CShapeOverlapAbove!);
					if (tmpLastFrontFingergrip[tmpLastFrontFingergrip.length - 1] == true) { p.mod_FingergripBtmType = carc.mod_FingergripType! }
					else { p.mod_FingergripBtmType = 'NoFingergrip' }
					tmpLastFrontFingergrip.push(true);
					p.mod_FingergripTopType = carc.mod_FingergripType!;
				}

				else {
					StartPos += p.mod_FrontHeightSelection!;
					p.mod_FrontHeight = p.mod_FrontHeightSelection! - this.mod_FrontGapHor;
					tmpLastStartPos.push(StartPos - StartPosCabinet);
					tmpLastGap.push(this.mod_FrontGapHor / 2);
					if (tmpLastFrontFingergrip[tmpLastFrontFingergrip.length - 1] == true) { p.mod_FingergripBtmType = carc.mod_FingergripType! }
					else { p.mod_FingergripBtmType = 'NoFingergrip' }
					tmpLastFrontFingergrip.push(false);
					p.mod_FingergripTopType = 'NoFingergrip';

				}
			}

			//===================================================
			// Provide the data of the last front to the carcase
			//===================================================

			if (LastFrontElem == 1) {

				// Height of the last front element
				carc.mod_LastFrontHeight = LastFrontHeight;

				// FrontName
				if (p instanceof OD_M_mf_Door) {
					carc.mod_LastFrontName = "door";
				}
				else if (p instanceof OD_M_mf_Fliplift) {
					carc.mod_LastFrontName = "fliplift";
				}
				else if (p instanceof OD_M_mf_Drawer || p instanceof OD_M_mf_Pullout || p instanceof OD_M_mf_PantryPullout) {
					carc.mod_LastFrontName = "drawer";
				}
				else if (p instanceof OD_M_mf_Fridge) {
					carc.mod_LastFrontName = "fridge";
				}
				else if (p instanceof OD_M_mf_RackArea) {
					carc.mod_LastFrontName = "rackarea";
				}
				else if (p instanceof OD_M_mf_Fixedfront) {
					carc.mod_LastFrontName = "fixedfront";
				}
			}

			//===================================================
			// Manage the global oversize
			//===================================================

			if (p instanceof OD_M_mf_Door || p instanceof OD_M_mf_Fliplift || p instanceof OD_M_mf_Drawer || p instanceof OD_M_mf_Pullout || p instanceof OD_M_mf_PantryPullout || p instanceof OD_M_mf_Fridge || p instanceof OD_M_mf_Fixedfront) {

				// First front element
				//------------------------------------------
				if(GlobalCount === 1){

					// Flag for first front element
					p.mod_FirstFront = true;
					p.mod_HeightPosInsertion = this.mod_HeightPosInsertion;

					// Apply global oversize if front element has no oversize defined
					if(this.mod_GlobalFrontOversizeBtm > 0 && p.mod_FrontOversizeBtm === 0){
						p.mod_FrontOversizeBtm = this.mod_GlobalFrontOversizeBtm;
					}
				}
				else{
					p.mod_FirstFront = false;
					p.mod_FrontOversizeBtm = 0;
				}

				// Last front element
				//------------------------------------------
				if (LastFrontElem === 1) {

					// Flag for last front element
					p.mod_LastFront = true;

					// Apply global oversize if front element has no oversize defined
					if(this.mod_GlobalFrontOversizeTop > 0 && p.mod_FrontOversizeTop === 0){
						p.mod_FrontOversizeTop = this.mod_GlobalFrontOversizeTop;
					}
				}
				else{
					p.mod_LastFront = false;
					p.mod_FrontOversizeTop = 0;
				}

				// Oversize to the side
				//------------------------------------------
				if(this.mod_GlobalFrontOversizeLeft > 0 && p.mod_FrontOversizeLeft === 0){
					p.mod_FrontOversizeLeft = this.mod_GlobalFrontOversizeLeft;
				}
				if(this.mod_GlobalFrontOversizeRight > 0 && p.mod_FrontOversizeRight === 0){
					p.mod_FrontOversizeRight = this.mod_GlobalFrontOversizeRight;
				}
			}

			//===================================================
			// Manage Front Width and Construction
			//===================================================
			
			if (p instanceof OD_M_mf_Door || p instanceof OD_M_mf_Fliplift || p instanceof OD_M_mf_Pullout) {
				p.mod_FrontWidth = this.mod_Width;
				if (this.mod_CarcaseFrontConstruction_matrix.Left == "Inlayed") { p.mod_FrontWidth = p.mod_FrontWidth - this.mod_SidepanelleftThk };
				if (this.mod_CarcaseFrontConstruction_matrix.Right == "Inlayed") { p.mod_FrontWidth = p.mod_FrontWidth - this.mod_SidepanelrightThk };
			}
		}

		//===============================================================================================
		// Manage the Hood 
		//===============================================================================================
		if (p instanceof OD_M_mf_Door) {
			p.m.forEach((h, i, arrH) => {
				if (h instanceof OD_M_me_HoodInsert) {
					
					let hoodinsert = GlobalFunc.process_HoodInsert(h.mod_HoodSupplier ?? "",h.mod_HoodId ?? "",h.mod_HoodIntegrationType ??"",h.mod_HoodConstructionType??"",this.mod_Width,this.mod_Height,this.mod_Depth);
					if(hoodinsert && hoodinsert.DatasetComplete){
						carc.mod_HoodInsertion = true;
						carc.mod_HoodInformation = JSON.stringify(hoodinsert);
						h.mod_HoodInformation == JSON.stringify(hoodinsert);
					}
				}
			})
		}

		//===============================================================================================
		// Manage the oven
		//===============================================================================================

		if (p instanceof OD_M_mf_Oven) {

			// Create Carcase ID and Attributes
			GlobalCount++;
			p.mod_CarcaseId = carcaseId;
			p.mod_CarcaseDepth = this.mod_Depth;
			p.mod_CarcaseWidth = this.mod_Width;
			p.mod_CarcaseHeight = height;

			// setOrigin
			StartPos -= (GlobalCount > 1 ? this.mod_FrontGapHor : 0);
			p.setOrigin(0, StartPos, this.mod_Depth);
			p.mod_FrontPosStart = StartPos - StartPosCabinet;
			
			p.mod_Originpos[0] = 0;
			p.mod_Originpos[1] = StartPos;
			p.mod_Originpos[2] = this.mod_Depth;
		}

		//===============================================================================================
		// Manage the fixed shelves
		//===============================================================================================

		if (p instanceof OD_M_mf_Door || p instanceof OD_M_mf_Fliplift || p instanceof OD_M_mf_Drawer || p instanceof OD_M_mf_Pullout || p instanceof OD_M_mf_PantryPullout || p instanceof OD_M_mf_Oven || p instanceof OD_M_mf_Fridge || p instanceof OD_M_mf_RackArea || p instanceof OD_M_mf_Fixedfront) {

			// Interface to provide the data for the carcase
			//-------------------------------------------------------------------------------------

			interface ShelfFixedInfo {
				PosY: number;                  // Height position of the fixed shelf
				Fingergrip: boolean;           // Fingergrip in front of the fixed shelf
				Position: string;              // Position of the fixed shelf related to the fingergrip and front gap
				FingergripType: string;        // Version of fingergrip to get the dimensions
				Backside: string;              // Attribute for "Contact" or "ThrougBw"
				Part: string;                  // Shelffixed or Rail
			}

			// Function to create ShelfFixedInfo
			//-------------------------------------------------------------------------------------

			function createShelfFixedInfo(p: any, m: any): ShelfFixedInfo {
				return {
					PosY: (tmpLastStartPos[GlobalCount - 1] - tmpLastGap[GlobalCount - 1]),
					Fingergrip: tmpLastFrontFingergrip[GlobalCount - 1] || false,
					Position: p.mod_ShelffixedPos || 'None',
					FingergripType: m.mod_FingergripType || 'None',
					Backside: p.mod_ShelffixedType || 'None',
					Part: 'part_Shelffixed'
				};
			}

			// Check the different situations
			//-------------------------------------------------------------------------------------

			let insertFixedShelf = false;

			// If it's the first front element, we don't need a fixed shelf
			if (GlobalCount === 1 && !(p instanceof OD_M_mf_Oven) && !(p instanceof OD_M_mf_Fridge)) {
				p.mod_ShelffixedBtm = false;
			}
			// If there is a Oven before, we don't need a fixed shelf -> it is set from the oven
			else if (prevM instanceof OD_M_mf_Oven && !(p instanceof OD_M_mf_Oven)) {
				p.mod_ShelffixedBtm = false;
			}
			// If there is a Fridge before, we don't need a fixed shelf -> it is set from the oven or fridge
			else if (prevM instanceof OD_M_mf_Fridge && !(p instanceof OD_M_mf_Oven)) {
				p.mod_ShelffixedBtm = false;
			}
			// If it is the oven and not the first front element
			else if (p instanceof OD_M_mf_Oven) {
				const ovenData = GlobalFunc.process_Oven(this, p, carc, StartPos, StartPosCabinet);
				StartPos = ovenData.nextFront;
				p.mod_Information = ovenData.ovenData;
			}
			// If it is the fridge
			else if (p instanceof OD_M_mf_Fridge) {
				const ovenOnTop = nextM instanceof OD_M_mf_Oven;
				GlobalFunc.process_Fridge(p, carc, GlobalCount, LastFrontElem, ovenOnTop)
			}
			// If it's not the first front element and fixed shelf has been selected
			else if (GlobalCount > 1 && p.mod_ShelffixedBtm && !(p instanceof OD_M_mf_Oven)) {
				insertFixedShelf = true;
			}
			// If there is a RackArea before a Drawer and the fixed shelf should be inserted automatically
			else if (p instanceof OD_M_mf_Drawer && prevM instanceof OD_M_mf_RackArea && FixedShelf === 'Automatic') {
				insertFixedShelf = true;
				p.mod_ShelffixedBtm = true;
			}

			// Stringify the object and push it to the list attribute
			//-------------------------------------------------------------------------------------

			if (insertFixedShelf) {
				carc.mod_ShelffixedInfoList.push(JSON.stringify(createShelfFixedInfo(p, this)));
			}

			//===============================================================================================
			// Collect the data of the fronts to supply it to the carcase
			//===============================================================================================

			// Interface to provide the data for the carcase
			//-------------------------------------------------------------------------------------

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

			// If it is the oven
			//-------------------------------------------------------------------------------------

			if (p instanceof OD_M_mf_Oven) {
				// done in the process_Oven
			}

			// If it is the fridge
			//-------------------------------------------------------------------------------------

			else if (p instanceof OD_M_mf_Fridge) {
				// done in the process_Fridge

				// Get the Information about the doors
				const doorInfo = GlobalFunc.process_Door(p);
				p.mod_DoorDirection = doorInfo.RealDoorDirection;
				p.mod_DoorType = doorInfo.RealDoorType;
				p.mod_Information = JSON.stringify(doorInfo);
			}

			// All the other fronts
			//-------------------------------------------------------------------------------------

			else {

				// Create the object
				let frontInfo: FrontInfo = {
					FrontCategory: "Standard",
					StartingPosition: p.mod_FrontPosStart!,
					FrontHeight: p.mod_FrontHeightSelection!,
					RealFrontHeight: p.mod_FrontHeight!,
					BackwallConstruction: p.mod_CarcaseBackwallConstruction!,
					BackwallPosition: p.mod_BackwallPos!,
					FixedshelfBottom: p.mod_ShelffixedBtm!,
					FingergripBottom: FingergripBottom,
					FingergripTop: !!p.mod_FingergripTop,
					FringergripType: this.mod_FingergripType
				}

				// Stringify the object and push it to the list attribute
				carc.mod_FrontAreaInfoList.push(JSON.stringify(frontInfo));

				// Save the fingergrip for the next front
				FingergripBottom = !!p.mod_FingergripTop;
			}
		}

		//===================================================
		// Manage the Vert Dividers
		//===================================================

		if (p instanceof OD_M_mf_Door) {


			// Get the Information about the doors
			let doorInfo = GlobalFunc.process_Door(p);
			p.mod_DoorDirection = doorInfo.RealDoorDirection;
			p.mod_DoorType = doorInfo.RealDoorType;
			p.mod_Information = JSON.stringify(doorInfo);

			// Set the values of the attributes (will be provided to the carcase)
			VertDividerType[GlobalCount] = doorInfo.VertDivider;
			VertDividerFrontWidth[GlobalCount] = doorInfo.FrontWidthList[0]
			VertDividerFrontName[GlobalCount] = p.mod_ModuleName!;
		}
		else {
			VertDividerType[GlobalCount] = 'NoVertDivider';
		}

		//===================================================
		// Manage ModuleName and RackArea
		//===================================================

		if (p instanceof OD_M_mf_RackArea) {
			FixedShelf = p.mod_RackAreaShelftopConstruction!;
		}
	});

	//================================================================================
	//          Stringify the Divider Information and pass it to the mc_Storageunit (will be used to insert the VertDivider in the mc_Storageunit)
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
	// Manage the fingergrip
	//===================================================

	carc.mod_FingergripQtyMiddle = CountFingerGrip;

	//===================================================
	// Seal mc_Storageunit and get attribute with FreeSpace
	//===================================================
	
	let sealedCarc = carc.seal();
	let sealedCarc_CarcaseSpaceDimension = JSON.parse(sealedCarc.mod_CarcaseSpaceDimension[0]);
	let sealedCarc_VertDividerInfoList = JSON.parse(sealedCarc.mod_VertDividerInfoList[0]);
	let sealedCarc_CarcasePartInfo = JSON.parse(sealedCarc.mod_CarcasePartInfo[0]);
	let BtmShelfPosDepth = sealedCarc_CarcasePartInfo.HorizontalPartsPosZ[1];
	let BtmShelfPos = sealedCarc_CarcasePartInfo.HorizontalPartsPosY[1];
	let i = 0

	// Cycle for the child modules
	this.m.forEach(p => {

		if (p instanceof OD_M_mf_Door || p instanceof OD_M_mf_Fliplift || p instanceof OD_M_mf_Drawer || p instanceof OD_M_mf_Pullout || p instanceof OD_M_mf_PantryPullout || p instanceof OD_M_mf_Fridge || p instanceof OD_M_mf_RackArea || p instanceof OD_M_mf_Fixedfront || p instanceof OD_M_mf_Oven) {

			// Set the attribute for the free space (CarcaseSpaceDimension) regarding each front
			let CarcaseSpaceDimension: any = {
				FullWidthFreeSpace: sealedCarc_CarcaseSpaceDimension.FullWidthFreeSpace,
				FullHeightFreeSpace: sealedCarc_CarcaseSpaceDimension.FullHeightFreeSpace,
				FullDepthFreeSpace: sealedCarc_CarcaseSpaceDimension.FullDepthFreeSpace,
				FullWidthStartPos: sealedCarc_CarcaseSpaceDimension.FullWidthStartPos,
				FullHeightStartPos: sealedCarc_CarcaseSpaceDimension.FullHeightStartPos,
				FullDepthStartPos: sealedCarc_CarcaseSpaceDimension.FullDepthStartPos,
				WidthFreeSpace: sealedCarc_CarcaseSpaceDimension.WidthFreeSpace[i],
				HeightFreeSpace: sealedCarc_CarcaseSpaceDimension.HeightFreeSpace[i],
				DepthFreeSpace: sealedCarc_CarcaseSpaceDimension.DepthFreeSpace[i],
				WidthFreeStartPos: sealedCarc_CarcaseSpaceDimension.WidthFreeStartPos[i],
				HeightFreeStartPos: sealedCarc_CarcaseSpaceDimension.HeightFreeStartPos[i] + StartPosCabinet,
				DepthFreeStartPos: sealedCarc_CarcaseSpaceDimension.DepthFreeStartPos[i]
			};
			let strJson = JSON.stringify(CarcaseSpaceDimension);
			p.mod_CarcaseSpaceDimension.push(strJson);

			// Sequence of the fronts
			i++

			// Set the attribute for the VertDividerInfoList info (mod_VertDividerInfoList) regarding each front (will be used for the adjustable shelves)
			if (p instanceof OD_M_mf_Door) {
				let VertDividerInfoList: any = {
					Type: sealedCarc_VertDividerInfoList.Type[i],
					FrontWidth: sealedCarc_VertDividerInfoList.FrontWidth[i],
					FrontName: sealedCarc_VertDividerInfoList.FrontName[i],
					PosX: sealedCarc_VertDividerInfoList.PosX[i],
					DimX: sealedCarc_VertDividerInfoList.DimX[i],
					FreeSpaceWidth: sealedCarc_VertDividerInfoList.FreeSpaceWidth[i],
					FreeSpaceWidthStartPos: sealedCarc_VertDividerInfoList.FreeSpaceWidthStartPos[i]
				};

				let VertDividerInfoListJson = JSON.stringify(VertDividerInfoList);
				p.mod_VertDividerInfoList.push(VertDividerInfoListJson);
			}

			// Provide the CarcasePartInfo regarding each front
			if (p instanceof OD_M_mf_Door || p instanceof OD_M_mf_Fridge || p instanceof OD_M_mf_Fliplift) {

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

				// Set the attribute CarcasePartInfo regarding each front
				let CarcasePartInfo: any = {
					HorizontalPartsType: HorizontalPartsType,
					HorizontalPartsPosY: HorizontalPartsPosY,
					HorizontalPartsPosZ: HorizontalPartsPosZ,
					HorizontalPartsDimY: HorizontalPartsDimY,
					HorizontalPartsDimZ: HorizontalPartsDimZ,
					HorizontalPartsFrontAngle: HorizontalPartsFrontAngle,
					VerticalPartsType: sealedCarc_CarcasePartInfo.VerticalPartsType[i],
					VerticalPartsPosX: sealedCarc_CarcasePartInfo.VerticalPartsPosX[i],
					VerticalPartsPosZ: sealedCarc_CarcasePartInfo.VerticalPartsPosZ[i],
					VerticalPartsDimX: sealedCarc_CarcasePartInfo.VerticalPartsDimX[i],
					VerticalPartsDimZ: sealedCarc_CarcasePartInfo.VerticalPartsDimZ[i],
					VerticalPartsFrontAngle: sealedCarc_CarcasePartInfo.VerticalPartsFrontAngle[i]
				};

				let CarcasePartInfoJson = JSON.stringify(CarcasePartInfo);
				p.mod_CarcasePartInfo.push(CarcasePartInfoJson);
			}

		}
		else if (p instanceof OD_M_mf_Oven) {
			i++;
		}
	});

	//===================================================
	//          Add the PlinthArea to the root-module
	//===================================================

	// Add the module
	const plinth = this.addOD_M_mc_PlinthArea01(1);

	// Set the values to the relevant attributes of the carcase
	plinth.mod_CarcaseDepth = this.mod_Depth - BtmShelfPosDepth;
	plinth.mod_CarcaseWidth = this.mod_Width;
	plinth.mod_CarcaseId = carcaseId;

	plinth.setOrigin(0, BtmShelfPos, BtmShelfPosDepth);

	// Seal the plinth area to retrieve the leg positions
	const sealedPlinth = plinth.seal();
	this.mod_PlinthAreaPositionInfo.push(sealedPlinth.mod_PlinthAreaPositionInfo[0]);

	//===================================================
	//          Create vector / docking
	//===================================================

	const TopEndCabinet = StartPosCabinet + height;
	let dockPosLeft = 0;
	let dockPosRight = this.mod_Width;
	if (autoUprightLeft) dockPosLeft = -this.mod_UprightThk;
	if (autoUprightRight) dockPosRight = this.mod_Width + this.mod_UprightThk;

	// Left side
	this.addDockingInfo(Dock.LeftBottom, new Vector3(dockPosLeft, 0, -this.mod_CarcaseDistanceWall), new Vector3(dockPosLeft, 0, this.mod_Depth));
	this.addDockingInfo(Dock.LeftTop, new Vector3(dockPosLeft, TopEndCabinet, -this.mod_CarcaseDistanceWall), new Vector3(dockPosLeft, TopEndCabinet, this.mod_Depth));

	// Right side
	this.addDockingInfo(Dock.RightBottom, new Vector3(dockPosRight, 0, -this.mod_CarcaseDistanceWall), new Vector3(dockPosRight, 0, this.mod_Depth));
	this.addDockingInfo(Dock.RightTop, new Vector3(dockPosRight, TopEndCabinet, -this.mod_CarcaseDistanceWall), new Vector3(dockPosRight, TopEndCabinet, this.mod_Depth));

	// Back side
	this.addDockingInfo(Dock.BackBottom, new Vector3(dockPosLeft, 0, -this.mod_CarcaseDistanceWall), new Vector3(dockPosRight, 0, -this.mod_CarcaseDistanceWall));
	this.addDockingInfo(Dock.BackTop, new Vector3(dockPosLeft, TopEndCabinet, -this.mod_CarcaseDistanceWall), new Vector3(dockPosRight, TopEndCabinet, -this.mod_CarcaseDistanceWall));

	//===================================================
	//          Call the UserExit of this module
	//===================================================

	const retInfo = GlobalFunc.ue_StorageunitSingle(this);
