
  // Schuler Consulting
	// Create: Dec 2025
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of mr_CoatBoard
	// Add Construction Module and Docking Infos
	//
	// Revisions:
	//
	//===================================================

	//===================================================
	//          Add construction module
  //===================================================

  // Add the module
  const child = this.addOD_M_mc_BoardShelf();

  // Set attributes of the child
  child.mod_FrontId = this.mod_FrontId;

	// SetOrigin
  child.setOrigin(this.mod_BoardShelfPositionWidth, this.mod_BoardShelfPositionHeight, 0)
  