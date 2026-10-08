
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
  const carcasePartInfo = JSON.parse(this.mod_CarcasePartInfo[0]);

  // Retrieve front overlay on bottom from Calcualtions function (That will be correct here)
  const overlayBtm = GlobalFunc.calc_FrontOverlay(this, this.mod_FrontWidth, this.mod_FrontHeight, this.mod_Originpos[0], this.mod_FrontPosStart, 'FromFront').Bottom;

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
    this.mod_FrontColor_matrix.GrainGroupId,
    overlayBtm
  )

  // Retrieve Oversize from Calcualtions function
  const OversizeInfo = GlobalFunc.calc_FrontOversize(this, "door", this.mod_DoorDirection);

  // Retrieve front overlay from Calcualtions function (Second time now the dimensions are finally calculated)
  const iFrontOverlay = GlobalFunc.calc_FrontOverlay(this, retDoorInfo.width, retDoorInfo.height, retDoorInfo.posX + this.mod_Originpos[0], this.mod_FrontPosStart + retDoorInfo.posY, 'FromFront');

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
  else if (DoorDesign == "SegmentFront01") {
    Door = this.addOD_M_mc_SegmentFront01();
    Door.mod_FrontSegmentColor = retDoorInfo.frontSegmentColor;
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

  // Set values to the attributes of the child if Door is correctly created
  if (Door) {
    Door.mod_Width = retDoorInfo.width + OversizeInfo.OversizeLeft + OversizeInfo.OversizeRight;
    Door.mod_Height = retDoorInfo.height + OversizeInfo.OversizeTop + OversizeInfo.OversizeBottom;
    Door.mod_Depth = retDoorInfo.thickness;
    Door.mod_FrontType = this.mod_DoorDirection === "Right" ? "DoorRight" : "DoorLeft";
    Door.mod_DoorDirection = this.mod_DoorDirection;
    Door.mod_Information = JSON.stringify(retDoorInfo);

    // setOrigin
    Door.setOrigin(retDoorInfo.posX - OversizeInfo.OversizeLeft, retDoorInfo.posY - OversizeInfo.OversizeBottom, retDoorInfo.posZ);

    // Get the front weight
    frontWeight = retDoorInfo.weight;
  }

  //===================================================
  //          Add module for the handle strip
  //===================================================

  if (this.mod_HandleDesign_matrix.HandleType === "Handlestrip") {

    // Create map of positions for the setOrigin
    const handlePositionConfig = new Map([
      ["StripeTop", (HandleStrip: any) => HandleStrip.setOrigin(this.mod_FrontGapVert / 2, this.mod_FrontHeight - HandleHeight, 0)],
      ["StripeBtm", (HandleStrip: any) => HandleStrip.setOrigin(this.mod_FrontGapVert / 2, 0, 0)],
      ["StripeLeft", (HandleStrip: any) => HandleStrip.setOrigin(this.mod_FrontGapVert / 2, 0, 0)],
      ["StripeRight", (HandleStrip: any) => HandleStrip.setOrigin(this.mod_FrontWidth - this.mod_FrontGapVert / 2 - HandleHeight, 0, 0)]
    ]);

    // Add the module for the handle strip
    let HandleStrip = this.addOD_M_mc_Handlestrip01(2);
    HandleStrip.mod_Information = JSON.stringify(retHandleStripInfo);
    HandleStrip.mod_FrontType = "GroupDoor";

    // Set values to the attributes of the child
    if (handlePosType === 'StripeLeft' || handlePosType === 'StripeRight') {
      HandleStrip.mod_Height = this.mod_FrontHeight - this.mod_FrontGapHor;
    }
    else {
      HandleStrip.mod_Width = this.mod_FrontWidth - this.mod_FrontGapVert;
    }
    HandleStrip.mod_Depth = this.mod_FrontThk;

    // Apply setOrigin based on HandlePosType or log error if not valid
    const setOriginFunc = handlePositionConfig.get(handlePosType);
    if (setOriginFunc) {
      setOriginFunc(HandleStrip);
    }
    else {
      logError(GlobalFunc.find_ErrorList('Error 22025', 1).Message(''));
    }
  }

  //===================================================
  //          Add module for the handle
  //===================================================

  else if ((this.mod_HandleDesign_matrix.HandleType == "Handle" || this.mod_HandleDesign_matrix.HandleType == "InsetHandle") && this.mod_HandleInsertion) {

    // Add the module
    let Handle = this.addOD_M_mc_Handle01(3);

    // Set values to the attributes of the child
    Handle.mod_Width = retDoorInfo.width;
    Handle.mod_Height = retDoorInfo.height;
    Handle.mod_Depth = retDoorInfo.thickness;

    // Provide Information about part on which the handle is positioned
    Handle.mod_FrontType = 'part_Door';
    Handle.mod_PartInfo = this.mod_DoorDirection;

    // setOrigin
    Handle.setOrigin(retDoorInfo.posX, retDoorInfo.posY, retDoorInfo.posZ);

    // Seal the handle to get the frontWeight
    let sealedHandle = Handle.seal();
    handleWeight = sealedHandle.mod_HandleWeightCalculations[0];
    Door.mod_HardwareTypeList.push(sealedHandle.mod_HardwareTypeList[0]);
  }

  //===================================================
  //          Add module for the duststrip
  //===================================================

  if (this.mod_VertDividerType == 'DustStripLeft' && this.mod_DoorDirection == 'Left') {
    let Duststrip = this.addOD_M_mc_Duststrip01(4);
    Duststrip.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);
    Duststrip.setOrigin(this.mod_FrontWidth, CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1], 0);
  }

  else if (this.mod_VertDividerType == 'DustStripRight' && this.mod_DoorDirection == 'Right') {
    let Duststrip = this.addOD_M_mc_Duststrip01(4);
    Duststrip.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);
    Duststrip.setOrigin(0, CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1], 0);
  }

  //===================================================
  //          Add module for the Push To Open
  //===================================================

  if (this.mod_OpeningType == 'PushToOpenManual') {
    try {
      //---------------Run PushToOpen Process-----------------
      let retPushToOpen = GlobalFunc.process_Pushtoopen(this,
        this.mod_FrontPosStart + this.mod_HeightPosInsertion,
        retDoorInfo.height, iFrontOverlay, this.mod_DoorDirection, 'Doors', retDoorInfo.retFrontConstruction.FrontConstructionId
      );

      if (!retPushToOpen) throw new Error('Missing data for the push to open');

      //---------------Add module-----------------
      let pushToOpen = this.addOD_M_mc_Pushtoopen01(5);
      if (!pushToOpen) throw new Error('The module for push to open is not existing!');

      //---------------Pass info from process to module-----------------
      let pushToOpenInfo: any = {
        FrontWidth: retDoorInfo.width,
        FrontHeight: retDoorInfo.height,
        FrontWidthPos: retDoorInfo.posX,
        MinFrontGapCarcase: retPushToOpen.MinFrontGapCarcase,
        Part: retPushToOpen.Part,
        PositionHeight: retPushToOpen.PositionHeight,
        PositionWidth: retPushToOpen.PositionWidth,
        Type: retPushToOpen.Type,
        CarcaseHardwareItem: retPushToOpen.CarcaseHardwareItem,
        CarcaseProcessingItem: retPushToOpen.CarcaseProcessingItem,
        CarcaseGraphic: retPushToOpen.CarcaseGraphic,
        PartThk: retPushToOpen.PartThk,
        Offset: retPushToOpen.Offset,
        PosThk: retPushToOpen.PosThk
      };

      let strJson = JSON.stringify(pushToOpenInfo);
      pushToOpen.mod_PushtoopenInfo.push(strJson);

      //---------------Pass carcasePartInfo to module-----------------
      let strJsoncarcasePartInfo = JSON.stringify(carcasePartInfo);
      pushToOpen.mod_CarcasePartInfo.push(strJsoncarcasePartInfo);

      //---------------SetOrigin to module-----------------
      pushToOpen.setOrigin(this.mod_FrontGapVert / 2, 0, 0);
      pushToOpen.mod_Originpos.push(this.mod_Originpos[0] + this.mod_FrontGapVert / 2);
      pushToOpen.mod_Originpos.push(this.mod_Originpos[1]);
      pushToOpen.mod_Originpos.push(this.mod_Originpos[2]);

    }
    catch (error: any) {
      let ErrorMessage = GlobalFunc.find_ErrorList('Error 22006', 1);
      logError(ErrorMessage.Message(error.message));
    }
  }

  //===================================================
  //          Add module for the hinges
  //===================================================

  if (this.mod_HingeType !== 'NoHinges') {

    //---------------Add the module-----------------
    let HingeGroup = this.addOD_M_mc_HingeGroup01();

    //---------------Pass attributes to module-----------------
    HingeGroup.mod_Width = retDoorInfo.width;
    HingeGroup.mod_Height = retDoorInfo.height;
    HingeGroup.mod_Depth = retDoorInfo.thickness;
    HingeGroup.mod_FrontType = this.mod_DoorDirection === "Right" ? "DoorRight" : "DoorLeft";
    HingeGroup.mod_Originpos.push(this.mod_Originpos[0] + this.mod_FrontGapVert / 2);
    HingeGroup.mod_Originpos.push(this.mod_Originpos[1]);
    HingeGroup.mod_Originpos.push(this.mod_Originpos[2]);

    //---------------Pass carcasePartInfo to module-----------------
    let strJsoncarcasePartInfo = JSON.stringify(carcasePartInfo);
    HingeGroup.mod_CarcasePartInfo.push(strJsoncarcasePartInfo);

    //---------------Pass FrontPanelConstruction information to module-----------------
    HingeGroup.mod_Information = JSON.stringify(retDoorInfo);

    //--------------- setOrigin-----------------
    HingeGroup.setOrigin(retDoorInfo.posX, retDoorInfo.posY, retDoorInfo.posZ);

    //===================================================
    // Seal mc_HingeGroup01 and get attribute with OpeningAngle 
    //===================================================
    let sealedHingeGroup = HingeGroup.seal();
    this.mod_OpeningAngle.push(sealedHingeGroup.mod_OpeningAngle[0]);

  }