
  // Schuler Consulting
  // Create: Apr 2024
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_ShelfadjFitting01
  // Add the fitting parts
  // Add the drill parts
  //
  // Revisions:
  // Add vertical divider
  // Date: 24. October 2024
  // By: Henning Wiesbrock
  //===================================================

  //===================================================
  // Provide data for the fittings
  //===================================================

  // Call the process function to retrieve drill data
  const ObjectSideFront = this.mod_ShelfadjSidepanelProcessingFrontId;
  const ObjectSideMiddle = this.mod_ShelfadjSidepanelProcessingMiddleId;
  const ObjectSideBack = this.mod_ShelfadjSidepanelProcessingBackId;
  const ObjectBackwall = this.mod_ShelfadjBackwallProcessingId;
  const ObjectVertDivider = this.mod_ShelfadjVertDividerProcessingId;

  // Drilling lines on the sidepanels
  const DrillingLinesSide = GlobalFunc.process_Descriptor(this.mod_ShelfadjSidepanelDrillDescriptor, this.mod_Depth);

  // Drilling lines on the backwall
  const DrillingLinesBackwall = GlobalFunc.process_Descriptor(this.mod_ShelfadjBackwallDrillDescriptor, this.mod_Width);

  //===================================================
  //          Add the fitting parts
  //===================================================

  // Insert the fittings for the sidepanel
  let k = 0;
  DrillingLinesSide.forEach(DrillingLine => {
    const ObjectInfo = k == 0 ? ObjectSideBack : k == DrillingLinesSide.length - 1 ? ObjectSideFront : ObjectSideMiddle;
    InsertPart(this, 'Left', ObjectInfo, DrillingLine);
    InsertPart(this, 'Right', ObjectInfo, DrillingLine);

    k++
  });

  // Insert the fittings for the backwall
  k = 0;
  DrillingLinesBackwall.forEach(DrillingLine => {
    InsertPart(this, 'Back', ObjectBackwall, DrillingLine);

    k++
  });

  // Insert the fittings for the vertical divider
  if (this.mod_VertDividerType == "Cleat" || this.mod_VertDividerType == "MiddleSideShort") {
    InsertPart(this, 'Front', ObjectVertDivider, this.mod_VertDividerPosition);
  };

  //===================================================
  //          Add the fitting parts
  //===================================================

  function InsertPart(m: any, Side: string, Object: any, position: number) {

    // Variables
    let Elem: any;

    // process the data of the tables
    const HardwareObject = GlobalFunc.find_ObjectMapping(Object);
    const GraphicItems = GlobalFunc.find_GraphicLibraryMapping(HardwareObject.GraphicItem!)
    const [FittingInfo, GraphicInfo] = GlobalFunc.process_GraphicLibraryData(GraphicItems[0]?.Model3DGroupName ?? '');

    // Default dimensions and positions
    let PosX = 0;
    let PosY = -10;
    let PosZ = position - 5;
    let DimX = 10;
    let DimY = 10;
    let DimZ = 10;
    let PartOffsetX = 0;

    // Overwrite with data from GraphicLibrary
    if (FittingInfo !== undefined) {
      PosX = FittingInfo.PartOffsetX;
      PosY = -FittingInfo.DimensionY;
      PosZ = position - FittingInfo.DimensionZ / 2
      DimX = FittingInfo.DimensionX - FittingInfo.PartOffsetX;
      DimY = FittingInfo.DimensionY + FittingInfo.PartOffsetY;
      DimZ = FittingInfo.DimensionZ;
      PartOffsetX = FittingInfo.PartOffsetX;
    }

    // Left sidepanel
    if (Side == 'Left') {
      Elem = m.addpart_ShelfadjFitting(PosX, PosY, PosZ, DimX, DimY, DimZ);
    }

    // Right sidepanel
    else if (Side == 'Right') {
      Elem = m.addpart_ShelfadjFitting(m.mod_Width + PosX, PosY, PosZ, DimX, DimY, DimZ);
      const partMatrix = PartHelper.rotateY(Elem!, 180, new Vector3(-PartOffsetX, 0, DimZ / 2));
      Elem!.setMatrix(partMatrix);
    }

    // Backwall
    else if (Side == 'Back') {
      Elem = m.addpart_ShelfadjFitting(position + DimZ / 2, PosY, PartOffsetX, DimX, DimY, DimZ);
      const partMatrix = PartHelper.rotateY(Elem!, 270, new Vector3(0, 0, 0));
      Elem!.setMatrix(partMatrix);
    }

    // Vertical divider
    else if (Side == 'Front') {
      Elem = m.addpart_ShelfadjFitting(position - DimZ / 2, PosY, m.mod_Depth - PartOffsetX, DimX, DimY, DimZ);
      const partMatrix = PartHelper.rotateY(Elem!, 90, new Vector3(0, 0, 0));
      Elem!.setMatrix(partMatrix);
    }

    // Add obj-File and assign to PartGroup
    Elem.assign3DModel(GraphicInfo?.Model3D ?? null);
    m.assignPartGroup(m.mod_CarcaseId, Elem);
    Elem.pa_HardwareId = HardwareObject?.HardwareItem ?? '';

    // Add the material in the graphic
    GlobalFunc.process_AddMaterial(Elem, 'fittingShelfadj', FittingInfo?.ColorId ?? '');
  }