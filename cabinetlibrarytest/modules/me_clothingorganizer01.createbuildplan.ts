
  // Create: Aug 2026
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of me_ClothingOrganizer01
  // Add the partgroup
  //
  // Revisions:
  //
  //===================================================================================

  //===================================================================================
  // Add the partgroup
  //===================================================================================

  const bomId = this.mod_ClothingOrganizerId;
  const partGroup = this.addpart_ClothingOrganizerUnit(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
  this.createPartGroup(bomId, partGroup);

  partGroup.pa_BomId = bomId;
  partGroup.pa_PartgroupBomId = this.mod_FrontId;
