
  // Create: Feb 2026
  // By Anni Chen
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_ClothingOrganizerBoard01
  //
  // Revisions:
  //
  //===================================================

  const Board = this.addpart_ClothingOrganizerBoard(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
  const bomId = this.mod_ClothingOrganizerId;
  this.assignPartGroup(bomId, Board);
  GlobalFunc.process_AddMaterial(Board, 'shelfadj', this.mod_ClothingOrganizerBoardColor);
