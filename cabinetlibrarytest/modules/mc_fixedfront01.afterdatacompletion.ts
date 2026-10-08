
  // Schuler Consulting
  // Create: March 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mc_Fixedfront01
  // Add module for the front panel
  // Add module for the handle strip
  //
  // Revisions: 
  //
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
  let retFrontInfo = GlobalFunc.process_FrontPanelConstruction(
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
  //let CarcaseSpaceDimension = JSON.parse(this.mod_CarcaseSpaceDimension[0]);

    // Retrieve Oversize from Calcualtions function
  const OversizeInfo = GlobalFunc.calc_FrontOversize(this, 'fixedfront');

  //===================================================
  //          Add module for the front panel
  //===================================================

  let Front: any;
  let DrawerDesign = retFrontInfo.retFrontConstruction.FrontModuleId;

  // Add the module
  if (DrawerDesign == "FrontPanel01") {
    Front = this.addOD_M_mc_FrontPanel01();
  }
  else if (DrawerDesign == "WoodFrame01") {
    Front = this.addOD_M_mc_PanelWoodFrame01();
  }
  else if (DrawerDesign == "AlluminiumFrame01") {
    Front = this.addOD_M_mc_MetalFrame01();
  }
  else if (DrawerDesign == "ThermoformedFrame01") {
    Front = this.addOD_M_mc_ThermoformedPanel01();
  }
  else {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 22036', 1);
    logError(ErrorMessage.Message(''));
  }

  // Set values to the attributes of the child
  Front.mod_Width = retFrontInfo.width + OversizeInfo.OversizeLeft + OversizeInfo.OversizeRight;
  Front.mod_Height = retFrontInfo.height + OversizeInfo.OversizeTop + OversizeInfo.OversizeBottom;
  Front.mod_Depth = retFrontInfo.thickness;
  Front.mod_FrontType = "Fixedfront";
  Front.mod_Information = JSON.stringify(retFrontInfo);

  // setOrigin
  Front.setOrigin(retFrontInfo.posX - OversizeInfo.OversizeLeft, retFrontInfo.posY - OversizeInfo.OversizeBottom, retFrontInfo.posZ);
  frontWeight = retFrontInfo.weight;

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