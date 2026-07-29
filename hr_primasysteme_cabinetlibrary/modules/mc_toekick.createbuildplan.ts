// Schuler Consulting
// Create: October 2024
// By Stefano Cortese
// CabinetLibrary
//
// Description:
// Creation of the Toekick
//
// Revisions:
  //


  // Schuler Consulting
  // Create: October 2024
  // By Stefano Cortese
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_Toekick
  // Create the partgroup
  // Add the panel for the toekick
  //
  // Revisions:
  //
  //===================================================

  //===================================================
  //          Create the partgroup
  //===================================================
  
  let BomIdname = this.mod_ToekickId;
  let ToekickGroup = this.addpart_ToekickGroup(0, 0, 0, this.mod_ToekickLength, this.mod_ToekickHeight, this.mod_ToekickThk);
  this.createPartGroup(BomIdname, ToekickGroup);
  ToekickGroup.pa_BomId = BomIdname;

  //===================================================
  //          Add the panel for the toekick
  //===================================================

  let Toekick = this.addpart_Toekick(0, 0, 0, this.mod_ToekickLength, this.mod_ToekickHeight, this.mod_ToekickThk);
  Toekick.pa_BomId = BomIdname;
  this.assignPartGroup(BomIdname, Toekick);
  GlobalFunc.process_AddMaterial(Toekick, 'toekick', this.mod_ToekickColor, this.mod_ToekickColor, this.mod_ToekickColor, this.mod_ToekickColor, 'front', false, false);
