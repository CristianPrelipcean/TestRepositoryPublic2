  // Create: Sept 2026
  // By Lars Petersen
  // Purpose: CabinetLibrary

  //===================================================================================
  // Get data from the tables
  //===================================================================================

  const innerDrawerInfos = GlobalFunc.process_InnerDrawerGroup(this);
  const movement = 0

  //===================================================================================
  // Add construction modules for innerDrawerGroup
  //===================================================================================
  if (innerDrawerInfos.IsComplete) {
    
    for (let i = 0; i < innerDrawerInfos.Drawers.length; i++) {
      const drawer = this.addOD_M_mc_InnerDrawer();
      drawer.mod_Information = JSON.stringify({ drawer: innerDrawerInfos.Drawers[i], front: innerDrawerInfos.Fronts[i], spacer: innerDrawerInfos.Spacers[i] });
    }
  }



  //===================================================================================
  // Add Fixed shelf on Top
  //===================================================================================

  if (this.mod_ShelffixedTop) {

    // Add the module
    let fixedShelfTop = this.addOD_M_mc_StorageunitShelffixed01();

    // Set the attributes  
    fixedShelfTop.mod_Width = this.mod_Width;
    fixedShelfTop.mod_Depth = this.mod_Depth;

    // Set origin
    let heightPos = this.mod_FreeSpaceStartPosY + this.mod_Height - (this.mod_ShelffixedBtm ? (this.mod_ShelffixedBtmDistance ?? 0) + (this.mod_ShelffixedThk ?? 0) : 0) - (this.mod_ShelffixedThk ?? 0);
    if (this.mod_InnerDrawerLayoutStrategy == "DefinedGroupHeight") {
      heightPos = this.mod_InnerDrawerHeightPosition + this.mod_InnerDrawerGroupHeight + this.mod_ShelffixedTopDistance;
    }
    fixedShelfTop.setOrigin(0, movement + heightPos, 0);

  }
  

  //===================================================================================
  // Add Fixed shelf on Bottom
  //===================================================================================


  if (this.mod_ShelffixedBtm) {
    // Add the module
    let fixedShelfBottom = this.addOD_M_mc_StorageunitShelffixed01();

    // Set the attributes  
    fixedShelfBottom.mod_Width = this.mod_Width;
    fixedShelfBottom.mod_Depth = this.mod_Depth;

    // Set origin
    fixedShelfBottom.setOrigin(0, movement + this.mod_InnerDrawerHeightPosition - this.mod_ShelffixedBtmDistance - this.mod_ShelffixedThk, 0);

  }

