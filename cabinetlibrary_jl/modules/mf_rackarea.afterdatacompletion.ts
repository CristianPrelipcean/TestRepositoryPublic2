  
  // Schuler Consulting
  // Create: July 2024
  // By Henning Wiesbrock
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mf_RackArea
  // Setting for interior
  // Add module for adjustable shelves
  //
  // Revisions:
  // September 2025
  // By Ludwig Weber
  // Change the adjustable shelves
  // Add the equipment adjustable shelf multiple
  //===================================================

  //===================================================
  //          Add module 
  //===================================================

  // Add the module
  //---------------------------------------------------
  let RackArea = this.addOD_M_mc_RackArea01();
  RackArea.setOrigin(0, 0, this.mod_FrontGapCarcase);

  // Set values to the attributes of the child
  //---------------------------------------------------

  // Absolute Origin
  RackArea.mod_Originpos[0] = this.mod_Originpos[0];
  RackArea.mod_Originpos[1] = this.mod_Originpos[1];
  RackArea.mod_Originpos[2] = this.mod_Originpos[2] + this.mod_FrontGapCarcase;

  // Front Width
  RackArea.mod_FrontWidth = this.mod_CarcaseWidth;

  // Free Space
  let CarcaseSpaceDimension = JSON.parse(this.mod_CarcaseSpaceDimension[0]);

  //===================================================
  //          Find Equipment Docked
  //===================================================

  // Check if an equipment is docked in the cabinet
  let checkEquipmentDocked = false;

  // Cycle through all children of the mf_Door
  this.m.forEach((p, index) => {

    // If there is a shelfadjMultiple
    if (p instanceof OD_M_me_ShelfadjMultiple01) {
      checkEquipmentDocked = true;

      p.mod_Width = CarcaseSpaceDimension.WidthFreeSpace;
      p.mod_Depth = CarcaseSpaceDimension.DepthFreeSpace;
      p.mod_ShelfadjPartParentName = "RackArea";
      p.mod_ShelfadjPartParentType = this.mod_RackAreaType;
      p.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);
      p.mod_CarcaseId = this.mod_CarcaseId;

      // SetOrigin of the child
      p.setOrigin(CarcaseSpaceDimension.WidthFreeStartPos - this.mod_Originpos[0], CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1], CarcaseSpaceDimension.DepthFreeStartPos - this.mod_Originpos[2]);
    }
    else if (p instanceof OD_M_me_LaundryMachine) { 
      checkEquipmentDocked = true;

      p.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);

      // SetOrigin of the child
      p.setOrigin(CarcaseSpaceDimension.WidthFreeStartPos - this.mod_Originpos[0] + CarcaseSpaceDimension.WidthFreeSpace / 2, CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1], CarcaseSpaceDimension.DepthFreeStartPos - this.mod_Originpos[2] + CarcaseSpaceDimension.DepthFreeSpace);
    }
  })

  //===================================================
  //          Add module for the shelves (Standard if no equipment docked)
  //===================================================

  if (!checkEquipmentDocked) {

    if (this.mod_RackAreaType == "Adj") {

      // Add the module
      let shelfadjgroup = this.addOD_M_mc_ShelfadjGroup01();

      // Set the attributes to the child 
      shelfadjgroup.mod_Width = CarcaseSpaceDimension.WidthFreeSpace;
      shelfadjgroup.mod_Depth = CarcaseSpaceDimension.DepthFreeSpace;
      shelfadjgroup.mod_Height = CarcaseSpaceDimension.HeightFreeSpace;
      shelfadjgroup.mod_ShelfadjPartParentName = "RackArea";
      shelfadjgroup.mod_ShelfadjPartParentType = this.mod_RackAreaType;
      shelfadjgroup.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);

      // SetOrigin of the child
      shelfadjgroup.setOrigin(CarcaseSpaceDimension.WidthFreeStartPos - this.mod_Originpos[0], CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1], CarcaseSpaceDimension.DepthFreeStartPos - this.mod_Originpos[2])
    }
    else if (this.mod_RackAreaType == "Fixed") {

      // Add the module
      let shelffixedgroup = this.addOD_M_mc_ShelffixedGroup01();

      // Set the attributes to the child 
      shelffixedgroup.mod_Width = CarcaseSpaceDimension.WidthFreeSpace;
      shelffixedgroup.mod_Depth = CarcaseSpaceDimension.DepthFreeSpace;
      shelffixedgroup.mod_Height = CarcaseSpaceDimension.HeightFreeSpace;
      shelffixedgroup.mod_ShelffixedPartParentName = "RackArea";
      shelffixedgroup.mod_ShelffixedPartParentType = this.mod_RackAreaType;
      shelffixedgroup.mod_ShelffixedOffsetFront = this.mod_ShelfadjOffsetFront;
      shelffixedgroup.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);

      // SetOrigin of the child
      shelffixedgroup.setOrigin(CarcaseSpaceDimension.WidthFreeStartPos - this.mod_Originpos[0], CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1], CarcaseSpaceDimension.DepthFreeStartPos - this.mod_Originpos[2])
    }
    else if (this.mod_RackAreaType == "Empty") {
    }
  }