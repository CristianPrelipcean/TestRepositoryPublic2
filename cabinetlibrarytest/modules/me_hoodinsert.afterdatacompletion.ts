
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

  // Information of the hood
  const hoodInformation = JSON.parse(this.mod_HoodInformation);
  const hoodAssInfo = hoodInformation.HoodAssemblyInfo;
  const hoodCarcaseInfo = hoodInformation.HoodCarcaseAssemblyInfo;

  let hoodDepth = hoodAssInfo.Depth;
  let hoodPos = hoodCarcaseInfo.FrontOffset;

  // include minimal Back-Space
  let hoodPosition = hoodDepth + 10;


  // Set attributes of the child
  Graphic.mod_GraphicId = this.mod_HoodId;

  // SetOrigin
  //Graphic.setOrigin(this.mod_CarcaseWidth/2, 0, this.mod_CarcaseDepth-2);
  Graphic.setOrigin(this.mod_CarcaseWidth/2, 0, hoodPosition);
 