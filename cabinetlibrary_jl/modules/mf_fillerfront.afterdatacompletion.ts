

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
	// 27.09.2024 Ludwig Weber
	// Add functionality for "automatic" to read from table DoorSettings
	// Add Section Calculations (Create Arrays for all attributes)
	// Change Section Add module for the door completly because of arrays
	//===================================================

	//===================================================
	//          Calculations
	//===================================================

	// Get the Information of the Carcase Parts Info (to provide to hinges)
	let carcasePartInfo = JSON.parse(this.mod_CarcasePartInfo[0]);

	// Helper function for the error handling
	function checkDoorData(data: any) {
		for (const prop in data) {
			if (data[prop] === undefined) {
				throw new Error('FillerFront cannot be inserted. Incomplete data!');
			}
		}
	}

	// Try to insert the door
	try {
	
		// Get the Information about the doors
		let fillerInfo = GlobalFunc.process_Door(this);

		// Error handling
		if (fillerInfo === undefined || !fillerInfo.configValid) {
			throw new Error('Door cannot be inserted. Incomplete door data!');
		}
		checkDoorData(fillerInfo);

		//===================================================
		//          Add module for the door
		//===================================================

		if (fillerInfo.configValid) {

			//If the number of Vertical Parts of the mf_door equals the number of doors it means there's no VertDivider between the doors and we need to add one value for NoVertDivider
			if (carcasePartInfo.VerticalPartsType.length == fillerInfo.DoorQty) {
				carcasePartInfo.VerticalPartsType.splice(1, 0, 'NoVertDivider');
				carcasePartInfo.VerticalPartsPosX.splice(1, 0, 0);
				carcasePartInfo.VerticalPartsPosZ.splice(1, 0, 0);
				carcasePartInfo.VerticalPartsDimX.splice(1, 0, 0);
				carcasePartInfo.VerticalPartsDimZ.splice(1, 0, 0);
				carcasePartInfo.VerticalPartsFrontAngle.splice(1, 0, 0);
			}

			let PositionDoor = 0;
			for (let i = 1; i <= fillerInfo.DoorQty; i++) {

				// Add the module
				let Filler = this.addOD_M_mc_FillerFront01();

				// Set attributes of the childs
				Filler.mod_FrontId = this.mod_FrontId + i;
				Filler.mod_FrontWidth = fillerInfo.FrontWidthList[i - 1];
				Filler.mod_DoorDirection = fillerInfo.DoorDirection[i - 1];

				let VerticalPartsType: string[] = [];
				VerticalPartsType.push(carcasePartInfo.VerticalPartsType[i - 1]);
				VerticalPartsType.push(carcasePartInfo.VerticalPartsType[i]);

				let VerticalPartsPosX: number[] = [];
				VerticalPartsPosX.push(carcasePartInfo.VerticalPartsPosX[i - 1]);
				VerticalPartsPosX.push(carcasePartInfo.VerticalPartsPosX[i]);

				let VerticalPartsPosZ: number[] = [];
				VerticalPartsPosZ.push(carcasePartInfo.VerticalPartsPosZ[i - 1]);
				VerticalPartsPosZ.push(carcasePartInfo.VerticalPartsPosZ[i]);

				let VerticalPartsDimX: number[] = [];
				VerticalPartsDimX.push(carcasePartInfo.VerticalPartsDimX[i - 1]);
				VerticalPartsDimX.push(carcasePartInfo.VerticalPartsDimX[i]);

				let VerticalPartsDimZ: number[] = [];
				VerticalPartsDimZ.push(carcasePartInfo.VerticalPartsDimZ[i - 1]);
				VerticalPartsDimZ.push(carcasePartInfo.VerticalPartsDimZ[i]);

				let VerticalPartsFrontAngle: number[] = [];
				VerticalPartsFrontAngle.push(carcasePartInfo.VerticalPartsFrontAngle[i - 1]);
				VerticalPartsFrontAngle.push(carcasePartInfo.VerticalPartsFrontAngle[i]);

				let CarcasePartInfoPerFront: any = {
					HorizontalPartsType: carcasePartInfo.HorizontalPartsType,
					HorizontalPartsPosY: carcasePartInfo.HorizontalPartsPosY,
					HorizontalPartsPosZ: carcasePartInfo.HorizontalPartsPosZ,
					HorizontalPartsDimY: carcasePartInfo.HorizontalPartsDimY,
					HorizontalPartsDimZ: carcasePartInfo.HorizontalPartsDimZ,
					HorizontalPartsFrontAngle: carcasePartInfo.HorizontalPartsFrontAngle,
					VerticalPartsType: VerticalPartsType,
					VerticalPartsPosX: VerticalPartsPosX,
					VerticalPartsPosZ: VerticalPartsPosZ,
					VerticalPartsDimX: VerticalPartsDimX,
					VerticalPartsDimZ: VerticalPartsDimZ,
					VerticalPartsFrontAngle: VerticalPartsFrontAngle
				};

				let CarcasePartInfoPerFrontJson = JSON.stringify(CarcasePartInfoPerFront);
				Filler.mod_CarcasePartInfo.push(CarcasePartInfoPerFrontJson);

				// Set Origin
				Filler.setOrigin(PositionDoor, 0, this.mod_FrontGapCarcase);
				Filler.mod_Originpos.push(this.mod_Originpos[0] + PositionDoor);
				Filler.mod_Originpos.push(this.mod_Originpos[1]);
				Filler.mod_Originpos.push(this.mod_Originpos[2] + this.mod_FrontGapCarcase);
				PositionDoor += fillerInfo.FrontWidthList[i - 1];
			}
		}
	}

	catch (error: any) { // Failed to insert the Door
		logError('mf_FillerFront - AfterDatacompletion: ' + error.message);
	}



