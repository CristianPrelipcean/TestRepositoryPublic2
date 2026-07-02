  // Schuler Consulting
  // Create: Nov 2022
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // Add PartGroup for the panel and also create the box
  // Add horizontal panel
  //
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add PartGroup for the panel and also create the box
  //===================================================

  let Elem = this.addpart_PanelUnit(0, 0, 0, this.mod_Width, this.mod_Thk, this.mod_Depth);
  this.createPartGroup(this.mod_PanelId, Elem);

  //===================================================
  //          Add horizontal panel
  //===================================================

  Elem = this.addpart_PanelHor(-5, this.mod_Height - this.mod_PaneltopThk, -this.mod_IslandBackwallOverhangFront, this.mod_Width + 10, this.mod_PaneltopThk, this.mod_Depth);
  this.assignPartGroup(this.mod_PanelId, Elem);
  GlobalFunc.process_AddMaterial(Elem, 'shelf', this.mod_PaneltopColor, this.mod_PaneltopColor, this.mod_PaneltopColor, this.mod_PaneltopColor, 'bottom', false, false);

  //===================================================
  //          Add vertical panel
  //===================================================

  Elem = this.addpart_PanelVert(0, 0, 0, this.mod_Width, this.mod_Height - this.mod_PaneltopThk, this.mod_Thk);
  this.assignPartGroup(this.mod_PanelId, Elem);
  GlobalFunc.process_AddMaterial(Elem, 'backwall', this.mod_Color, this.mod_Color, this.mod_Color, this.mod_Color, 'front', false, false);