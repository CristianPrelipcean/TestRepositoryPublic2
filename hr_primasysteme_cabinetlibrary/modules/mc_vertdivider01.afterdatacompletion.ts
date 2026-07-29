
  // Schuler Consulting
  // Create: Aug 2024
  // By Henning Wiesbrock
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mc_VertDivider
  // Add module for the cleat vertical
  // Add module for the side panel middle
  //
  //
  // Revisions:
  //
  //===================================================

  //===================================================
  //          Add module for the cleat vertical
  //===================================================

  if (this.mod_VertDividerType == "Cleat") {

    // Add the module
    let vertDevider = this.addOD_M_mc_CleatVert01();

    // Set values to the attributes of the Cleat Vert
    vertDevider.mod_Height = this.mod_Height;
    vertDevider.mod_Width = this.mod_Width;
    vertDevider.mod_Depth = this.mod_Depth;
  }

  //===================================================
  //         Add module for the side panel middle
  //===================================================

  else {

    // Add the module
    let vertDevider = this.addOD_M_mc_StorageunitSidepanel01();

    // Set values to the attributes of the side panel middle
    vertDevider.mod_Height = this.mod_Height;
    vertDevider.mod_Width = this.mod_Width;
    vertDevider.mod_Depth = this.mod_Depth;
    vertDevider.mod_SidepanelType = 'Middle'
  }
  
