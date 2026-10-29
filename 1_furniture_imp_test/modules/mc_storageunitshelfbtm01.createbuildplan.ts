  // Schuler Consulting
  // Create: Nov 2022
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_StorageUnitSide
  // Add the bottom shelf including all parts of construction
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add the bottom shelf
  //===================================================

  let Elem = this.addpart_Shelfbtm(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
  this.assignPartGroup(this.mod_CarcaseId, Elem);

  GlobalFunc.process_AddMaterialCarcase(Elem, this, 'shelf', false, this.mod_CarcaseVisBtm, 'top');