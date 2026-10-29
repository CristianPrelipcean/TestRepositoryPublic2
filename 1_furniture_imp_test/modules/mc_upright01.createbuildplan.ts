  // Schuler Consulting
  // Create: September 2024
  // By Stefano Cortese
  // CabinetLibrary
  //
  // Description:
  // Creation of the Upright
  //
  // Revisions:
  //
  //===================================================

  //===================================================
  // Create PartGroup
  //===================================================

  // Variables
  let BomIdname = 'Upright';
  let heightOffset = 0;
  const groupName = 'Upright_' + this.mod_UprightSide;

  // Add the part and create PartGroup
  let UprightGroup = this.addpart_UprightGroup(0, 2, 0, this.mod_UprightThk, this.mod_Height, this.mod_Depth);
  this.createPartGroup(groupName, UprightGroup);
  UprightGroup.pa_BomId = BomIdname;

  //===================================================
  // Insert floor profile
  //===================================================

  if (this.mod_UprightConstruction === "ToFloor" && this.mod_UprightConstruction_matrix.IncludeFloorProfile == true) {
    heightOffset = 2;
    let Profile = this.addpart_FinishPanelProfile(-1, 0, 0, this.mod_UprightThk + 2, 20, this.mod_Depth + 1);
    this.assignPartGroup(groupName, Profile);
    GlobalFunc.process_AddMaterial(Profile, 'hardware', 'Edelstahl');

    // Set attributes of the part
    Profile.pa_BomId = BomIdname;
  }

  //===================================================
  // Create Upright
  //===================================================

  // Insert the Upright
  let FinishPanel = this.addpart_FinishPanel(0, heightOffset, 0, this.mod_UprightThk, this.mod_Height - heightOffset , this.mod_Depth);
  this.assignPartGroup(groupName, FinishPanel);
  GlobalFunc.process_AddMaterial(FinishPanel, 'sidepanel', this.mod_UprightColor, this.mod_UprightColor, this.mod_UprightColor, this.mod_UprightColor, 'right', false, false);

  // Set attributes of the part
  FinishPanel.pa_FinishPanelThk = this.mod_UprightThk;
  FinishPanel.pa_FinishPanelHeight = this.mod_Height - heightOffset ;
  FinishPanel.pa_FinishPanelDepth = this.mod_Depth;
  FinishPanel.pa_BomId = BomIdname;