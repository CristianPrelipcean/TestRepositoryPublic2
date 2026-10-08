  // Schuler Consulting
  // Create: May 2025
  // By Joao Lisboa
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_Cornerunit01t
  // Add PartGroup for the carcase and also create the box
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add PartGroup for the carcase and also create the box
  //===================================================

  let Storageunit=this.addpart_Cornerunit(0,0,0,this.mod_TotalDimLeft,this.mod_TotalDimRight,this.mod_Height);
  this.createPartGroup(this.mod_CarcaseId, Storageunit);