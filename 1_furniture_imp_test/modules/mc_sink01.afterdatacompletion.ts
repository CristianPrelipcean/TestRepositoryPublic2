
  // Create: March 2025
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of mc_Sink01
	// Add the graphic for the sink
	//
	// Revisions:
	//
  //===================================================================================

  //===================================================================================
	// Get data from the table
  //===================================================================================

  let retConstruction = GlobalFunc.find_SinkConstruction(this.mod_SinkConstructionId);

	//===================================================================================
	// Add the construction module
  //===================================================================================

  // Add the module
  let Hob = this.addOD_M_mc_ApplianceGraphic();

  // Set attributes
  Hob.mod_GraphicId = this.mod_SinkGraphicId;

  // Set origin
  Hob.setOrigin(0, 0, 0);
