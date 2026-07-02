  
  // Schuler Consulting
  // Create: September 2025
  // By Anni Chen
  // Purpose: CabinetLibrary
  //
  // Description:
  // Add the corresponding modules for adjustable shelves
  // Add the module for the fittings
  // Add the module for the drillings
  //===================================================

  //===================================================
  //          Calculations and definitions
  //===================================================

  // Interface for the return values of the function process_ShelfadjPos
  interface IShelfAdjInfo {
    StartPosY: number[];
    StartPosX: number;
    StartPosZ: number;
    ShelfThk: number;
    ModuleType: string;
    Color: string;
    GrainGroupId: string;
    DrillSettings: ICT_tab_ShelfadjDrillSettings;
    DrillDistance: number;
    QtyDrills: number;
    Width: number;
    Depth: number;
    OffsetFront: number;
    OffsetBack: number;
  }

  // Call function for process the adjustable shelves
  let AdjShelfInfo: IShelfAdjInfo = GlobalFunc.process_ShelfadjPos(this);

  //===================================================
  //          Add the corresponding modules for adjustable shelves
  //===================================================

  // Add the module for the adjustable shelves
  if (AdjShelfInfo.StartPosY.length > 0) {
    AdjShelfInfo.StartPosY.forEach((shelfPosY, index) => {

      // Insert the specific adjustable shelf based on the module type
      let Panel;

      switch (AdjShelfInfo.ModuleType) {
        case "Wood":
          Panel = this.addOD_M_mc_ShelfadjWood01();
          break;
        case "Glass":
          Panel = this.addOD_M_mc_ShelfadjGlass01();
          break;
        default:
          logError(`Wrong ModuleID: ${AdjShelfInfo.ModuleType}`);
          return;
      }

      // Move the module into the correct position
      Panel.setOrigin(AdjShelfInfo.StartPosX, shelfPosY + this.mod_ShelfadjGroupPositionY, AdjShelfInfo.StartPosZ);

      // Set attributes of the child
      Panel.mod_Width = AdjShelfInfo.Width;
      Panel.mod_Depth = AdjShelfInfo.Depth;
      Panel.mod_ShelfadjThk = AdjShelfInfo.ShelfThk;
      Panel.mod_CarcaseId = this.mod_CarcaseId;
      Panel.mod_ShelfadjColor = AdjShelfInfo.Color;
    });
  }

  //===================================================
  //          Add the module for the fittings
  //===================================================

  // Detect if there are fittings at backwall or front side
  let startPosZ = AdjShelfInfo.StartPosZ;
  let depthZ = AdjShelfInfo.Depth;

  if (AdjShelfInfo.DrillSettings.ObjectBackwall == "N/a" && AdjShelfInfo.DrillSettings.ObjectVertDividerType != "N/a") {
    startPosZ = AdjShelfInfo.StartPosZ;
    depthZ = this.mod_Depth - AdjShelfInfo.StartPosZ;
  }
  else if (AdjShelfInfo.DrillSettings.ObjectBackwall != "N/a" && AdjShelfInfo.DrillSettings.ObjectVertDividerType == "N/a") {
    startPosZ = 0;
    depthZ = AdjShelfInfo.Depth + AdjShelfInfo.StartPosZ;
  }
  else if (AdjShelfInfo.DrillSettings.ObjectBackwall != "N/a" && AdjShelfInfo.DrillSettings.ObjectVertDividerType != "N/a") {
    startPosZ = 0;
    depthZ = this.mod_Depth;
  }

  // Cycle for each shelf add a module for fittings
  if (AdjShelfInfo.StartPosY.length > 0) {
    AdjShelfInfo.StartPosY.forEach((shelfPosY, index) => {

      // Insert the module for the fittings
      let Fitting = this.addOD_M_mc_ShelfadjFitting01();

      // Move the module into the correct position
      Fitting.setOrigin(0, shelfPosY + this.mod_ShelfadjGroupPositionY, startPosZ);

      // Set attributes of the child
      Fitting.mod_Width = AdjShelfInfo.Width;
      Fitting.mod_Depth = depthZ;
      Fitting.mod_Height = AdjShelfInfo.ShelfThk;
      Fitting.mod_CarcaseId = this.mod_CarcaseId;
      Fitting.mod_VertDividerPosition = this.mod_VertDividerPosition;
      assignDrillingAttributes(Fitting, AdjShelfInfo.DrillSettings, this);
    });
  }

  //===================================================
  //          Add the module for the drillings
  //===================================================

  // Full height drills
  if (AdjShelfInfo.QtyDrills == 0) {
    const Drillings = this.addOD_M_mc_ShelfadjDrill01();
    Drillings.mod_Height = this.mod_Height - this.mod_ShelfadjDrillinglineOffsetBtm - this.mod_ShelfadjDrillinglineOffsetTop;
    Drillings.mod_Width = this.mod_Width;
    Drillings.mod_Depth = depthZ;
    Drillings.setOrigin(0, this.mod_ShelfadjDrillinglineOffsetBtm + this.mod_ShelfadjGroupPositionY, startPosZ);
    assignDrillingAttributes(Drillings, AdjShelfInfo.DrillSettings, this);
  }

  // Group of drills
  else {
    if (AdjShelfInfo.StartPosY.length > 0) {
      AdjShelfInfo.StartPosY.forEach((shelfPosY, index) => {
        const Drillings = this.addOD_M_mc_ShelfadjDrill01();
        Drillings.mod_Height = AdjShelfInfo.DrillDistance * (AdjShelfInfo.QtyDrills - 1);
        Drillings.mod_Width = this.mod_Width;
        Drillings.mod_Depth = depthZ;
        const HalfQty = Math.floor((AdjShelfInfo.QtyDrills - 1) / 2)
        Drillings.setOrigin(0, shelfPosY + this.mod_ShelfadjGroupPositionY - (AdjShelfInfo.DrillDistance * HalfQty), startPosZ);
        assignDrillingAttributes(Drillings, AdjShelfInfo.DrillSettings, this);
      });
    }
  }

  //===================================================
  // Function to set the attributes of the child
  //===================================================

  function assignDrillingAttributes(Drillings: any, settings: any, m: any) {
    Drillings.mod_ShelfadjBackwallProcessingId = settings.ObjectBackwall!;
    Drillings.mod_ShelfadjSidepanelProcessingFrontId = settings.ObjectSidesFront!;
    Drillings.mod_ShelfadjSidepanelProcessingMiddleId = settings.ObjectSidesMiddle!;
    Drillings.mod_ShelfadjSidepanelProcessingBackId = settings.ObjectSidesBack!;
    Drillings.mod_ShelfadjVertDividerProcessingId = settings.ObjectVertDividerType!;
    Drillings.mod_ShelfadjSidepanelDrillDescriptor = settings.SidepanelDescriptor;
    Drillings.mod_ShelfadjBackwallDrillDescriptor = settings.BackwallDescriptor;
    Drillings.mod_ShelfadjDrillDistance = AdjShelfInfo.DrillDistance;
  }