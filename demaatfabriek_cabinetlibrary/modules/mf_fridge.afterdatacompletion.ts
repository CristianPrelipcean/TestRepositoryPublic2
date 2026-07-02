
	// Create: March 2025
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of mf_Fridge
	// Add modules for doors
	// Add module for the fridge
	// Manage the fixed shelves and the backwalls
	//
	// Revisions:
	//
	//===================================================================================

	//===================================================================================
	// Helper functions
	//===================================================================================

	// Function to add the module for the fridge graphic
	//-------------------------------------------------------------------------

	function AddModule(m: any, fridgeId: string, startingPos: number) {

		// Add the module
		let Fridge = m.addOD_M_mc_Fridge01();
		Fridge.setOrigin(m.mod_CarcaseWidth / 2, startingPos, 0);

		// Set values to the attributes of the child
		Fridge.mod_Originpos[0] = m.mod_Originpos[0];
		Fridge.mod_Originpos[1] = m.mod_Originpos[1];
		Fridge.mod_Originpos[2] = m.mod_Originpos[2];
		Fridge.mod_FridgeGraphicId = fridgeId;

	}

	//===================================================================================
	//          Add module for the door
	//===================================================================================

	// Helper function for the error handling
	//-------------------------------------------------------------------------

	function checkDoorData(data: any) {
		for (const prop in data) {
			if (data[prop] === undefined) {
				throw new Error('Door cannot be inserted. Incomplete door data!');
			}
		}
	}

	// Helper function to insert the door
	//-------------------------------------------------------------------------

	function AddDoor(m: any, doorHeight: number, doorPosition: number, intNmbr: number, intQty: number, startingPos: number = 0) {

		try {

			// Get the Information about the doors
			let doorInfo = GlobalFunc.process_Door(m);

			// Error handling
			if (doorInfo === undefined || !doorInfo.configValid) {
				throw new Error('Door cannot be inserted. Incomplete door data!');
			}
			checkDoorData(doorInfo);

			// If doors are valid insert them
			//-------------------------------------------------------------------------

			if (doorInfo.configValid) {

				// Add the module
				let Door = m.addOD_M_mc_Door01();

				// Manage the hinges
				Door.mod_HingeType = 'NoHinges';

				// Set attributes of the childs
				Door.mod_FrontId = m.mod_FrontId + "_" + intNmbr;
				Door.mod_FrontWidth = doorInfo.FrontWidthList[0];
				Door.mod_DoorDirection = doorInfo.DoorDirection[0];
				Door.mod_HandlePosMatrix = doorInfo.HandleMatrixList[0];
				Door.mod_VertDividerType = 'NoVertDivider';
				Door.mod_InteriorEquipmentHinge = 'All';
				Door.mod_FrontHeight = doorHeight;
				Door.mod_FrontPosStart = doorPosition + startingPos;
				Door.mod_CarcaseSpaceDimension.push(m.mod_CarcaseSpaceDimension[0]);
				Door.mod_CarcasePartInfo.push(m.mod_CarcasePartInfo[0]);

				// Set Origin
				Door.setOrigin(0, doorPosition, m.mod_FrontGapCarcase);
				Door.mod_Originpos.push(m.mod_Originpos[0]);
				Door.mod_Originpos.push(m.mod_Originpos[1] + doorPosition);
				Door.mod_Originpos.push(m.mod_Originpos[2] + m.mod_FrontGapCarcase);

				// Manage the oversize
				if (intQty > 1 && intNmbr === 2) {
					Door.mod_FirstFront = false;
					Door.mod_FrontOversizeBtm = 0;
				}

				if (intQty > 1 && intNmbr === 1) {
					Door.mod_LastFront = false;
					Door.mod_FrontOversizeTop = 0;
				}
			}
		}

		// Failed to insert the Door
		//-------------------------------------------------------------------------

		catch (error: any) {
			logError('mf_Fridge - AfterDatacompletion: ' + error.message);
		}
	}

	//===================================================================================
	//          Main calculations
	//===================================================================================

	// Create data for the fridge
	//-------------------------------------------------------------------------

	// Variables
	let FridgeInfo = JSON.parse(this.mod_FridgeInfo);
	let fridgePos = FridgeInfo.FridgePos;
	let frontHgt1 = FridgeInfo.FrontHgt1;
	let frontHgt2 = FridgeInfo.FrontHgt2;
	let frontPos2 = FridgeInfo.FrontPos2;
	let graphicId = FridgeInfo.GraphicId!

	// Insert the modules
	//-------------------------------------------------------------------------

	if (FridgeInfo.SplitDoor) {

		// Add the doors
		AddDoor(this, frontHgt1, 0, 1, 2, this.mod_Originpos[1]);
		AddDoor(this, frontHgt2, frontPos2, 2, 2, this.mod_Originpos[1] + frontPos2);
	}
	else {

		// Add the door
		AddDoor(this, frontHgt1, 0, 1, 1, this.mod_Originpos[1]);
	}

	// Add the modul for fridge graphic
	AddModule(this, graphicId, fridgePos);