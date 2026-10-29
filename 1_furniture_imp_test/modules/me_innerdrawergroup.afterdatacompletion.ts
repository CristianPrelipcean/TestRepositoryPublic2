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