
  // Schuler Consulting
  // Create: September 2025
  // By Maximilian Mertens
  // Purpose: CabinetLibrary
  //
  // Description:
  // Add module for the front panel
  // Add module for the handle strip
  // Add module for the handle
  // Add module for the hardware
  //
  // Revisions: 
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

  //Get CarcaseSpace Information
  const CarcaseSpaceDimension = JSON.parse(this.mod_CarcaseSpaceDimension[0]);

  // Get the Information of the Carcase Parts Info
  // const carcasePartInfo = JSON.parse(this.mod_CarcasePartInfo[0]);

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

  // Retrieve Oversize from Calcualtions function
  const OversizeInfo = GlobalFunc.calc_FrontOversize(this, "pullout");

  //===================================================
  //          Add module for the front panel
  //===================================================

  let PullOut: any;
  let PullOutDesign = retDrawerInfo.retFrontConstruction.FrontModuleId;

  // Add the module
  if (PullOutDesign == "FrontPanel01") {
    PullOut = this.addOD_M_mc_FrontPanel01();
  }
  else if (PullOutDesign == "WoodFrame01") {
    PullOut = this.addOD_M_mc_PanelWoodFrame01();
  }
    /*
  else if (PullOutDesign == "AlluminiumFrame"){
    PullOut = this.addOD_M_mc_MetalFrame01();
  }
  else if (PullOutDesign == "ThermoformedFrame"){
    PullOut = this.addOD_M_mc_ThermoformedPanel01();
  }
  */
  else {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 22036', 1);
    logError(ErrorMessage.Message(''));
  }

  // Set values to the attributes of the child
  PullOut.mod_Width = retDrawerInfo.width + OversizeInfo.OversizeLeft + OversizeInfo.OversizeRight;
  PullOut.mod_Height = retDrawerInfo.height + OversizeInfo.OversizeTop + OversizeInfo.OversizeBottom;
  PullOut.mod_Depth = retDrawerInfo.thickness;
  PullOut.mod_FrontType = "Pullout";
  PullOut.mod_Information = JSON.stringify(retDrawerInfo);

  // setOrigin
  PullOut.setOrigin(retDrawerInfo.posX - OversizeInfo.OversizeLeft, retDrawerInfo.posY - OversizeInfo.OversizeBottom, retDrawerInfo.posZ);
  let SealedDrawer = PullOut.seal();
  frontWeight = SealedDrawer.mod_FrontpanelWeightCalculations[0];

  //===================================================
  //          Add module for the handle strip
  //===================================================

  if (this.mod_HandleDesign_matrix.HandleType == "Handlestrip") {
    // Add the module
    let HandleStrip = this.addOD_M_mc_Handlestrip01();

    // Set values to the attributes of the child
    //HandleStrip.mod_FrontType = "GroupDrawer";
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

  else if (this.mod_HandleDesign_matrix.HandleType == "Handle" || this.mod_HandleDesign_matrix.HandleType == "InsetHandle") {

    // Add the module
    let Handle = this.addOD_M_mc_Handle01();

    // Set values to the attributes of the child
    Handle.mod_Width = retDrawerInfo.width;
    Handle.mod_Height = retDrawerInfo.height;
    Handle.mod_Depth = retDrawerInfo.thickness;

    // Provide Information about part on which the handle is positioned
    Handle.mod_FrontType = 'part_Pullout';
    Handle.mod_PartInfo = 'None';

    // setOrigin
    Handle.setOrigin(retDrawerInfo.posX, retDrawerInfo.posY, retDrawerInfo.posZ);

    // Seal the handle to get the frontWeight
    let sealedHandle = Handle.seal();
    handleWeight = sealedHandle.mod_HandleWeightCalculations[0];
    PullOut.mod_HardwareTypeList.push(sealedHandle.mod_HardwareTypeList[0]);	
  }

  //===================================================
  //          Add module for hardware
  //===================================================

  // Add the module
  let pulloutHardware = this.addOD_M_mc_PulloutHardware01();

  // Set values to the attributes of the child
  pulloutHardware.mod_PulloutType = this.mod_PulloutType;
  pulloutHardware.mod_PulloutDesign = this.mod_PulloutDesign;
  pulloutHardware.mod_PulloutElementColor = this.mod_PulloutElementColor;

  // setOrigin
  if (this.mod_PulloutConnectionPosition == 'left') {
    pulloutHardware.setOrigin(CarcaseSpaceDimension.WidthFreeStartPos, CarcaseSpaceDimension.HeightFreeStartPos, 0);
  }
  else if (this.mod_PulloutConnectionPosition == 'right') {
    pulloutHardware.setOrigin(CarcaseSpaceDimension.WidthFreeStartPos + CarcaseSpaceDimension.WidthFreeSpace, CarcaseSpaceDimension.HeightFreeStartPos, 0);
  }