
  // Schuler Consulting
  // Create: April 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_Dishwasher
  // Add Partgroup for the dishwasher
  // Add the opening for the dishwasher
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add Partgroup for the drawer
  //===================================================

  let Elem = this.addpart_ApplianceUnit(0, 0, 0, this.mod_FrontWidth, this.mod_FrontHeight, this.mod_FrontThk);
  this.createPartGroup(this.mod_FrontId, Elem);

  //===================================================
  //          Add the opening for the drawer
  //===================================================

  let nameOfOpenGroup = this.mod_FrontId;
  let openGrp = this.createOpenGroup(nameOfOpenGroup, Elem);

  let matrix = new Matrix4();
  matrix.setPosition(0, 0, 0);
  openGrp.openMatrix = matrix;

  //===================================================
  //          Fake Part to move the dishwasher
  //          This is necessary because the docking doesn't work without
  //===================================================

  this.addpart_DropZone(0, -this.mod_Originpos[1], 0, 0, 0, 0);
