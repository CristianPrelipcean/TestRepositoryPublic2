 // Schuler Consulting
// Create: June 2024
// By Henning Wiesbrock
// Purpose: PartLibrary
//
// Description:
// AfterDataCompletion me_Hinge
// Add construction module
//
// Revisions:
// 
//===================================================
if (this.mod_FrontType == 'Drawer')
{
  logError('It is not possible to add a hinge drill to the front type of drawer!') 
}
else
{
  let Hinge = this.addOD_M_mc_Hinge();
}