// Schuler Consulting
// Create: Feb 2024
// By Henning Wiesbrock
// Purpose: CabinetLibrary
//
// Description:
// CreateBuildPlan of mc_ShelfadjWood01
// Add the adjustable shelves
//
// Revisions:
// 
//===================================================
//
//===================================================
//          Adjustable shelf
//===================================================

// Insert adjustable shelf
let Elem=this.addpart_ShelfadjGlass(0,0,0,this.mod_Width,this.mod_ShelfadjThk,this.mod_Depth);
  this.assignPartGroup(this.mod_CarcaseId, Elem);

  GlobalFunc.process_AddMaterialCarcase(Elem, this, 'shelfadj', false, false, 'None');
