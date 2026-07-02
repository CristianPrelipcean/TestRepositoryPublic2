
	// Schuler Consulting
	// Create: March 2025
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of mr_Hood
	// Add the graphic of the hood
	//
	//
	// Revisions:
	//
  //===================================================================================

	// Get the data from the table
	const hoodSupplier = this.mod_HoodSupplier === 'None' ||this.mod_HoodId === 'None' ? 'None' : this.mod_HoodSupplier;
	const hoodId = this.mod_HoodSupplier === 'None' || this.mod_HoodId === 'None' ? 'None' : this.mod_HoodId;
	let HoodData = GlobalFunc.find_HoodMapping(hoodSupplier, hoodId);

  // Add the module
  let Hood = this.addOD_M_mc_ApplianceGraphic();

  // Set attributes
  Hood.mod_GraphicId = HoodData.GraphicId;

  // Set origin
  Hood.setOrigin(0, 0, 0);

	//===================================================
	//          Call the UserExit of this module
	//===================================================

	let retInfo = GlobalFunc.ue_Hood(this);
