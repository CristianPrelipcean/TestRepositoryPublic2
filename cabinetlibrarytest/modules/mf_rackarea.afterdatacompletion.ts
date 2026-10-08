  
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
	//          Build Compartments (add dividers and create compartments informations)
	//===================================================

	const compartmentsInformation = JSON.parse(GlobalFunc.process_CreateCompartments(this));
  this.mod_CompartmentsInformation.push(JSON.stringify(compartmentsInformation));

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
      
			// Limit shelf group height to the available front height (The insertion position is always respected. If the height is too big for the space, then it is adjusted)
			const shelfadjGroupHeight = p.mod_Height ?? 0;
			const compartmentHeight = p.mod_FreeSpaceY ?? 0;
			const compartmentStartPosY = p.mod_FreeSpaceStartPosY ?? 0;
			const requestedHeight = p.mod_Height ?? 0;
			const posY = p.mod_ShelfadjGroupPositionY ?? 0;
			const maxHeight = compartmentHeight - (posY - compartmentStartPosY)
			if (shelfadjGroupHeight > maxHeight) {
				p.mod_Height = maxHeight;
			}
		}

		// If there is a clothing organzier
		else if (p instanceof OD_M_me_ClothingOrganizer01) {
			checkEquipmentDocked = true;

      // Limit height position to the available FreeSpace (the accessory minimum height and the fixed shelf btm are always respected. The fixed shelf top is disabled if it does not fit)
			const compartmentHeight = p.mod_Height ?? 0;
			const compartmentStartPosY = p.mod_Originpos[1] ?? 0;
			const maxPosHeight = compartmentHeight + compartmentStartPosY;
      let thicknessAccessory = GlobalFunc.find_ClothingOrganizerInstallationDimensions(p.mod_ClothingOrganizerDesign!)[0].ClothingOrganizerInstallationMinHeight ?? 0;
      thicknessAccessory += p.mod_ShelffixedBtm ? (p.mod_ShelffixedBtmDistance ?? 0) + (p.mod_ShelffixedThk ?? 0) : 0
      const thicknessWithShelfTop = thicknessAccessory + (p.mod_ShelffixedTop ? (p.mod_ShelffixedTopDistance ?? 0) + (p.mod_ShelffixedThk ?? 0) : 0);
			const requestedPosition = p.mod_ClothingOrganizerHeightPosition ?? 0;
      if (requestedPosition + thicknessWithShelfTop >= maxPosHeight) {
        p.mod_ShelffixedTop = false;
        const adjustedPosition = maxPosHeight - thicknessAccessory;
        p.mod_ClothingOrganizerHeightPosition = Math.max(adjustedPosition, 0);
			}
		}

		// If there is a hood insert
		else if (p instanceof OD_M_me_HoodInsert) {
			checkEquipmentDocked = true;

			p.mod_CarcaseWidth = CarcaseSpaceDimension.WidthFreeSpace;
			p.mod_CarcaseDepth = CarcaseSpaceDimension.DepthFreeSpace;
			p.mod_CarcaseHeight = CarcaseSpaceDimension.HeightFreeSpace;

			// SetOrigin of the child
			p.setOrigin(CarcaseSpaceDimension.WidthFreeStartPos - this.mod_Originpos[0], 0, CarcaseSpaceDimension.DepthFreeStartPos - this.mod_Originpos[2]);
		}

		// If there is a inner drawer group
		else if (p instanceof OD_M_me_InnerDrawerGroup) {
			checkEquipmentDocked = true;

			// If InnerDrawerLayout = DefinedGroupHeight, then limit group height to the available space height (The insertion position is always respected. If the height is too big for the space, then it is adjusted)
			if (p.mod_InnerDrawerLayoutStrategy == "DefinedGroupHeight") {
				let innerDrawerGroupHeight = (p.mod_InnerDrawerGroupHeight ?? 0);
				innerDrawerGroupHeight += p.mod_ShelffixedTop ? (p.mod_ShelffixedTopDistance ?? 0) + (p.mod_ShelffixedThk ?? 0) : 0;
				innerDrawerGroupHeight += p.mod_ShelffixedBtm ? (p.mod_ShelffixedBtmDistance ?? 0) + (p.mod_ShelffixedThk ?? 0) : 0;
				const compartmentHeight = p.mod_Height ?? 0;
				const compartmentStartPosY = p.mod_FreeSpaceStartPosY ?? 0;
				const posY = p.mod_InnerDrawerHeightPosition ?? 0;
				const maxHeight = compartmentHeight - (posY - compartmentStartPosY)
				if (innerDrawerGroupHeight >= maxHeight) {
					p.mod_InnerDrawerGroupHeight = maxHeight - (p.mod_ShelffixedBtm ? (p.mod_ShelffixedBtmDistance ?? 0) + (p.mod_ShelffixedThk ?? 0) : 0) - (p.mod_ShelffixedTop ? (p.mod_ShelffixedTopDistance ?? 0) + (p.mod_ShelffixedThk ?? 0) : 0);
				}
			}
		}

		// If there is a VertDivider (Middle Side Panel)
		else if (p instanceof OD_M_me_Vertdivider01) {
			checkEquipmentDocked = true;
		}

		// If there is a ShelfFixed (Middle Side Panel)
		else if (p instanceof OD_M_me_Shelffixed01) {
			checkEquipmentDocked = true;
    }
    
    // If there is a Laundry machine
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