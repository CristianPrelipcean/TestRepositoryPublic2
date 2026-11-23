
	// Create: Oct 2026
	// By Joao Lisboa
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of me_Appliance
	// Add the graphic for the Appliance
	//
	// Revisions:
	//
  //===================================================================================

  //===================================================================================
	// Get data from the table
  //===================================================================================

  let ApplianceInfo = GlobalFunc.find_ApplianceMapping(this.mod_ApplianceSupplier,this.mod_ApplianceId);

	//===================================================================================
	// Add the construction module
  //===================================================================================

  // Add the module
  let appliance = this.addOD_M_mc_ApplianceGraphic();

  // Set attributes
	appliance.mod_GraphicId = ApplianceInfo.GraphicId;

  // Set origin
	appliance.setOrigin(0, 0, 0);
  