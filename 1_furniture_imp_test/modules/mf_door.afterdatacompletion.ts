
	// Create: August 2023
	// By Stefano Cortese
	// Purpose: CabinetLibrary
	//
	// Description:
	// Calculations for automatic / DoorSettings
	// AfterDataCompletion of mf_Door
	// Add module for doors
	// Add module for adjustable shelves
	//
	// Revisions:
	// 09.2024 Ludwig Weber
	// Add functionality for "automatic" to read from table DoorSettings
	// Add Section Calculations (Create Arrays for all attributes)
	// Change Section Add module for the door completly because of arrays
	//
	// 09.2025 Anni Chen
	// Add docking of equimpent modules
	// Add automatism to insert the adjustable shelves
	//===================================================

	//===================================================
	//          Calculations
	//===================================================

	// Get the FreeSpace and StartPosition
	const CarcaseSpaceDimension = JSON.parse(this.mod_CarcaseSpaceDimension[0]);

	// Get the Information of the Carcase Parts Info (to provide to hinges)
	const carcasePartInfo = JSON.parse(this.mod_CarcasePartInfo[0]);

	// Get the Information of the VertDividerInfoList (mod_VertDividerInfoList) (will be used for the adjustable shelves)
	const VertDividerInfoList = JSON.parse(this.mod_VertDividerInfoList[0]);
	const vertDividerType = VertDividerInfoList.Type;

	// Helper function for the error handling
	function checkDoorData(data: any) {
		for (const prop in data) {
			if (data[prop] === undefined) {
				throw new Error('Door cannot be inserted. Incomplete door data!');
			}
		}
	}

	// Try to insert the door
	try {

		// Get the Information about the doors
		const doorInfo = JSON.parse(this.mod_Information);

		// Error handling
		if (doorInfo === undefined || !doorInfo.configValid) {
			throw new Error('Door cannot be inserted. Incomplete door data!');
		}
		checkDoorData(doorInfo);

		//===================================================
		//          Add module for the door
		//===================================================

		if (doorInfo.configValid) {

			// If the number of Vertical Parts of the mf_door equals the number of doors it means there's no VertDivider 
			// between the doors and we need to add one value for NoVertDivider
			//-------------------------------------------------------------------------
			if (carcasePartInfo.VerticalPartsType.length == doorInfo.DoorQty) {
				carcasePartInfo.VerticalPartsType.splice(1, 0, 'NoVertDivider');
				carcasePartInfo.VerticalPartsPosX.splice(1, 0, 0);
				carcasePartInfo.VerticalPartsPosZ.splice(1, 0, 0);
				carcasePartInfo.VerticalPartsDimX.splice(1, 0, 0);
				carcasePartInfo.VerticalPartsDimZ.splice(1, 0, 0);
				carcasePartInfo.VerticalPartsFrontAngle.splice(1, 0, 0);
			}
			let PositionDoor = 0;

			// Loop through all doors and create one door module per iteration.
			//-------------------------------------------------------------------------
			for (let i = 1; i <= doorInfo.DoorQty; i++) {

				// Add the module
				const Door = this.addOD_M_mc_Door01();

				// Set attributes of the childs
				Door.mod_FrontId = this.mod_FrontId + i;
				Door.mod_FrontWidth = doorInfo.FrontWidthList[i - 1];
				Door.mod_DoorDirection = doorInfo.DoorDirection[i - 1];
				Door.mod_HandlePosMatrix = doorInfo.HandleMatrixList[i - 1];
				Door.mod_VertDividerType = doorInfo.VertDividerList[i - 1];
				Door.mod_InteriorEquipmentHinge = 'All';
				Door.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);

				// Manage oversize per door
				const isFirstDoor = i === 1;
				const isLastDoor = i === doorInfo.DoorQty;
				Door.mod_FrontOversizeLeft = isFirstDoor ? Door.mod_FrontOversizeLeft : 0;
				Door.mod_FrontOversizeRight = isLastDoor ? Door.mod_FrontOversizeRight : 0;

				// Manage the handle matrix
				if (i === 1 && doorInfo.DoorQty > 1) {
					Door.mod_HandlePosMatrix = this.mod_HandlePosMatrixMultiple_matrix.FirstMatrix;
				}
				else if (i === 2) {
					Door.mod_HandlePosMatrix = this.mod_HandlePosMatrixMultiple_matrix.SecondMatrix;
				}
				else {
					Door.mod_HandlePosMatrix = this.mod_HandlePosMatrix;
				}

				// Build a new object for carcase part info per front
				//---------------------------------------------------
				const CarcasePartInfoPerFront: any = {
					HorizontalPartsType: carcasePartInfo.HorizontalPartsType,
					HorizontalPartsPosY: carcasePartInfo.HorizontalPartsPosY,
					HorizontalPartsPosZ: carcasePartInfo.HorizontalPartsPosZ,
					HorizontalPartsDimY: carcasePartInfo.HorizontalPartsDimY,
					HorizontalPartsDimZ: carcasePartInfo.HorizontalPartsDimZ,
					HorizontalPartsFrontAngle: carcasePartInfo.HorizontalPartsFrontAngle
				};

				// Collect vertical part information dynamically
				// (two vertical parts per door: previous + current)
				// Dynamically copy only the two relevant vertical parts
				//-------------------------------------------------------------------------
				const verticalProps = [
					'VerticalPartsType',
					'VerticalPartsPosX',
					'VerticalPartsPosZ',
					'VerticalPartsDimX',
					'VerticalPartsDimZ',
					'VerticalPartsFrontAngle'
				];
				for (const key of verticalProps) {
					CarcasePartInfoPerFront[key] = [
						carcasePartInfo[key][i - 1],
						carcasePartInfo[key][i]
					];
				}

				// Serialize the modified CarcasePartInfo for use in child modules
				//-------------------------------------------------------------------------
				Door.mod_CarcasePartInfo.push(JSON.stringify(CarcasePartInfoPerFront));

				// SetOrigin of the door
				//-------------------------------------------------------------------------
				Door.setOrigin(PositionDoor, 0, this.mod_FrontGapCarcase);
				Door.mod_Originpos.push(this.mod_Originpos[0] + PositionDoor);
				Door.mod_Originpos.push(this.mod_Originpos[1]);
				Door.mod_Originpos.push(this.mod_Originpos[2] + this.mod_FrontGapCarcase);

				PositionDoor += doorInfo.FrontWidthList[i - 1];
			}
		}
	}

	// Error handling (door insertion failed)
	catch (error: any) { 
		logError('mf_Door - AfterDatacompletion: ' + error.message);
	}


	//===================================================
	//          Build Compartments (add dividers and create compartments informations)
	//===================================================

	const compartmentsInformation = JSON.parse(GlobalFunc.process_CreateCompartments(this));
	this.mod_CompartmentsInformation.push(JSON.stringify(compartmentsInformation));

	//===================================================
	//          Find Equipment Docked
	//===================================================

	// Check if an equipment is docked in the cabinet
	let checkEquipmentDocked = false;

	// Cycle through all children of the mf_Door
	this.m.forEach((p, index) => {

		// If there is a shelfadjMultiple
		if (p instanceof OD_M_me_ShelfadjMultiple01) {
			checkEquipmentDocked = true;
/*
			// Limit shelf group height to the available front height
			const shelfadjGroupHeight = p.mod_Height ?? 0;
			const posY = p.mod_ShelfadjGroupPositionY ?? 0;
			const maxHeight = this.mod_FrontHeight - posY;
			if (shelfadjGroupHeight > maxHeight) {
				p.mod_Height = Math.max(0, maxHeight);
			}
*/

			// Limit shelf group height to the available front height
			const shelfadjGroupHeight = p.mod_Height ?? 0;
			const compartmentHeight = p.mod_FreeSpaceY ?? 0;
			const compartmentStartPosY = p.mod_FreeSpaceStartPosY ?? 0;
			const requestedHeight = p.mod_Height ?? 0;
			const posY = p.mod_ShelfadjGroupPositionY ?? 0;
			const maxHeight = compartmentHeight - (posY - compartmentStartPosY)
			if (shelfadjGroupHeight > maxHeight) {
				p.mod_Height = maxHeight;
			}


		}

		// If there is a clothing organzier
		else if (p instanceof OD_M_me_ClothingOrganizer01) {
			checkEquipmentDocked = true;

					//--------------- Calculate the positionY of hardware -----------------------------------
			
			// Limit height position to the available FreeSpace
			const compartmentHeight = p.mod_Height ?? 0;
			const compartmentStartPosY = p.mod_Originpos[1] ?? 0;
			const maxPosHeight = compartmentHeight + compartmentStartPosY;
			const thickness = GlobalFunc.find_ClothingOrganizerInstallationDimensions(p.mod_ClothingOrganizerDesign!)[0].ClothingOrganizerInstallationMinHeight ?? 0;
			const requestedPosition = p.mod_ClothingOrganizerHeightPosition ?? 0;
			if ( requestedPosition + thickness > maxPosHeight) {
				const adjustedPosition = maxPosHeight - thickness;
        p.mod_ClothingOrganizerHeightPosition = Math.max(adjustedPosition, 0);
			}
		}

		// If there is a hood insert
		else if (p instanceof OD_M_me_HoodInsert) {
			checkEquipmentDocked = true;

			p.mod_CarcaseWidth = CarcaseSpaceDimension.WidthFreeSpace;
			p.mod_CarcaseDepth = CarcaseSpaceDimension.DepthFreeSpace;
			p.mod_CarcaseHeight = CarcaseSpaceDimension.HeightFreeSpace;

			// SetOrigin of the child
			p.setOrigin(CarcaseSpaceDimension.WidthFreeStartPos - this.mod_Originpos[0], 0, CarcaseSpaceDimension.DepthFreeStartPos - this.mod_Originpos[2]);
		}

		// If there is a inner drawer group
		else if (p instanceof OD_M_me_InnerDrawerGroup) {
			checkEquipmentDocked = true;
		}

		// If there is a VertDivider (Middle Side Panel)
		else if (p instanceof OD_M_me_Vertdivider01) {
			checkEquipmentDocked = true;
		}

		// If there is a ShelfFixed (Middle Side Panel)
		else if (p instanceof OD_M_me_Shelffixed01) {
			checkEquipmentDocked = true;
		}
	})

	//===================================================
	//          Add module for the adjustable shelf (Standard if no equipment docked)
	//===================================================

	if (!checkEquipmentDocked) {

		// Splitted area behind the door (multiple areas)
		//---------------------------------------------------
		if (VertDividerInfoList.FreeSpaceWidth.length - 1 > 0) {
			for (let i = 1; i <= VertDividerInfoList.FreeSpaceWidth.length - 1; i++) {

				// Add the module
				let shelfadjgroup = this.addOD_M_mc_ShelfadjGroup01();

				// Set the attributes to the child 
				shelfadjgroup.mod_Width = VertDividerInfoList.FreeSpaceWidth[i];
				shelfadjgroup.mod_Depth = CarcaseSpaceDimension.DepthFreeSpace;
				shelfadjgroup.mod_Height = CarcaseSpaceDimension.HeightFreeSpace;
				shelfadjgroup.mod_ShelfadjPartParentName = "Door";
				shelfadjgroup.mod_ShelfadjPartParentType = this.mod_DoorType;
				shelfadjgroup.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);
				shelfadjgroup.mod_VertDividerType = "NoVertDivider";

				// SetOrigin of the child
				shelfadjgroup.setOrigin(VertDividerInfoList.FreeSpaceWidthStartPos[i] - this.mod_Originpos[0], CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1], CarcaseSpaceDimension.DepthFreeStartPos - this.mod_Originpos[2])
			}
		}

		// One complete area behind the door
		//---------------------------------------------------
		else {
			// Add the module
			const shelfadjgroup = this.addOD_M_mc_ShelfadjGroup01();

			// Set the attributes to the child 
			shelfadjgroup.mod_Width = CarcaseSpaceDimension.WidthFreeSpace;
			shelfadjgroup.mod_Depth = CarcaseSpaceDimension.DepthFreeSpace;
			shelfadjgroup.mod_Height = CarcaseSpaceDimension.HeightFreeSpace;
			shelfadjgroup.mod_ShelfadjPartParentName = "Door";
			shelfadjgroup.mod_ShelfadjPartParentType = this.mod_DoorType;
			shelfadjgroup.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);
			shelfadjgroup.mod_VertDividerType = vertDividerType;
			shelfadjgroup.mod_VertDividerPosition = VertDividerInfoList.PosX + VertDividerInfoList.DimX / 2 - CarcaseSpaceDimension.WidthFreeStartPos;

			// SetOrigin of the child
			shelfadjgroup.setOrigin(CarcaseSpaceDimension.WidthFreeStartPos - this.mod_Originpos[0], CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1], CarcaseSpaceDimension.DepthFreeStartPos - this.mod_Originpos[2])
		}
	}