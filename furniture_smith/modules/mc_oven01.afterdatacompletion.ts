
  // Schuler Consulting
  // Create: March 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mc_Oven01
  // Add the graphic for the appliances
  //
  // Revisions:
  //
  //===================================================================================

  //===================================================================================
  // Add the graphic module for appliances
  //===================================================================================

  // Add the module
  let Graphic = this.addOD_M_mc_ApplianceGraphic();

  // Set the attributes
  Graphic.mod_GraphicId = this.mod_OvenId;

  // Set origin
  Graphic.setOrigin(0, 0, 0);
