
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



  //===================================================================================
  // Add Fixed shelf on Top
  //===================================================================================

  if (this.mod_ShelffixedTop) {
    const clothingOrganizerInstallationDimensions = GlobalFunc.find_ClothingOrganizerInstallationDimensions(this.mod_ClothingOrganizerDesign!);
    let thicknessClothingOrganizer = clothingOrganizerInstallationDimensions[0].ClothingOrganizerInstallationMinHeight ?? 0

    // Add the module
    let fixedShelfTop = this.addOD_M_mc_StorageunitShelffixed01();

    // Set the attributes  
    fixedShelfTop.mod_Width = this.mod_Width;
    fixedShelfTop.mod_Depth = this.mod_Depth;

    // Set origin
    fixedShelfTop.setOrigin(0, movement + this.mod_ClothingOrganizerHeightPosition - this.mod_Originpos[1] + thicknessClothingOrganizer + this.mod_ShelffixedTopDistance, 0);

  }
  

  //===================================================================================
  // Add Fixed shelf on Bottom
  //===================================================================================


  if (this.mod_ShelffixedBtm) {
    // Add the module
    let fixedShelfBottom = this.addOD_M_mc_StorageunitShelffixed01();

    // Set the attributes  
    fixedShelfBottom.mod_Width = this.mod_Width;
    fixedShelfBottom.mod_Depth = this.mod_Depth;

    // Set origin
    fixedShelfBottom.setOrigin(0, movement + this.mod_ClothingOrganizerHeightPosition - this.mod_Originpos[1] - this.mod_ShelffixedBtmDistance - this.mod_ShelffixedThk, 0);

  }



