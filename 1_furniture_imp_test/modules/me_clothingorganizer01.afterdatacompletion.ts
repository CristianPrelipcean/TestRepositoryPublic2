
  // Create: Feb 2026
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of me_ClothingOrganizer01
  // Add construction module for ClothingOrganzizer
  //
  // Revisions:
  //
  //===================================================================================

  //===================================================================================
  // Get data from the tables
  //===================================================================================

  const coInfo = GlobalFunc.process_ClothingOrganizer(this);

  // Later the app has to move the items per drag & drop
  const movement = 0

  //===================================================================================
  // Add construction module for ClothingOrganzizer
  //===================================================================================

  if (coInfo.IsComplete){

    // Add the module
    const clothingOrganizer = this.addOD_M_mc_ClothingOrganizerHardware01();
    
    // Set the attributes of the child
    clothingOrganizer.mod_Information = JSON.stringify(coInfo);

    // SetOrigin
    clothingOrganizer.setOrigin(0, movement, 0);
  }