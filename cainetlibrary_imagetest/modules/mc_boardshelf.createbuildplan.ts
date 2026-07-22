
  // Schuler Consulting
  // Create: Dec 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // Add board shelf
  //
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add board shelf
  //===================================================

  const Elem = this.addpart_BoardShelf(0, 0, 0, this.mod_BoardShelfWidth, this.mod_BoardShelfThickness, this.mod_BoardShelfDepth);
  this.assignPartGroup(this.mod_FrontId, Elem);
  GlobalFunc.process_AddMaterial(Elem, 'shelf', this.mod_BoardShelfColor, this.mod_BoardShelfColor, this.mod_BoardShelfColor, this.mod_BoardShelfColor, 'top', false, false);
  