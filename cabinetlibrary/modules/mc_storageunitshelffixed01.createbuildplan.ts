  // Schuler Consulting
  // Create: Nov 2022
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // Add the fixed shelf including all parts of construction
  // 
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add the fixed shelf
  //===================================================

  let Elem = this.addpart_Shelffixed(0, 0, 0, this.mod_Width, this.mod_ShelffixedThk, this.mod_Depth);
  this.assignPartGroup(this.mod_CarcaseId,Elem);

  GlobalFunc.process_AddMaterialCarcase(Elem, this, 'shelf', false, false, 'None');