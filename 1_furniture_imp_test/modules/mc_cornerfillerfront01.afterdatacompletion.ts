  // Schuler Consulting
  // Create: March 2024
  // By Joao Lisboa
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateAfterDataCompletion of mc_CornerFillerFront01
  // Copied from mc_Door01 --> The adjustments are marqued with the comment ////////////////////////////ADJUSTMENT FROM mc_Door01 TO mc_CornerFillerFront01
  // Revisions:
  //
  //===================================================

  //===================================================
  //          Call the tables and get information
  //===================================================

  // Retrive all the information about the handlestrip
  let FrontRed = 0;
  let HandleHeight = 0;
  let retHandleStripInfo: any;

  if (this.mod_HandleDesign_matrix.HandleType == "Handlestrip") {
    retHandleStripInfo = GlobalFunc.process_HandlestripPos(this);
    FrontRed = retHandleStripInfo.FrontReduction;
    HandleHeight = retHandleStripInfo.HandleH;
  }

  // Retrieve information for the front construction
  let handlePosType = GlobalFunc.find_HandleSettings(this.mod_HandlePosType, 'Door').HandleOrientation!;
  const retDoorInfo = GlobalFunc.process_FrontPanelConstruction(
    this,
    this.mod_FrontType,
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

  let Door: any;
  let FillerDesign = retDoorInfo.retFrontConstruction.FrontModuleId;

  // Add the module
  //---------------------------------------------------

  if (FillerDesign == "FrontPanel01") {
    Door = this.addOD_M_mc_FrontPanel01();
  }
  else if (FillerDesign == "WoodFrame01") {
    Door = this.addOD_M_mc_PanelWoodFrame01();
  }
  else if (FillerDesign == "AlluminiumFrame01") {
    Door = this.addOD_M_mc_MetalFrame01();
  }
  else if (FillerDesign == "ThermoformedFrame01") {
    Door = this.addOD_M_mc_ThermoformedPanel01();
  }
  else {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 22004', 1);
    logError(ErrorMessage.Message(''));
  }

  // Set values to the attributes of the child
  Door.mod_Width = retDoorInfo.width;
  Door.mod_Height = retDoorInfo.height;
  Door.mod_Depth = retDoorInfo.thickness;
  Door.mod_Information = JSON.stringify(retDoorInfo);


  ////////////////////////////ADJUSTMENT FROM mc_Door01 TO mc_CornerFillerFront01
  //Door.mod_FrontType = "DoorLeft";
  //if (this.mod_DoorDirection == 'Right'){Door.mod_FrontType = "DoorRight"}
  Door.mod_FrontType = this.mod_FrontType + "Left";
  if (this.mod_DoorDirection == 'Right') { Door.mod_FrontType = this.mod_FrontType + "Right" }
  Door.mod_CornerunitStraightFillerConstruction = this.mod_CornerunitStraightFillerConstruction;
  Door.mod_CarcaseDirection = this.mod_CarcaseDirection;

  // setOrigin
  Door.setOrigin(retDoorInfo.posX, retDoorInfo.posY, retDoorInfo.posZ);

  //===================================================
  //          Add module for the handle strip
  //===================================================

  ////////////////////////////ADJUSTMENT FROM mc_Door01 TO mc_CornerFillerFront01
  //if (this.mod_HandleDesign_matrix.HandleType == "Handlestrip") 
  if (this.mod_HandleDesign_matrix.FillerRelevant == true && this.mod_HandleDesign_matrix.HandleType == "Handlestrip") {
    // Add the module
    let HandleStrip = this.addOD_M_mc_Handlestrip01();
    HandleStrip.mod_Information = JSON.stringify(retHandleStripInfo);

    // Set values to the attributes of the child
    HandleStrip.mod_FrontType = "GroupDoor";
    if (handlePosType == 'StripeLeft' || handlePosType == 'StripeRight') {
      HandleStrip.mod_Height = this.mod_FrontHeight - this.mod_FrontGapHor;
    }
    else {
      HandleStrip.mod_Width = this.mod_FrontWidth - this.mod_FrontGapVert;
    }
    HandleStrip.mod_Depth = this.mod_FrontThk;

    // setOrigin
    //---------------------------------------------------

    //=> Handle on the top
    if (handlePosType == 'StripeTop') {
      HandleStrip.setOrigin(this.mod_FrontGapVert / 2, this.mod_FrontHeight - HandleHeight, 0);
    }
    //=> Handle on the Bottom
    else if (handlePosType == 'StripeBtm') {
      HandleStrip.setOrigin(this.mod_FrontGapVert / 2, 0, 0);
    }
    //=> Handle on the Left
    else if (handlePosType == 'StripeLeft') {
      HandleStrip.setOrigin(this.mod_FrontGapVert / 2, 0, 0);
    }
    //=> Handle on the Right
    else if (handlePosType == 'StripeRight') {
      HandleStrip.setOrigin(this.mod_FrontWidth - this.mod_FrontGapVert / 2 - HandleHeight, 0, 0);
    }
  }

  //===================================================
  //          Add module for the handle
  //===================================================

    ////////////////////////////ADJUSTMENT FROM mc_Door01 TO mc_CornerFillerFront01
  //else if (this.mod_HandleDesign_matrix.HandleType == "Handle") 
  else if (this.mod_HandleDesign_matrix.FillerRelevant == true && this.mod_HandleDesign_matrix.HandleType == "Handle") {
    // Add the module
    let Handles = this.addOD_M_mc_Handle01();

    // Set values to the attributes of the child

    Handles.mod_Width = retDoorInfo.width;
    Handles.mod_Height = retDoorInfo.height;
    Handles.mod_Depth = retDoorInfo.thickness;

    // Provide Information about part on which the handle is positioned
    Handles.mod_FrontType = 'part_Door';
    Handles.mod_PartInfo = this.mod_DoorDirection;

    // setOrigin
    Handles.setOrigin(retDoorInfo.posX, retDoorInfo.posY, retDoorInfo.posZ);
  }




  //===================================================
  //          Process Filler Hardware (for Corner filler)
  //===================================================
  if (this.mod_FrontType == 'CornerFiller') {
    let fillerHardwareInfo: any
    if (this.mod_Direction == 'Right') {
      fillerHardwareInfo = GlobalFunc.process_FillerHardware(this, retDoorInfo.width, retDoorInfo.height, this.mod_Originpos[0] + retDoorInfo.posX, this.mod_Originpos[1] + this.mod_FrontPosStart + retDoorInfo.posY, 'FromFront');
    }
    else {
      fillerHardwareInfo = GlobalFunc.process_FillerHardware(this, retDoorInfo.width, retDoorInfo.height, this.mod_Originpos[2] + retDoorInfo.posX, this.mod_Originpos[1] + this.mod_FrontPosStart + retDoorInfo.posY, 'FromRight');
    }
    let fillerHardwareInfoJson = JSON.stringify(fillerHardwareInfo);
    this.mod_FillerHardwareInfo.push(fillerHardwareInfoJson);
  }