
  // Schuler Consulting
  // Create: Dec 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // Add PartGroup for the panel and also create the box
  // Add vertical board panel
  //
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add PartGroup 
  //===================================================

  let Elem = this.addpart_CoatBoardGroup(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_CoatBoardThickness);
  this.createPartGroup(this.mod_CoatBoardId, Elem);
  Elem.pa_BomId = this.mod_CoatBoardId;

  //===================================================
  //          Add board panel
  //===================================================

  Elem = this.addpart_CoatBoard(0,0,0,this.mod_Width, this.mod_Height, this.mod_CoatBoardThickness);
  this.assignPartGroup(this.mod_CoatBoardId, Elem);
  GlobalFunc.process_AddMaterial(Elem, 'backwall', this.mod_CoatBoardColor, this.mod_CoatBoardColor, this.mod_CoatBoardColor, this.mod_CoatBoardColor, 'front', false, false);
