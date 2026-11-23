// Schuler Consulting
// Create: Feb 2024
// By Reto Schuler
// Purpose: CabinetLibrary
//
// Description:
// CreateBuildPlan of mc_ShelfadjDivers01
// Add the adjustable shelves
//
// Revisions:
// 
//===================================================
//
//===================================================
//          Adjustable shelf
//===================================================
 //const adjShelfDiversInfo = GlobalFunc.process_ShelfadjDivers01(this.mod_ShelfadjDesign);

// Insert adjustable shelf
let Elem=this.addpart_ShelfadjDivers(0,0,0,this.mod_Width,5,this.mod_Depth);
  this.assignPartGroup(this.mod_CarcaseId, Elem);

 // GlobalFunc.process_AddMaterialCarcase(Elem, this, 'shelfadj', false, false, 'None');