
  // Schuler Consulting
  // Create: September 2023
  // By Stefano Cortese
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mc_Door01
  // Add module for the front panel
  // Add module for the handle strip
  // Add module for the handle
  // Add module for the hinges
  //
  // Revisions:
  // Feb 2024 Stefano Cortese
  // Add the possibility to insert different front construction modules
  //
  // 18.03.2024 Ludwig Weber
  // Optimization on the code
  //
  // 18.10.2024 Ludwig Weber
  // Add Error handling
  //
  // 10.12.2024 Stefano Cortese
  // Exception to exclude the hinges (for the fridge)
  //===================================================

  //===================================================
  //          Call the tables and get information
  //===================================================

  const retDoorInfo = GlobalFunc.process_FrontPanelConstruction(
    this,
    'Filler',
    this.mod_FrontProgram,
    this.mod_FrontWidth,
    this.mod_FrontHeight,
    'All',
    'All',
    this.mod_FrontColor_matrix.GrainGroupId
  )
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
  else if (DoorDesign == "AlluminiumFrame01") {
    Door = this.addOD_M_mc_MetalFrame01();
  }
  else if (DoorDesign == "ThermoformedFrame01") {
    Door = this.addOD_M_mc_ThermoformedPanel01();
  }
  else {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 22035', 1);
    logError(ErrorMessage.Message(''));
  }

  // Retrieve Oversize from Calcualtions function
  const OversizeInfo = GlobalFunc.calc_FrontOversize(this, "filler", this.mod_DoorDirection);

  // Set values to the attributes of the child if Door is correctly created
  Door.mod_Width = retDoorInfo.width + OversizeInfo.OversizeLeft + OversizeInfo.OversizeRight;
  Door.mod_Height = retDoorInfo.height + OversizeInfo.OversizeTop + OversizeInfo.OversizeBottom;
  Door.mod_Depth = retDoorInfo.thickness;
  Door.mod_FrontType = this.mod_Direction === "Right" ? "FillerRight" : "FillerLeft";
  Door.mod_DoorDirection = this.mod_Direction;
  Door.mod_Information = JSON.stringify(retDoorInfo);

  // setOrigin
  Door.setOrigin(retDoorInfo.posX - OversizeInfo.OversizeLeft, retDoorInfo.posY - OversizeInfo.OversizeBottom, retDoorInfo.posZ);

  //===================================================
  //          Process Filler Hardware
  //===================================================
  let fillerHardwareInfo = GlobalFunc.process_FillerHardware(this, retDoorInfo.width, retDoorInfo.height, retDoorInfo.posX + this.mod_Originpos[0], this.mod_FrontPosStart + retDoorInfo.posY, 'FromFront');
  let fillerHardwareInfoJson = JSON.stringify(fillerHardwareInfo);
  this.mod_FillerHardwareInfo.push(fillerHardwareInfoJson);