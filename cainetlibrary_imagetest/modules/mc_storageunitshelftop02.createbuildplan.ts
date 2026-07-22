  // Schuler Consulting
  // Create: March 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_StorageunitShelftop02
  // Add the heatshelf parts
  //
  // Revisions:
  //
  //===================================================

  //===================================================
  //          Add the heatshelf
  //===================================================

  if (this.mod_ShelftopConstruction == 'Heatshelf') {
    let Elem = this.addpart_Heatshelf(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
    GlobalFunc.process_AddMaterialCarcase(Elem, this, 'shelfNoFrontEdge', false, false, 'none');
    this.assignPartGroup(this.mod_CarcaseId, Elem);
  }

  //===================================================
  //          Add the heatshelf front
  //===================================================

  if (this.mod_ShelftopConstruction == 'HeatshelfFront') {
    let Elem = this.addpart_HeatshelfFront(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
    GlobalFunc.process_AddMaterialCarcase(Elem, this, 'shelfNoFrontEdge', false, false, 'none');
    this.assignPartGroup(this.mod_CarcaseId, Elem);
  }
  