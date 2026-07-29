  
  // Schuler Consulting
  // Create: Feb 2024
  // By Joao Lisboa
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_CleatVert
  // Add the Cleat Vert
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add the Cleat Vertical
  //===================================================

  let Elem = this.addpart_CleatVert(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
  GlobalFunc.process_AddMaterial(Elem, 'sidepanel', this.mod_CarcaseColor, this.mod_CarcaseOutsideColor, this.mod_CarcaseEdgeColor, this.mod_CarcaseEdgeFrontColor, 'None', false, false);
  this.assignPartGroup(this.mod_CarcaseId,Elem);
