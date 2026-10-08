process_StorageunitShelftopConstruction(m: parent, lastBwCon: string = 'None', lastBwPos: number = 0) {

	// Interface to provide the data to the carcase
	//-------------------------------------------------------------------------------------

	interface ShelfTopInfo {
		BwTop: number;          // Manage backwall height
		SpaceTop: number,       // Define the end position of the freespace in height
		SpaceBack: number,      // Define the starting position of the freespace at the last front element
		TopPosBack: number;     // Define back side position of the top shelf (fixed shelf starting position)
		TopPosFront: number;    // Frontposition of the top shelf (free space calculation)
		TopPart: string;        // Name of the construction part (provided in the parts list for fittings like push to open)
		Height: number;
		Width: number;
		Depth: number;
		WidthPos: number;
		HeightPos: number;
		DepthPos: number;
	}

	// Initialisierung mit Default-Werten (z.B. 0)
	let shelfTopInfo: ShelfTopInfo = {
		BwTop: 0,
		SpaceTop: 0,
		SpaceBack: 0,
		TopPosBack: 0,
		TopPosFront: 0,
		TopPart: 'None',
		Height: 0,
		Width: 0,
		Depth: 0,
		WidthPos: 0,
		HeightPos: 0,
		DepthPos: 0
	};

	// Variables
	//-------------------------------------------------------------------------------------

	let moduleName = 'mc_Storageunit01'
	let tmpBwTop = m.mod_CarcaseHeight;
	let tmpTopPosBack = 0;
	let tmpSpaceTop = 0;
	let tmpSpaceBack = lastBwPos;
	let tmpTopPosFront = m.mod_CarcaseDepth;
	let tmpBwPartTop = 'n.a.';
	let tmpAdditionalInfo01: string = m.mod_SlopeAngle === 0 ? 'All' : 'SlopedCeiling';
	let frontHeight = m.mod_LastFrontHeight;
	let shelftopModule: any;
	let retTop: any;

	// Query the settings table to get the modules to insert
	//-------------------------------------------------------------------------------------

	let additionalInfo = m.mod_FingergripTop ? 'Fingergrip' : 'All';
	let retShelves = GlobalFunc.find_CarcaseShelftopSettings(moduleName, m.mod_CarcaseShelftopConstruction, additionalInfo);
	
	retShelves.forEach(elem => {

		//##########################################################################################
		// Library solution
		//##########################################################################################

		if (elem.LibrarySolution) {

			// Reset the value of front height for each iteration
			frontHeight = m.mod_LastFrontHeight - m.mod_FingergripType_matrix.LShapeHeight!;
			let correction = 0;

			//==========================================================================================
			// CarcaseShelftop01 (Shelftop, Rails)
			//==========================================================================================

			if (elem.UsedModule == "mc_CarcaseShelftop01") {

				// Calculation of the part settings
				//-------------------------------------------------------------------------------------

				// Get CarcaseBackwallSettings to use as PartBack in CCK_StorageUnit
				let ccKBw = GlobalFunc.find_CarcaseBackwallSettings(lastBwCon)!;

				// Check the situation on the frontside and backside of the cabinet
				let partBack = 'n.a.';
				let partFront = 'n.a.';

				// Backside of the carcase
				if (elem.BacksideRelevant) {
					if (elem.Construction == "RailBackVertical") {
						if (m.g.basic_RailverttopbackPosition == "BehindBackwall") {
							if (m.g.basic_RailverttopbackThk > lastBwPos - m.mod_BackwallThk) {
								partBack = ccKBw.RailVertBackInFrontBackwall!;
							}
							else {
								partBack = ccKBw.RailVertBackBehindBackwall!;
							}
						}
						else {
							partBack = ccKBw.RailVertBackInFrontBackwall!;
						}
					}
					else {
						partBack = ccKBw.ConstructionBackwallTop!;
					}
					tmpBwPartTop = elem.Construction!;
				}

				// Frontside of the carcase
				if (elem.FrontsideRelevant) {
					if (elem.Construction == "RailFrontVertical") {
						correction = m.mod_FingergripType_matrix.LShapeHeight!;
					}
					if (elem.Construction == "RailFrontVertical" && m.mod_LastFrontName == 'fixedfront') {
						if (elem.HobMoveRelevant && m.g.basic_RailverttopfrontOversize) {
							partFront = "FixedfrontHs";
						}
						else if (m.g.basic_RailverttopfrontOversize) {
							partFront = "Fixedfront";
						}
						else if (m.mod_FingergripTop) {
							partFront = "Fingergrip";
						}
						else {
							partFront = "Overlayed";
						}
					}
					else if (m.mod_FingergripTop) {
						partFront = "Fingergrip";
						if (m.mod_LastFrontName == "door") {
							frontHeight = m.g.basic_RailverttopfrontHeight;
						}
					}
					else {
						frontHeight = m.g.basic_HeatshelfFrontHeightMinimum;
						partFront = "Overlayed";
					}
				}

				// Vertical Rail on backside of the cabinet (hob solution)
				else if (elem.Construction == "RailBackVertical" && elem.HobMoveRelevant) {
					if (m.mod_LastFrontName == 'fixedfront' && m.mod_LastFrontHeight >= m.mod_HobHeightBlockedSpace) {
						frontHeight = m.mod_LastFrontHeight;
						partFront = "FixedfrontHs";
					}
					else if (m.mod_HobHeightBlockedSpace > m.g.basic_HeatshelfFrontHeightMinimum) {
						frontHeight = m.mod_HobHeightBlockedSpace;
						partFront = "Overlayed";
					}
					else if (m.mod_FingergripTop) {
						frontHeight = m.mod_FingergripType_matrix.LShapeHeight!;
						partFront = "Overlayed";
					}
					else {
						frontHeight = m.g.basic_HeatshelfFrontHeightMinimum;
						partFront = "Overlayed";
					}
				}

				// Get StorageunitConstruction
				//-------------------------------------------------------------------------------------

				retTop = GlobalFunc.find_StorageunitConstruction(
					elem.ConstructionTablePartName!,
					m.mod_CarcaseConnectionLeftTop,
					m.mod_CarcaseConnectionLeftBtm,
					m.mod_CarcaseConnectionRightBtm,
					m.mod_CarcaseConnectionRightTop,
					partBack,
					partFront,
					m.mod_CarcaseVisTop,
					tmpAdditionalInfo01
				);

				// Height position
				let hgtPos = retTop.HeightPos(m, frontHeight);

				// Adjustment of the SpaceTop
				if (elem.FrontsideRelevant && tmpSpaceTop > hgtPos || tmpSpaceTop == 0) {
					tmpSpaceTop = hgtPos;
				}

				// Adjustment of the SpaceBack
				if (elem.Construction == "RailBackVertical" && tmpSpaceBack < retTop.DepthPos(m, lastBwPos) + retTop.Depth(m, lastBwPos)) {
					tmpSpaceBack = retTop.DepthPos(m, lastBwPos) + retTop.Depth(m, lastBwPos);
				}

				// Add the module
				//-------------------------------------------------------------------------------------
				if (elem.InsertModule) {

					shelftopModule = m.addOD_M_mc_StorageunitShelftop01();	
					// Set values to the attributes of the child
					shelftopModule.mod_Height = retTop.Height(m, frontHeight);
					shelftopModule.mod_Width = retTop.Width(m, lastBwPos);
					shelftopModule.mod_Depth = retTop.Depth(m, lastBwPos);
					shelftopModule.mod_ShelftopConstruction = elem.Construction!;
					shelftopModule.mod_PartInfo = elem.ConstructionTablePartName!;
					shelftopModule.mod_EdgeFrontType = retTop.EdgeTypeFront!;
					shelftopModule.mod_EdgeLeftType = retTop.EdgeTypeLeft!;
					shelftopModule.mod_EdgeBackType = retTop.EdgeTypeBack!;
					shelftopModule.mod_EdgeRightType = retTop.EdgeTypeRight!;
					shelftopModule.mod_EdgeJointType = retTop.EdgeJointType;

					// setOrigin
					shelftopModule.setOrigin(retTop.WidthPos(m, lastBwPos), hgtPos - correction, retTop.DepthPos(m, lastBwPos));
				
				}

				// Validate DepthPosition
				let depthPosition = retTop.DepthPos(m, lastBwPos);
				if (depthPosition < 0) {
					logError(GlobalFunc.find_ErrorList('Error 22027', 1).Message(elem.ConstructionTablePartName!));
				}

				// Define front side position of the top shelf (to calculate the free space)
				if (elem.FrontsideRelevant) {
					tmpTopPosFront = (m.mod_FingergripTop) ? m.mod_CarcaseDepth : retTop.Depth(m, lastBwPos) + retTop.DepthPos(m, lastBwPos);
				}

				if (elem.BacksideRelevant && tmpBwPartTop != "n.a.") {

					// Define back side position of the top shelf
					tmpTopPosBack = (ccKBw.ConstructionBackwallTop != "Overlayed") ? -10 : retTop.DepthPos(m, lastBwPos);

					// Define backwall topside position relative to TopShelf (to calculate backwall height)
					tmpBwTop = hgtPos;
				}
			}

			//==========================================================================================
			// CarcaseShelftop02 (Heatshelf)
			//==========================================================================================

			if (elem.UsedModule == "mc_CarcaseShelftop02") {

				// Calculations for the insertion height
				//-------------------------------------------------------------------------------------

				let hgtPosHs = m.g.basic_HeatshelfFrontHeightMinimum;
				let partBack = 'Overlayed';
				let partFront = 'Overlayed';

				// Fixed front height
				if (m.mod_LastFrontName == 'fixedfront' && m.mod_LastFrontHeight >= m.mod_HobHeightBlockedSpace) {
					hgtPosHs = m.mod_LastFrontHeight;
				}

				// Blocked area
				else if (m.mod_HobHeightBlockedSpace > m.g.basic_HeatshelfFrontHeightMinimum) {
					hgtPosHs = m.mod_HobHeightBlockedSpace;
				}

				// Fingergrip
				else if (m.mod_FingergripTop) {
					hgtPosHs = m.mod_FingergripType_matrix.LShapeHeight!;
				}

				// To get table entry for fixed front / fingergrip / removable heat shelf
				if (elem.Construction == "Heatshelf" && m.mod_LastFrontName == 'fixedfront' && m.mod_LastFrontHeight >= m.mod_HobHeightBlockedSpace && m.g.basic_RailverttopfrontOversize) {
					partFront = "Fixedfront";
				}
				else {
					partFront = m.mod_FingergripTop == true ? 'Fingergrip' : 'Overlayed';
				}

				// Get StorageunitConstruction
				//-------------------------------------------------------------------------------------

				retTop = GlobalFunc.find_StorageunitConstruction(
					elem.ConstructionTablePartName!,
					m.mod_CarcaseConnectionLeftTop,
					m.mod_CarcaseConnectionLeftBtm,
					m.mod_CarcaseConnectionRightBtm,
					m.mod_CarcaseConnectionRightTop,
					partBack,
					partFront,
					m.mod_CarcaseVisTop,
					tmpAdditionalInfo01
				);

				// Height position
				let hgtPos = retTop.HeightPos(m, hgtPosHs);

				// Adjustment of the SpaceTop
				if (elem.Construction == "Heatshelf") {
					tmpSpaceTop = hgtPos;
				}

				// Add the module
				//-------------------------------------------------------------------------------------
				if (elem.InsertModule) {
					shelftopModule = m.addOD_M_mc_StorageunitShelftop02();

					// Set values to the attributes of the child
					shelftopModule.mod_Height = retTop.Height(m, hgtPosHs);
					shelftopModule.mod_Width = retTop.Width(m, lastBwPos);
					shelftopModule.mod_Depth = retTop.Depth(m, tmpSpaceBack);
					shelftopModule.mod_ShelftopConstruction = elem.Construction!;
					shelftopModule.mod_PartInfo = elem.ConstructionTablePartName!;
					shelftopModule.mod_EdgeFrontType = retTop.EdgeTypeFront!;
					shelftopModule.mod_EdgeLeftType = retTop.EdgeTypeLeft!;
					shelftopModule.mod_EdgeBackType = retTop.EdgeTypeBack!;
					shelftopModule.mod_EdgeRightType = retTop.EdgeTypeRight!;
					shelftopModule.mod_EdgeJointType = retTop.EdgeJointType;

					// setOrigin
					shelftopModule.setOrigin(retTop.WidthPos(m, lastBwPos), hgtPos, retTop.DepthPos(m, tmpSpaceBack));
				}
			}

			//==========================================================================================
			// CarcaseShelftop03 (Fittings for Frontconnection)
			//==========================================================================================

			if (elem.UsedModule == "mc_CarcaseShelftop03") {

				// Add the module
				//-------------------------------------------------------------------------------------
				if (elem.InsertModule) {
					shelftopModule = m.addOD_M_mc_StorageunitShelftop03();

					// Set values to the attributes of the child
					shelftopModule.mod_ShelftopConstruction = elem.Construction!;
					shelftopModule.mod_PartInfo = elem.ConstructionTablePartName!;
				}
			}

			//==========================================================================================
			// CarcaseShelftop04 (Sloped Cabinet)
			//==========================================================================================

			if (elem.UsedModule == "mc_CarcaseShelftop04") {

				// Calculation of the part settings
				//-------------------------------------------------------------------------------------

				// Get CarcaseBackwallSettings to use as PartBack in CCK_StorageUnit
				let ccKBw = GlobalFunc.find_CarcaseBackwallSettings(lastBwCon)!;

				// Check the situation on the frontside and backside of the cabinet
				let partBack = 'n.a.';
				let partFront = 'n.a.';

				// Backside of the carcase
				if (elem.BacksideRelevant) {
					if (m.mod_SlopeAngle != 0) {
						// Read Settings table
						let slopedCeilingSettings = GlobalFunc.find_SlopedCeilingSettings(m.mod_SlopedCeilingConstruction!);
						if (elem.ConstructionTablePartName == "part_SlopedCeilingShelftopHor") {
							partBack = slopedCeilingSettings.ShelftopHor_PartBack!;
						}
						else if (elem.ConstructionTablePartName == "part_SlopedCeilingShelftopAngle") {
							partBack = slopedCeilingSettings.ShelftopAngle_PartBack!;
						}
					}
					tmpBwPartTop = elem.Construction!;
				}

				// Frontside of the carcase
				if (elem.FrontsideRelevant) {
					if (m.mod_SlopeAngle != 0) {
						// Read Settings table
						let slopedCeilingSettings = GlobalFunc.find_SlopedCeilingSettings(m.mod_SlopedCeilingConstruction!);
						if (elem.ConstructionTablePartName == "part_SlopedCeilingShelftopAngle") {
							partFront = slopedCeilingSettings.ShelftopAngle_PartFront!;
						}
						else if (m.mod_FingergripTop) {
							partFront = "Fingergrip";
						}
						else {
							partFront = "Overlayed";
						}
					}
				}


				// Get StorageunitConstruction
				//-------------------------------------------------------------------------------------

				retTop = GlobalFunc.find_StorageunitConstruction(
					elem.ConstructionTablePartName!,
					m.mod_CarcaseConnectionLeftTop,
					m.mod_CarcaseConnectionLeftBtm,
					m.mod_CarcaseConnectionRightBtm,
					m.mod_CarcaseConnectionRightTop,
					partBack,
					partFront,
					m.mod_CarcaseVisTop,
					tmpAdditionalInfo01
				);

				// Height position
				let hgtPos = retTop.HeightPos(m, frontHeight);

				// Adjustment of the SpaceTop
				if (elem.FrontsideRelevant && tmpSpaceTop > hgtPos || tmpSpaceTop == 0) {
					tmpSpaceTop = hgtPos;
				}

				// Add the module
				//-------------------------------------------------------------------------------------
				
				if (elem.InsertModule) {
					
					shelftopModule = m.addOD_M_mc_StorageunitShelftop04();

					// Set values to the attributes of the child
					shelftopModule.mod_Height = retTop.Height(m, frontHeight);
					shelftopModule.mod_Width = retTop.Width(m, lastBwPos);
					shelftopModule.mod_Depth = retTop.Depth(m, lastBwPos);
					shelftopModule.mod_ShelftopConstruction = elem.Construction!;
					shelftopModule.mod_PartInfo = elem.ConstructionTablePartName!;
					shelftopModule.mod_EdgeFrontType = retTop.EdgeTypeFront!;
					shelftopModule.mod_EdgeLeftType = retTop.EdgeTypeLeft!;
					shelftopModule.mod_EdgeBackType = retTop.EdgeTypeBack!;
					shelftopModule.mod_EdgeRightType = retTop.EdgeTypeRight!;
					shelftopModule.mod_EdgeJointType = retTop.EdgeJointType;

					// setOrigin
					shelftopModule.setOrigin(retTop.WidthPos(m, lastBwPos), hgtPos - correction, retTop.DepthPos(m, lastBwPos));
						
				}

				// Validate DepthPosition
				let depthPosition = retTop.DepthPos(m, lastBwPos);
				if (depthPosition < 0) {
					logError(GlobalFunc.find_ErrorList('Error 22027', 1).Message(elem.ConstructionTablePartName!));
				}

				// Define front side position of the top shelf (to calculate the free space)
				if (elem.FrontsideRelevant) {
					tmpTopPosFront = (m.mod_FingergripTop) ? m.mod_CarcaseDepth : retTop.Depth(m, lastBwPos) + retTop.DepthPos(m, lastBwPos);
				}

				if (elem.BacksideRelevant && tmpBwPartTop != "n.a.") {

					// Define back side position of the top shelf
					tmpTopPosBack = (ccKBw.ConstructionBackwallTop != "Overlayed") ? -10 : retTop.DepthPos(m, lastBwPos);

					// Define backwall topside position relative to TopShelf (to calculate backwall height)
					tmpBwTop = hgtPos;
				}
			}
		}

		//##########################################################################################
		// Custom solutions (User Exit)
		//##########################################################################################

		else {


		}
	})

	//##########################################################################################
	// Return the needed data to the carcase
	//##########################################################################################

	shelfTopInfo.BwTop = tmpBwTop;
	shelfTopInfo.SpaceTop = tmpSpaceTop;
	shelfTopInfo.SpaceBack = tmpSpaceBack;
	shelfTopInfo.TopPosBack = tmpTopPosBack;
	shelfTopInfo.TopPosFront = tmpTopPosFront;
	shelfTopInfo.TopPart = tmpBwPartTop;

	shelfTopInfo.Height = retTop.Height(m, lastBwPos);
	shelfTopInfo.Width = retTop.Width(m, lastBwPos);
	shelfTopInfo.Depth = retTop.Depth(m, lastBwPos);
	shelfTopInfo.WidthPos = retTop.WidthPos(m, lastBwPos);
	shelfTopInfo.HeightPos = retTop.HeightPos(m, lastBwPos);
	shelfTopInfo.DepthPos = retTop.DepthPos(m, lastBwPos);

	return JSON.stringify(shelfTopInfo);

}