
  // Create: March 2025
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of mc_Hob01
	// Add the graphic for the hob
	//
	// Revisions:
	//
  //===================================================================================

  //===================================================================================
	// Get data from the table
  //===================================================================================

  let retConstruction = GlobalFunc.find_HobConstruction(this.mod_HobConstructionId);

	//===================================================================================
	// Add the construction module
  //===================================================================================

  // Add the module
  let Hob = this.addOD_M_mc_ApplianceGraphic();

  // Set attributes
  Hob.mod_GraphicId = this.mod_HobGraphicId;

  // Set origin
  Hob.setOrigin(0, 0, 0);
