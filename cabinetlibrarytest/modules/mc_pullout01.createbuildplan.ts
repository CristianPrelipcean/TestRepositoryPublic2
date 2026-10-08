
  // Schuler Consulting
  // Create: Nov 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_Pullout01
  // Add Partgroup for the Pullout
  // Add the opening for the Pullout
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add Partgroup for the Pullout
  //===================================================

  let DrawerUnit=this.addpart_PulloutUnit(0,0,0,this.mod_FrontWidth,this.mod_FrontHeight,this.mod_CarcaseDepth);
  this.createPartGroup(this.mod_FrontId, DrawerUnit);

  //===================================================
  //          Add the opening for the Pullout
  //===================================================

  let nameOfOpenGroup = this.mod_FrontId;
  let openGrp = this.createOpenGroup(nameOfOpenGroup, DrawerUnit);

  let matrix = new Matrix4();
  matrix.setPosition(0, 0, this.mod_DrawerOpeningDistance || 250);
  openGrp.openMatrix = matrix;
