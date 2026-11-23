// Schuler Consulting
// Create: Sep 2026
// By Lars Petersen
// Purpose: CabinetLibrary
//
// Description:
// Add Partgroup for the Inner Drawer drawer
// Add the opening for the drawer
//
// Revisions:
// 
//===================================================

//===================================================
//          Add Partgroup for the drawer
//===================================================

let DrawerUnit=this.addpart_DrawerUnit(0,0,0,this.mod_Width,this.mod_Height,this.mod_Depth);
this.createPartGroup(this.mod_InnerDrawerId, DrawerUnit);

//===================================================
//          Add the opening for the drawer
//===================================================

let nameOfOpenGroup = this.mod_InnerDrawerId;
let openGrp = this.createOpenGroup(nameOfOpenGroup, DrawerUnit);

let matrix = new Matrix4();
matrix.setPosition(0, 0, /*this.mod_DrawerOpeningDistance ||*/ 100);
openGrp.openMatrix = matrix;