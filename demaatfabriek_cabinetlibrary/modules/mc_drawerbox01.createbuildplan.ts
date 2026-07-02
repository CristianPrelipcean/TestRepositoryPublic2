
  // Schuler Consulting
  // Create: June 2024
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mc_DrawerBox
  // Basic calculations
  // Insert the box-system (sides and glides)
  // Insert the bottom shelf
  // Insert the back panel
  // Error message if box is too big
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  // Basic calculations
  //===================================================

  // Call the process function
  let retInfo = GlobalFunc.process_Drawerbox(this);

  // Check the dimensions to make sure they are not bigger than the free space
  let BoxValid = true;
  if (retInfo.SideLeft.DimY! > this.mod_Height) { BoxValid = false }
  if (retInfo.SideLeft.DimZ! > this.mod_Depth) { BoxValid = false }

  // If the box fits into the free space insert it
  if (BoxValid) {

    //===================================================
    // Insert the box-system (sides and glides)
    //===================================================

    // Box side left
    let DrawerBoxLeft = this.addpart_DrawerSideLeft(retInfo.SideLeft.PosX, retInfo.SideLeft.PosY, retInfo.SideLeft.PosZ, retInfo.SideLeft.DimX, retInfo.SideLeft.DimY, retInfo.SideLeft.DimZ)
    DrawerBoxLeft.assign3DModel(retInfo.SideLeft.Model3D);
    GlobalFunc.process_AddMaterial(DrawerBoxLeft, 'drawerbox', retInfo.SideLeft.ColorId!);
    this.assignOpenGroup(this.mod_FrontId, DrawerBoxLeft);

    // Box side right
    let DrawerBoxRight = this.addpart_DrawerSideRight(retInfo.SideRight.PosX, retInfo.SideRight.PosY, retInfo.SideRight.PosZ, retInfo.SideRight.DimX, retInfo.SideRight.DimY, retInfo.SideRight.DimZ)
    DrawerBoxRight.assign3DModel(retInfo.SideRight.Model3D);
    GlobalFunc.process_AddMaterial(DrawerBoxRight, 'drawerbox', retInfo.SideRight.ColorId!);
    this.assignOpenGroup(this.mod_FrontId, DrawerBoxRight);

    // Slide left
    let DrawerSlideLeft = this.addpart_DrawerSlideLeft(retInfo.SlideLeft.PosX, retInfo.SlideLeft.PosY, retInfo.SlideLeft.PosZ, retInfo.SlideLeft.DimX, retInfo.SlideLeft.DimY, retInfo.SlideLeft.DimZ)
    DrawerSlideLeft.assign3DModel(retInfo.SlideLeft.Model3D);
    GlobalFunc.process_AddMaterial(DrawerSlideLeft, 'drawerslide', retInfo.SlideLeft.ColorId!);

    // Slide right
    let DrawerSlideRight = this.addpart_DrawerSlideRight(retInfo.SlideRight.PosX, retInfo.SlideRight.PosY, retInfo.SlideRight.PosZ, retInfo.SlideRight.DimX, retInfo.SlideRight.DimY, retInfo.SlideRight.DimZ)
    DrawerSlideRight.assign3DModel(retInfo.SlideRight.Model3D);
    GlobalFunc.process_AddMaterial(DrawerSlideRight, 'drawerslide', retInfo.SlideRight.ColorId!);

    //===================================================
    // Insert the bottom shelf
    //===================================================

    let DrawerBoxBtm = this.addpart_DrawerShelfbtm(retInfo.BottomShelf.PosX, retInfo.BottomShelf.PosY, retInfo.BottomShelf.PosZ, retInfo.BottomShelf.DimX, retInfo.BottomShelf.DimY, retInfo.BottomShelf.DimZ);
    GlobalFunc.process_AddMaterialCarcase(DrawerBoxBtm, this, 'shelfdrawer', false, false, 'None', retInfo.BottomShelf.BoardColor, retInfo.BottomShelf.BoardGrainId);
    this.assignPartGroup(this.mod_FrontId, DrawerBoxBtm);
    this.assignOpenGroup(this.mod_FrontId, DrawerBoxBtm);

    // Set attributes of the child
    DrawerBoxBtm.pa_BomId = this.mod_FrontId;
    DrawerBoxBtm.pa_ParentName = this.mod_FrontId;
    DrawerBoxBtm.pa_BtmColor = retInfo.BottomShelf.BoardColor;
    DrawerBoxBtm.pa_TopColor = retInfo.BottomShelf.BoardColor;
    DrawerBoxBtm.pa_EdgeFrontColor = retInfo.BottomShelf.EdgeColor;
    DrawerBoxBtm.pa_EdgeBackColor = retInfo.BottomShelf.EdgeColor;
    DrawerBoxBtm.pa_EdgeLeftColor = retInfo.BottomShelf.EdgeColor;
    DrawerBoxBtm.pa_EdgeRightColor = retInfo.BottomShelf.EdgeColor;
    DrawerBoxBtm.pa_EdgeFrontType = retInfo.BottomShelf.EdgeTypeFront;
    DrawerBoxBtm.pa_EdgeBackType = retInfo.BottomShelf.EdgeTypeBack;
    DrawerBoxBtm.pa_EdgeLeftType = retInfo.BottomShelf.EdgeTypeLeft;
    DrawerBoxBtm.pa_EdgeRightType = retInfo.BottomShelf.EdgeTypeRight;
    DrawerBoxBtm.pa_EdgeJointType = retInfo.BottomShelf.EdgeTypeJoint;
    DrawerBoxBtm.pa_ColorGrainGroup = retInfo.BottomShelf.BoardGrainId;
    DrawerBoxBtm.pa_GrainDirection = retInfo.BottomShelf.Grain;
    
    //===================================================
    // Insert the back panel
    //===================================================

    let DrawerBoxBackwall = this.addpart_DrawerBackwallWood(retInfo.Backwall.PosX, retInfo.Backwall.PosY, retInfo.Backwall.PosZ, retInfo.Backwall.DimX, retInfo.Backwall.DimY, retInfo.Backwall.DimZ);
    GlobalFunc.process_AddMaterialCarcase(DrawerBoxBackwall, this, 'backwalldrawer', false, false, 'None', retInfo.Backwall.BoardColor, retInfo.Backwall.BoardGrainId);
    this.assignPartGroup(this.mod_FrontId, DrawerBoxBackwall);
    this.assignOpenGroup(this.mod_FrontId, DrawerBoxBackwall);

    // Set attributes of the child
    DrawerBoxBackwall.pa_BomId = this.mod_FrontId;
    DrawerBoxBackwall.pa_ParentName = this.mod_FrontId;
    DrawerBoxBackwall.pa_BtmColor = retInfo.Backwall.BoardColor;
    DrawerBoxBackwall.pa_TopColor = retInfo.Backwall.BoardColor;
    DrawerBoxBackwall.pa_EdgeFrontColor = retInfo.Backwall.EdgeColor;
    DrawerBoxBackwall.pa_EdgeBackColor = retInfo.Backwall.EdgeColor;
    DrawerBoxBackwall.pa_EdgeLeftColor = retInfo.Backwall.EdgeColor;
    DrawerBoxBackwall.pa_EdgeRightColor = retInfo.Backwall.EdgeColor;
    DrawerBoxBackwall.pa_EdgeFrontType = retInfo.Backwall.EdgeTypeFront;
    DrawerBoxBackwall.pa_EdgeBackType = retInfo.Backwall.EdgeTypeBack;
    DrawerBoxBackwall.pa_EdgeLeftType = retInfo.Backwall.EdgeTypeLeft;
    DrawerBoxBackwall.pa_EdgeRightType = retInfo.Backwall.EdgeTypeRight;
    DrawerBoxBackwall.pa_EdgeJointType = retInfo.Backwall.EdgeTypeJoint;
    DrawerBoxBackwall.pa_ColorGrainGroup = retInfo.BottomShelf.BoardGrainId;
    DrawerBoxBackwall.pa_GrainDirection = retInfo.Backwall.Grain;
    DrawerBoxBackwall.pa_ProcessingId = retInfo.Backwall.ProcessingId;

    //===================================================
    // Insert the bottom shelf connectors
    //===================================================

    // Cycle to insert the connectors based on table entries
    retInfo.BottomShelfConnector.arrPosX.forEach(position => {
      let BSConnector = this.addpart_DrawerShelfbtmConnector(retInfo.BottomShelfConnector.PosX + position - this.mod_Width / 2, retInfo.BottomShelfConnector.PosY, retInfo.BottomShelfConnector.PosZ, retInfo.BottomShelfConnector.DimX, retInfo.BottomShelfConnector.DimY, retInfo.BottomShelfConnector.DimZ);
      BSConnector.assign3DModel(retInfo.BottomShelfConnector.Model3D);
      GlobalFunc.process_AddMaterial(BSConnector, 'hardware', retInfo.BottomShelfConnector.ColorId!);
      this.assignOpenGroup(this.mod_FrontId, BSConnector);

      // Insert the drilling part
      let BSConDrill = this.addpart_DrawerShelfbtmConnectorDrilling(position - this.mod_Width / 2, retInfo.BottomShelfConnector.PosY + retInfo.BottomShelfConnector.DimY - 1, -retInfo.BottomShelfConnector.DimZ, 1, 1, retInfo.BottomShelfConnector.DimZ);
      BSConDrill.pa_ProcessingId = retInfo.BottomShelfConnector.BotConProcessingId;
    });

    //===================================================
    // Insert the synchronization unit
    //===================================================

    if (retInfo.Synchronization.Model3D != undefined){
      let SyncUnit = this.addpart_DrawerBoxSynchronization(retInfo.Synchronization.PosX, retInfo.Synchronization.PosY, retInfo.Synchronization.PosZ, retInfo.Synchronization.DimX, retInfo.Synchronization.DimY, retInfo.Synchronization.DimZ);
      SyncUnit.assign3DModel(retInfo.Synchronization.Model3D);
      GlobalFunc.process_AddMaterial(SyncUnit, 'hardware', retInfo.Synchronization.ColorId!);     
    }

    //===================================================
    // Insert the drilling parts
    //===================================================

    // Drillings on sidepanels and front
    let DrillArea = this.addpart_DrawerBoxDrilling(retInfo.DrillArea.PosX, retInfo.DrillArea.PosY, retInfo.DrillArea.PosZ, retInfo.DrillArea.DimX, retInfo.DrillArea.DimY, retInfo.DrillArea.DimZ);
    DrillArea.pa_ProcessingId = retInfo.DrillArea.BoxProcessingId;
    DrillArea.pa_ProcessingId2 = retInfo.DrillArea.ConProcessingId;

    //===================================================
    // Insert the bom parts
    //===================================================

    let BomElem = this.addpart_DrawerBoxBom(retInfo.BomElement.PosX, retInfo.BomElement.PosY, retInfo.BomElement.PosZ, retInfo.BomElement.DimX, retInfo.BomElement.DimY, retInfo.BomElement.DimZ);
    this.assignPartGroup(this.mod_FrontId, BomElem);
    BomElem.pa_HardwareId = retInfo.BomElement.BoxHardwareId;
    BomElem.pa_HardwareId2 = retInfo.BomElement.ConHardwareId;
    BomElem.pa_HardwareId3 = retInfo.BottomShelfConnector.BotConHardwareId;
    BomElem.pa_HardwareId4 = retInfo.Synchronization.ConHardwareId;

  }

  //===================================================
  // Error message if box is too big
  //===================================================

  else {
    logError('Insertion of drawerbox failed, because the free space is not big enough for the configuration of the drawerbox.');
  }

