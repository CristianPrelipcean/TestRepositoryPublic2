  // Schuler Consulting
  // Create: July 2024
  // By Henning Wiesbrock
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_RackArea01
  // Add Partgroup for the rack area
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add Partgroup for the rack area
  //===================================================

  let RackAreaUnit = this.addpart_RackAreaUnit(0, 0, 0, this.mod_FrontWidth, this.mod_FrontHeight, this.mod_FrontThk);
  this.createPartGroup(this.mod_FrontId, RackAreaUnit);