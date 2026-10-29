
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

  let Elem = this.addpart_MirrorBoardGroup(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_MirrorBoardThickness);
  this.createPartGroup(this.mod_MirrorBoardId, Elem);
  Elem.pa_BomId = this.mod_MirrorBoardId;

  //===================================================
  //          Add board panel
  //===================================================

  Elem = this.addpart_MirrorBoard(0,0,0,this.mod_Width, this.mod_Height, this.mod_MirrorBoardThickness);
  this.assignPartGroup(this.mod_MirrorBoardId, Elem);
  GlobalFunc.process_AddMaterial(Elem, 'backwall', this.mod_MirrorBoardColor, this.mod_MirrorBoardColor, this.mod_MirrorBoardColor, this.mod_MirrorBoardColor, 'front', false, false);
