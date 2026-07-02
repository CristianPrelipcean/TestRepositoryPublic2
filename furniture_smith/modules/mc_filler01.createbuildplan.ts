
  // Schuler Consulting
  // Create: April 2026
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_Filler01
  // Add PartGroup for the filler
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add PartGroup for the filler
  //===================================================

  const fillerUnit=this.addpart_FillerUnit(0,0,0,this.mod_Width,this.mod_Height,this.mod_Depth);
  this.createPartGroup(this.mod_FrontId, fillerUnit);
