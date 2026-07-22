
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

  //===================================================================================
  // Get the data from the table
  //===================================================================================

  let hoodSupplier = this.mod_HoodSupplier;
  let hoodId       = this.mod_HoodId;

  // Normalize invalid values
  if (hoodSupplier === 'None' || hoodId === 'None') {
    hoodSupplier = 'None';
    hoodId = 'None';
  }

  // Try to get hood mapping
  let HoodData = GlobalFunc.find_HoodMapping(hoodSupplier, hoodId);

  // Fallback: try None / None
  if (!HoodData) {
    HoodData = GlobalFunc.find_HoodMapping('None', 'None');
  }

  // If still no data → do NOT add Hood module
  if (!HoodData) {
    return;
  }

  //===================================================================================
  // Add the module
  //===================================================================================

  const Hood = this.addOD_M_mc_ApplianceGraphic();

  // Set attributes
  Hood.mod_GraphicId = HoodData.GraphicId;

  // Set origin
  Hood.setOrigin(0, 0, 0);

  //===================================================================================
  // Call the UserExit of this module
  //===================================================================================

  GlobalFunc.ue_Hood(this);
