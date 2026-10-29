
  // Schuler Consulting
  // Create: Dec 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // Add mirror panel
  //
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add board panel
  //===================================================

  let Elem = this.addpart_Mirror(0, 0, 0, this.mod_MirrorWidth, this.mod_MirrorHeight, this.mod_MirrorThickness);
  this.assignPartGroup(this.mod_FrontId, Elem);
  GlobalFunc.process_AddMaterial(Elem, 'backwall', this.mod_MirrorColor, this.mod_MirrorColor, this.mod_MirrorColor, this.mod_MirrorColor, 'front', false, false);
  