
  // Schuler Consulting
	// Create: Dec 2025
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of mc_MirrorBoard
	// Add Mirror module as child
	//
	// Revisions:
	//
	//===================================================

	//===================================================
	//          Add construction module
  //===================================================

  // Add the module
  const child = this.addOD_M_mc_Mirror();

  // Set attributes of the child
  child.mod_FrontId = this.mod_MirrorBoardId;

	// SetOrigin
  child.setOrigin(this.mod_MirrorPositionWidth, this.mod_MirrorPositionHeight, this.mod_MirrorBoardThickness)
  