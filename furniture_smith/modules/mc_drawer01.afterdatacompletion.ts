
  // Schuler Consulting
  // Create: Nov 2023
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mc_Door01
  // Add module for the front panel
  // Add module for the handle strip
  // Add module for the handle
  // Add module for the hinges
  //
  // Revisions: March 2024
  // By Ludwig Weber
  // Optimization on the code
  //===================================================

  //===================================================
  //          Call the tables and get information
  //===================================================

  // Retrive all the information about the handlestrip
  let FrontRed = 0;
  let HandleHeight = 0;
  let frontWeight = 0;
  let handleWeight = 0;
  let retHandleStripInfo: any;

  if (this.mod_HandleDesign_matrix.HandleType == "Handlestrip") {
    retHandleStripInfo = GlobalFunc.process_HandlestripPos(this);
    FrontRed = retHandleStripInfo.FrontReduction;
    HandleHeight = retHandleStripInfo.HandleH;
  }

  // Retrieve information for the front construction
  let handlePosType = GlobalFunc.find_HandleSettings(this.mod_HandlePosType, 'Drawer').HandleOrientation!;
  let retDrawerInfo = GlobalFunc.process_FrontPanelConstruction(
    this,
    'Drawer',
    this.mod_FrontProgram,
    this.mod_FrontWidth,
    this.mod_FrontHeight,
    this.mod_HandleDesign_matrix.HandleDesignGroup!,
    handlePosType,
    this.mod_FrontColor_matrix.GrainGroupId
  )

  // Get the FreeSpace and StartPosition
  let CarcaseSpaceDimension = JSON.parse(this.mod_CarcaseSpaceDimension[0]);

  // Retrieve Oversize from Calcualtions function
  const OversizeInfo = GlobalFunc.calc_FrontOversize(this, "drawer");

  //===================================================
  //          Add module for the front panel
  //===================================================

  let Drawer: any;
  let DrawerDesign = retDrawerInfo.retFrontConstruction.FrontModuleId;

  // Add the module
  if (DrawerDesign == "FrontPanel01") {
    Drawer = this.addOD_M_mc_FrontPanel01();
  }
  else if (DrawerDesign == "WoodFrame01") {
    Drawer = this.addOD_M_mc_PanelWoodFrame01();
  }
  else if (DrawerDesign == "AlluminiumFrame01") {
    Drawer = this.addOD_M_mc_MetalFrame01();
  }
  else if (DrawerDesign == "ThermoformedFrame01") {
    Drawer = this.addOD_M_mc_ThermoformedPanel01();
  }
  else {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 22036', 1);
    logError(ErrorMessage.Message(''));
  }

  // Set values to the attributes of the child
  Drawer.mod_Width = retDrawerInfo.width + OversizeInfo.OversizeLeft + OversizeInfo.OversizeRight;
  Drawer.mod_Height = retDrawerInfo.height + OversizeInfo.OversizeTop + OversizeInfo.OversizeBottom;
  Drawer.mod_Depth = retDrawerInfo.thickness;
  Drawer.mod_FrontType = "Drawer";
  Drawer.mod_Information = JSON.stringify(retDrawerInfo);

  // setOrigin
  Drawer.setOrigin(retDrawerInfo.posX - OversizeInfo.OversizeLeft, retDrawerInfo.posY - OversizeInfo.OversizeBottom, retDrawerInfo.posZ);
  frontWeight = retDrawerInfo.weight;

  //===================================================
  //          Add module for the handle strip
  //===================================================

  if (this.mod_HandleDesign_matrix.HandleType == "Handlestrip") {
    // Add the module
    let HandleStrip = this.addOD_M_mc_Handlestrip01();

    // Set values to the attributes of the child
    HandleStrip.mod_FrontType = "GroupDrawer";
    HandleStrip.mod_DoorDirection = "Left";
    //HandleStrip.mod_Width = this.mod_FrontWidth - this.mod_FrontGapVert;
    //HandleStrip.mod_Height = this.mod_FrontHeight - this.mod_FrontGapHor;
    //HandleStrip.mod_Depth = this.mod_FrontThk;

    // setOrigin
    if (handlePosType == 'StrBottom') {
      //HandleStrip.setOrigin(this.mod_FrontGapVert / 2, 0, 0);
    }
    else {
      //HandleStrip.setOrigin(this.mod_FrontGapVert / 2, this.mod_FrontHeight-retHandleSet.matrix_FrontReduction, 0);
    }
  }

  //===================================================
  //          Add module for the handle
  //===================================================

  else if (this.mod_HandleDesign_matrix.HandleType == "Handle") {
    // Add the module
    let Handle = this.addOD_M_mc_Handle01();

    // Set values to the attributes of the child
    Handle.mod_Width = retDrawerInfo.width;
    Handle.mod_Height = retDrawerInfo.height;
    Handle.mod_Depth = retDrawerInfo.thickness;

    // Provide Information about part on which the handle is positioned
    Handle.mod_FrontType = 'part_Drawer';
    Handle.mod_PartInfo = 'None';

    // setOrigin
    Handle.setOrigin(retDrawerInfo.posX, retDrawerInfo.posY, retDrawerInfo.posZ);

    // Seal the handle to get the frontWeight
    let sealedHandle = Handle.seal();
    handleWeight = sealedHandle.mod_HandleWeightCalculations[0];
  }

  //===================================================
  //          Add module for the drawer box
  //===================================================

  // Metal drawer box
  if (this.mod_DrawerBoxDesign_matrix.DrawerBoxType == 'DrawerBox') {

    // Add the module
    let DrawerBox = this.addOD_M_mc_DrawerBox01();

    // Calculate InsertionHeight
    let InsertionPosY = GlobalFunc.find_DrawerBoxInsertionSettings(this.mod_TypeElement, this.mod_FrontProgram, this.mod_HandleDesign, this.mod_HandlePosType, this.mod_FrontPosStart, this.mod_ShelffixedBtm).DrawerBoxPos(this, CarcaseSpaceDimension.HeightFreeStartPos);

    // Set values to the attributes of the child
    DrawerBox.mod_FrontWidth = retDrawerInfo.width;
    DrawerBox.mod_FrontHeight = retDrawerInfo.height;
    DrawerBox.mod_Width = CarcaseSpaceDimension.WidthFreeSpace;
    DrawerBox.mod_Depth = CarcaseSpaceDimension.DepthFreeSpace - this.mod_DrawerBoxOffsetDepth;
    DrawerBox.mod_Height = CarcaseSpaceDimension.HeightFreeSpace < retDrawerInfo.height ? CarcaseSpaceDimension.HeightFreeSpace : retDrawerInfo.height - InsertionPosY;
    DrawerBox.mod_PartgroupDrawerWeight = frontWeight + handleWeight;

    // setOrigin
    DrawerBox.setOrigin(CarcaseSpaceDimension.WidthFreeSpace / 2 + CarcaseSpaceDimension.WidthFreeStartPos, InsertionPosY, 0)
  }