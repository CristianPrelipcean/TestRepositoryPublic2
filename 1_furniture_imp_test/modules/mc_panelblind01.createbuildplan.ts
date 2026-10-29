  // Schuler Consulting
  // Create: Feb 2024
  // By Joao Lisboa
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_Panelblind
  // Add the Blind Front panel
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add the Blind Front panel
  //===================================================

  let Elem = this.addpart_Panelblind(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
  GlobalFunc.process_AddMaterialCarcase(Elem, this, 'panelblind', false, false, 'back');
  this.assignPartGroup(this.mod_CarcaseId,Elem);