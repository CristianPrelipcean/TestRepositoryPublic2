
  // Schuler Consulting
  // Create: Nov 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_PantryPullout01
  // Add Partgroup for the PantryPullout
  // Add the opening for the PantryPullout
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add Partgroup for the PantryPullout
  //===================================================

  let PulloutUnit=this.addpart_PantryPulloutUnit(0,0,0,this.mod_FrontWidth,this.mod_FrontHeight,this.mod_CarcaseDepth);
  this.createPartGroup(this.mod_FrontId, PulloutUnit);

  //===================================================
  //          Add the opening for the PantryPullout
  //===================================================

  let nameOfOpenGroup = this.mod_FrontId;
  let openGrp = this.createOpenGroup(nameOfOpenGroup,PulloutUnit);

  let matrix = new Matrix4();
  matrix.setPosition(0, 0, this.mod_DrawerOpeningDistance || 250);
  openGrp.openMatrix = matrix;
