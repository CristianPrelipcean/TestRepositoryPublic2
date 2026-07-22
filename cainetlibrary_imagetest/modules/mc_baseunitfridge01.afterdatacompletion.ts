  // Schuler Consulting
  // Create: October 2025
  // By Anni Chen
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mc_BaseunitFridge01
  // Add module for the front panel
  // Add module for the handle
  // Add module for the appliance graphic
  //
  // Revisions:
  //
  //===================================================

  //===================================================
  //          Call the tables and get information
  //===================================================

  // Get the data from the BaseunitFridgeInfo
  let dwInfo = JSON.parse(this.mod_BaseunitFridgeInfo[0]);

  // Retrive all the information about the handlestrip
  let frontWeight = 0;
  let handleWeight = 0;

  // Retrieve information for the front construction
  const handlePosType = GlobalFunc.find_HandleSettings(this.mod_HandlePosType, 'Door').HandleOrientation!;
  const retDoorInfo = GlobalFunc.process_FrontPanelConstruction(
    this,
    'Door',
    this.mod_FrontProgram,
    this.mod_FrontWidth,
    this.mod_FrontHeight,
    this.mod_HandleDesign_matrix.HandleDesignGroup!,
    handlePosType,
    this.mod_FrontColor_matrix.GrainGroupId
  )

  //===================================================
  //          Add module for the front panel
  //===================================================

  if (dwInfo.Integration !== 'NoPanel') {
    let Door: any;
    let DoorDesign = retDoorInfo.retFrontConstruction.FrontModuleId;

    // Add the module
    if (DoorDesign == "FrontPanel01") {
      Door = this.addOD_M_mc_FrontPanel01();
    }
    else if (DoorDesign == "WoodFrame01") {
      Door = this.addOD_M_mc_PanelWoodFrame01();
    }
    else {
      let ErrorMessage = GlobalFunc.find_ErrorList('Error 22035', 1);
      logError(ErrorMessage.Message(''));
    }

    // Set values to the attributes of the child if Door is correctly created
    Door.mod_Width = retDoorInfo.width;
    Door.mod_Height = retDoorInfo.height;
    Door.mod_Depth = retDoorInfo.thickness;
    Door.mod_FrontType = "BaseunitFridge";
    Door.mod_Information = JSON.stringify(retDoorInfo);
    Door.mod_DoorDirection = this.mod_DoorDirection;

    // setOrigin
    Door.setOrigin(retDoorInfo.posX, retDoorInfo.posY, retDoorInfo.posZ);

    // Get the front weight
    frontWeight = retDoorInfo.weight;
  }

  //===================================================
  //          Add module for the handle
  //===================================================

  if (this.mod_HandleDesign_matrix.HandleType == "Handle" && dwInfo.Integration !== 'NoPanel') {

    // Add the module
    let Handle = this.addOD_M_mc_Handle01(3);

    // Set values to the attributes of the child
    Handle.mod_Width = retDoorInfo.width;
    Handle.mod_Height = retDoorInfo.height;
    Handle.mod_Depth = retDoorInfo.thickness;

    // Provide Information about part on which the handle is positioned
    Handle.mod_FrontType = 'part_BaseunitFridgePanel';
    Handle.mod_PartInfo = this.mod_DoorDirection;

    // setOrigin
    Handle.setOrigin(retDoorInfo.posX, retDoorInfo.posY, retDoorInfo.posZ);

    // Seal the handle to get the frontWeight
    let sealedHandle = Handle.seal();
    handleWeight = sealedHandle.mod_HandleWeightCalculations[0];

  }

  //===================================================================================
  // Add the graphic module for appliances
  //===================================================================================

  if (dwInfo.GraphicId) {

    // Add the module
    let Graphic = this.addOD_M_mc_ApplianceGraphic();

    // Set the attributes
    Graphic.mod_GraphicId = dwInfo.GraphicId;

    // Set origin
    Graphic.setOrigin(retDoorInfo.posX + retDoorInfo.width / 2, this.mod_Originpos[3], 0);
  }