	
		// Schuler Consulting
	// Create: March 2025
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of mf_Oven
	// Add module for Oven Construction
	//
	//
	// Revisions:
	//
	//===================================================================================

	// Create data for the oven
	//-------------------------------------------------------------------------

	const ovenData = JSON.parse(this.mod_Information) as { ovenID: string; ovenPos: number; }[];

	// Add the oven modules
	//-------------------------------------------------------------------------
	
	ovenData.forEach(oven => {
		
		// Add the module
		let Oven = this.addOD_M_mc_Oven01();

		// Set values to the attributes of the child
		Oven.mod_Originpos[0] = this.mod_Originpos[0];
		Oven.mod_Originpos[1] = this.mod_Originpos[1];
		Oven.mod_Originpos[2] = this.mod_Originpos[2];
		Oven.mod_OvenId = oven.ovenID;

		// setOrigin
		Oven.setOrigin(this.mod_CarcaseWidth/2, oven.ovenPos, 0);
		
	});
