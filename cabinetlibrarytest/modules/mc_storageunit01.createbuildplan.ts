// Schuler Consulting
// Create: Aug 2022
// By Ludwig Weber
// Purpose: CabinetLibrary
//
// Description:
// CreateBuildPlan of mc_Storageunit
// Add PartGroup for the carcase and also create the box
//
// Revisions:
// 
//===================================================

//===================================================
//          Add PartGroup for the carcase and also create the box
//===================================================

let Storageunit=this.addpart_Storageunit(0,0,0,this.mod_CarcaseWidth,this.mod_CarcaseHeight,this.mod_CarcaseDepth);
this.createPartGroup(this.mod_CarcaseId, Storageunit);