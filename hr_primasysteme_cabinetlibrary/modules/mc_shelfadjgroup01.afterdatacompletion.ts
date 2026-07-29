
  // HOMAG Digital
  // Create: February 2024
  // By Henning Wiesbrock
  // Purpose: CabinetLibrary
  //
  // Description:
  // Add the corresponding modules for adjustable shelves
  // Add the module for the fittings
  // Add the module for the drillings
  //
  // Revisions:
  // By Ludwig Weber
  // July 2026
  // Complete refactoring of the script
  //===================================================

  //===================================================
  // Calculations and definitions
  //===================================================

  const adjShelfInfo = GlobalFunc.process_ShelfadjPos(this);

  if (!adjShelfInfo.IsComplete) {
    return;
  }

  const shelves = adjShelfInfo.StartPosY;
  const settings = adjShelfInfo.DrillSettings;

  if (!settings) {
    return;
  }

  if (shelves.length === 0) {
    return;
  }

  //===================================================
  // Determine fitting and drilling area
  //===================================================

  let startPosZ = adjShelfInfo.StartPosZ;
  let depthZ = adjShelfInfo.Depth;

  const hasBackwall = settings.ObjectBackwall !== "N/a";
  const hasVertDivider = settings.ObjectVertDividerType !== "N/a";

  if (!hasBackwall && hasVertDivider) {
    depthZ = this.mod_Depth - adjShelfInfo.StartPosZ;
  }
  else if (hasBackwall && !hasVertDivider) {
    startPosZ = 0;
    depthZ = adjShelfInfo.Depth + adjShelfInfo.StartPosZ;
  }
  else if (hasBackwall && hasVertDivider) {
    startPosZ = 0;
    depthZ = this.mod_Depth;
  }

  //===================================================
  // Add shelves, fittings and grouped drillings
  //===================================================

  const halfQty = Math.floor((adjShelfInfo.QtyDrills - 1) / 2);
  const drillHeight = adjShelfInfo.DrillDistance * (adjShelfInfo.QtyDrills - 1);

  shelves.forEach(shelfPosY => {

    // Adjustable shelf
    //----------------------------------------------
    let panel: any;

    switch (adjShelfInfo.ModuleType) {
      case "Wood":
        panel = this.addOD_M_mc_ShelfadjWood01();
        break;

      case "Glass":
        panel = this.addOD_M_mc_ShelfadjGlass01();
        break;

      default:
        logError(`Wrong ModuleID: ${adjShelfInfo.ModuleType}`);
        return;
    }

    panel.setOrigin(adjShelfInfo.StartPosX, shelfPosY, adjShelfInfo.StartPosZ);

    panel.mod_Width = adjShelfInfo.Width;
    panel.mod_Depth = adjShelfInfo.Depth;
    panel.mod_ShelfadjThk = adjShelfInfo.ShelfThk;
    panel.mod_CarcaseId = this.mod_CarcaseId;
    panel.mod_ShelfadjColor = adjShelfInfo.Color;

    // Fittings
    //----------------------------------------------
    const fitting = this.addOD_M_mc_ShelfadjFitting01();
    fitting.setOrigin(0, shelfPosY, startPosZ);

    fitting.mod_Width = this.mod_Width;
    fitting.mod_Depth = depthZ;
    fitting.mod_Height = adjShelfInfo.ShelfThk;
    fitting.mod_CarcaseId = this.mod_CarcaseId;
    fitting.mod_VertDividerPosition = this.mod_VertDividerPosition;
    assignDrillingAttributes(fitting, settings);

    // Grouped drillings
    //----------------------------------------------
    if (adjShelfInfo.QtyDrills > 0) {
      const drillings = this.addOD_M_mc_ShelfadjDrill01();
      drillings.setOrigin(0, shelfPosY - adjShelfInfo.DrillDistance * halfQty, startPosZ);

      drillings.mod_Height = drillHeight;
      drillings.mod_Width = this.mod_Width;
      drillings.mod_Depth = depthZ;
      assignDrillingAttributes(drillings, settings);
    }
  });

  //===================================================
  // Add full-height drilling
  //===================================================

  if (adjShelfInfo.QtyDrills === 0) {
    const drillings = this.addOD_M_mc_ShelfadjDrill01();

    drillings.mod_Height = this.mod_Height - this.mod_ShelfadjDrillinglineOffsetBtm - this.mod_ShelfadjDrillinglineOffsetTop;
    drillings.mod_Width = this.mod_Width;
    drillings.mod_Depth = depthZ;
    drillings.setOrigin(0, this.mod_ShelfadjDrillinglineOffsetBtm, startPosZ);
    assignDrillingAttributes(drillings, settings);
  }

  //===================================================
  // Set drilling attributes
  //===================================================

  function assignDrillingAttributes(drillings: any, drillSettings: ICT_tab_ShelfadjDrillSettings): void {
    drillings.mod_ShelfadjBackwallProcessingId = drillSettings.ObjectBackwall!;
    drillings.mod_ShelfadjSidepanelProcessingFrontId = drillSettings.ObjectSidesFront!;
    drillings.mod_ShelfadjSidepanelProcessingMiddleId = drillSettings.ObjectSidesMiddle!;
    drillings.mod_ShelfadjSidepanelProcessingBackId = drillSettings.ObjectSidesBack!;
    drillings.mod_ShelfadjVertDividerProcessingId = drillSettings.ObjectVertDividerType!;
    drillings.mod_ShelfadjSidepanelDrillDescriptor = drillSettings.SidepanelDescriptor;
    drillings.mod_ShelfadjBackwallDrillDescriptor = drillSettings.BackwallDescriptor;
    drillings.mod_ShelfadjDrillDistance = adjShelfInfo.DrillDistance;
  }