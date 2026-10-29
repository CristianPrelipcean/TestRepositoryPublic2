// Schuler Consulting
// Create: Feb 2024
// By Stefano Cortese
// CabinetLibrary
//
// Description:
// CreateBuildPlan of mc_Handle_01
// Add the handle graphically
// Add the drilling part
//
// Revisions:
// 
//===================================================

//===================================================
//          Call the function process_Handle
//===================================================

// Information from Table Handle
let retHandleMapping=JSON.parse(this.mod_Information);

//===================================================
//          Add the handlestrip graphically
//===================================================

// Insert the handle
let HandleStrip=this.addpart_Handlestrip(0,0,0,this.mod_Width,retHandleMapping.HandleH,retHandleMapping.HandleD);
HandleStrip.assign3DModel(retHandleMapping.Mod3D);
this.assignPartGroup(this.mod_FrontId,HandleStrip);

// Set the attributes to the part
HandleStrip.pa_Supplier=retHandleMapping.Supplier;
HandleStrip.pa_SupplierArticle=retHandleMapping.SupplierCode;