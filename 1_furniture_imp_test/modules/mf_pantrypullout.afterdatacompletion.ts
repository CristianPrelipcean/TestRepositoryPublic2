
  // Schuler Consulting
  // Create: Nov 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mf_PantryPullout
  // Add module for the PantryPullout
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add module for Pullout
  //===================================================

  // Add the module
  let Elem = this.addOD_M_mc_PantryPullout01();
  Elem.setOrigin(0, 0, this.mod_FrontGapCarcase);

  //===================================================
  //          Set values to the attributes of the child
  //===================================================

  // Front Width
  Elem.mod_FrontWidth = this.mod_FrontWidth;
  Elem.mod_Originpos.push(this.mod_Originpos[0]);
  Elem.mod_Originpos.push(this.mod_Originpos[1]);
  Elem.mod_Originpos.push(this.mod_Originpos[2] + this.mod_FrontGapCarcase);
  Elem.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);
