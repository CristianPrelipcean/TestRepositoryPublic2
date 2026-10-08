  
  // Schuler Consulting
  // Create: March 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_Fixedfront01
  // Add Partgroup for the fixed front
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add Partgroup for the fixed front
  //===================================================

  let Elem=this.addpart_FixedfrontUnit(0,0,0,this.mod_FrontWidth,this.mod_FrontHeight,this.mod_CarcaseDepth);
  this.createPartGroup(this.mod_FrontId, Elem);
