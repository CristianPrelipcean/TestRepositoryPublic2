  
  // Schuler Consulting
  // Create: September 2024
  // By Stefano Cortese
  // CabinetLibrary
  //
  // Description:
  // Creation of the BackSplash
  //
  // Revisions:
  // added group and group id to be able to instantiate from the contours
  // Nov 2025 Jiri Polcar / Ludwig Weber
  // ================================================================

  // Insert the Partgroup
  //-----------------------------------------------------------------

  let BacksplashGroup = this.addpart_BacksplashGroup(0, 0, 0, this.mod_BacksplashWidth, this.mod_BacksplashHeight, this.mod_BacksplashThk);
  this.createPartGroup(this.mod_BacksplashId, BacksplashGroup);
  BacksplashGroup.pa_BomId = this.mod_BacksplashId;

  // Insert the BackSplash
  //-----------------------------------------------------------------

  let FinishPanel = this.addpart_Backsplash(0, 0, 0, this.mod_BacksplashWidth, this.mod_BacksplashHeight, this.mod_BacksplashThk);
  FinishPanel.pa_BomId = this.mod_BacksplashId;
  this.assignPartGroup(this.mod_BacksplashId, FinishPanel);

  GlobalFunc.process_AddMaterial(FinishPanel, 'front', this.mod_BacksplashColor, this.mod_BacksplashColor, this.mod_BacksplashColor, this.mod_BacksplashColor, 'None', false, true);
