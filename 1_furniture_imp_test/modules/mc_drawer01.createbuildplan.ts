// Schuler Consulting
// Create: Nov 2022
// By Ludwig Weber
// Purpose: CabinetLibrary
//
// Description:
// CreateBuildPlan of mc_Drawer01
// Add Partgroup for the drawer
// Add the opening for the drawer
//
// Revisions:
// 
//===================================================

//===================================================
//          Add Partgroup for the drawer
//===================================================

let DrawerUnit=this.addpart_DrawerUnit(0,0,0,this.mod_FrontWidth,this.mod_FrontHeight,this.mod_CarcaseDepth);
this.createPartGroup(this.mod_FrontId, DrawerUnit);

//===================================================
//          Add the opening for the drawer
//===================================================

let nameOfOpenGroup = this.mod_FrontId;
let openGrp = this.createOpenGroup(nameOfOpenGroup, DrawerUnit);

let matrix = new Matrix4();
matrix.setPosition(0, 0, this.mod_DrawerOpeningDistance || 250);
openGrp.openMatrix = matrix;

