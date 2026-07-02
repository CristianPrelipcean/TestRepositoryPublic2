
  // Schuler Consulting
  // Create: April 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_BaseunitFridge
  // Add Partgroup for the BaseunitFridge
  // Add the opening for the BaseunitFridge
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add Partgroup for the BaseunitFridge
  //===================================================

  let Elem = this.addpart_ApplianceUnit(0, 0, 0, this.mod_FrontWidth, this.mod_FrontHeight, this.mod_FrontThk);
  this.createPartGroup(this.mod_FrontId, Elem);

  //===================================================
  //          Add the opening for the BaseunitFridge
  //===================================================

  let nameOfOpenGroup = this.mod_FrontId;
  let openGrp = this.createOpenGroup(nameOfOpenGroup, Elem);

  let matrix = new Matrix4();
  matrix.setPosition(0, 0, 0);
  openGrp.openMatrix = matrix;
