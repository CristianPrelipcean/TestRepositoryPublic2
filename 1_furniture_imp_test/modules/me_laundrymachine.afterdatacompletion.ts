  // Create: Nov 2025
	// By Joao Lisboa
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of me_LaundryMachine
	// Add the graphic for the LaundryMachine
	//
	// Revisions:
	//
  //===================================================================================

  //===================================================================================
	// Get data from the table
  //===================================================================================

  let landryMachineInfo = GlobalFunc.find_LaundryMachineMapping(this.mod_LaundryMachineSupplier,this.mod_LaundryMachineId);

	//===================================================================================
	// Add the construction module
  //===================================================================================

  // Add the module
  let laundryMachine = this.addOD_M_mc_ApplianceGraphic();

  // Set attributes
  laundryMachine.mod_GraphicId = landryMachineInfo.GraphicId;

  // Set origin
  laundryMachine.setOrigin(0, 0, 0);