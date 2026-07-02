
  // Schuler Consulting
  // Create: April 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mc_Dishwasher
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

  // Retrive all the information about the handlestrip
  let FrontRed = 0;
  let HandleHeight = 0;
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
  // Get the data from the DishwasherInfo
  let dwInfo = JSON.parse(this.mod_DishwasherInfo[0]);

  //===================================================
  //          Add module for the front panel
  //===================================================

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
  Door.mod_FrontType = "Dishwasher";
  Door.mod_Information = JSON.stringify(retDoorInfo);

  // setOrigin
  Door.setOrigin(retDoorInfo.posX, retDoorInfo.posY, retDoorInfo.posZ);

  // Get the front weight
  frontWeight = retDoorInfo.weight;

  //===================================================
  //          Add module for the handle
  //===================================================

  if (this.mod_HandleDesign_matrix.HandleType == "Handle" && dwInfo.Integration === 'full') {

    // Add the module
    let Handle = this.addOD_M_mc_Handle01(3);

    // Set values to the attributes of the child
    Handle.mod_Width = retDoorInfo.width;
    Handle.mod_Height = retDoorInfo.height;
    Handle.mod_Depth = retDoorInfo.thickness;

    // Provide Information about part on which the handle is positioned
    Handle.mod_FrontType = 'part_DishwasherPanel';
    Handle.mod_PartInfo = 'All';

    // setOrigin
    Handle.setOrigin(retDoorInfo.posX, retDoorInfo.posY, retDoorInfo.posZ);

    // Seal the handle to get the frontWeight
    let sealedHandle = Handle.seal();
    handleWeight = sealedHandle.mod_HandleWeightCalculations[0];

  }

  //===================================================================================
  // Add the graphic module for appliances
  //===================================================================================

  // Check if it is found in the table
  if (dwInfo.GraphicId) {

    // Add the module
    let Graphic = this.addOD_M_mc_ApplianceGraphic();

    // Set the attributes
    Graphic.mod_GraphicId = dwInfo.GraphicId;

    // Set origin
    Graphic.setOrigin(retDoorInfo.posX + retDoorInfo.width / 2, this.mod_Originpos[3], 0);
  }