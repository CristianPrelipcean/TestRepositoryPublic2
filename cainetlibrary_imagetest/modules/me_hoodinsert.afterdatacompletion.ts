
	// HOMAG Digital
	// Create: March 2026
	// By Maximilian Mertens
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of me_HoodInsert
	// Create the HoodData
	// Add the GraphicModule to show the hood
	//
	// Revisions:
	//
  //===============================================================================

  //===============================================================================
  // Create the HoodData
  //===============================================================================

  // Get the graphic Id
  const GraphicID = GlobalFunc.find_HoodMapping(this.mod_HoodSupplier, this.mod_HoodId).GraphicId;

  //===============================================================================
  // Add the GraphicModule to show the hood
  //===============================================================================

  // Add the module
  const Graphic = this.addOD_M_mc_ApplianceGraphic();

  // Set attributes of the child
  Graphic.mod_GraphicId = this.mod_HoodId;

  // SetOrigin
  Graphic.setOrigin(this.mod_CarcaseWidth/2, 0, this.mod_CarcaseDepth);