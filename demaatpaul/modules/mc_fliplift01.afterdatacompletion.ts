  // Schuler Consulting
  // Create: October 2024
  // By Henning Wiesbrock
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mc_Fliplift01
  // Add module for the front panel
  // Add module for the handle strip
  // Add module for the handle
  // Add module for the hinges
  // Add module for hardware and fittings
  //
  // Revisions: 
  // Add the hardware and fittings
  // By Ludwig Weber
  // Feb 2025
  //===================================================

  //===================================================
  //          Call the tables and get information
  //===================================================

  // Retrive all the information about the handlestrip
  let FrontRed = 0;
  let HandleHeight = 0;
  let handleWeight = this.mod_HandleWeightCalculations?.[0] ?? 0;
  let retHandleStripInfo: any;

  if (this.mod_HandleDesign_matrix.HandleType == "Handlestrip") {
    retHandleStripInfo = GlobalFunc.process_HandlestripPos(this);
    FrontRed = retHandleStripInfo.FrontReduction;
    HandleHeight = retHandleStripInfo.HandleH;
  }

  //Get CarcaseSpace Information
  let CarcaseSpaceDimension = JSON.parse(this.mod_CarcaseSpaceDimension[0]);

  // Get the Information of the Carcase Parts Info
  let carcasePartInfo = JSON.parse(this.mod_CarcasePartInfo[0]);

  // Retrieve information for the front construction
  let handlePosType = GlobalFunc.find_HandleSettings(this.mod_HandlePosType, 'Fliplift').HandleOrientation!;
  const retFlipLiftInfo = GlobalFunc.process_FrontPanelConstruction(
    this,
    'Fliplift',
    this.mod_FrontProgram,
    this.mod_FrontWidth,
    this.mod_FrontHeight,
    this.mod_HandleDesign_matrix.HandleDesignGroup!,
    handlePosType,
    this.mod_FrontColor_matrix.GrainGroupId
  )

  // Retrieve Oversize from Calcualtions function
  const OversizeInfo = GlobalFunc.calc_FrontOversize(this, 'fliplift', this.mod_FlipliftType);

  //===================================================
  //          Add module for the front panel
  //===================================================

  let fliplift: any;
  let FlipliftDesign = retFlipLiftInfo.retFrontConstruction.FrontModuleId;

  // Add the module
  if (FlipliftDesign == "FrontPanel01") {
    fliplift = this.addOD_M_mc_FrontPanel01();
  }
  else if (FlipliftDesign == "WoodFrame01") {
    fliplift = this.addOD_M_mc_PanelWoodFrame01();
  }
  else if (FlipliftDesign == "AlluminiumFrame01") {
    fliplift = this.addOD_M_mc_MetalFrame01();
  }
  else if (FlipliftDesign == "ThermoformedFrame01") {
    fliplift = this.addOD_M_mc_ThermoformedPanel01();
  }
  else {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 22034', 1);
    logError(ErrorMessage.Message(''));
  }

  // Set values to the attributes of the child
  fliplift.mod_Width = retFlipLiftInfo.width + OversizeInfo.OversizeLeft + OversizeInfo.OversizeRight;
  fliplift.mod_Height = retFlipLiftInfo.height + OversizeInfo.OversizeTop + OversizeInfo.OversizeBottom;
  fliplift.mod_Depth = retFlipLiftInfo.thickness;
  fliplift.mod_FrontType = 'Fliplift';
  fliplift.mod_FlipliftType = this.mod_FlipliftType;
  fliplift.mod_Information = JSON.stringify(retFlipLiftInfo);

  // setOrigin
  fliplift.setOrigin(retFlipLiftInfo.posX - OversizeInfo.OversizeLeft, retFlipLiftInfo.posY - OversizeInfo.OversizeBottom, retFlipLiftInfo.posZ);

  // Get the front weight
  let frontWeight = retFlipLiftInfo.weight;
  if (this.mod_FlipliftType === 'FHF') {
    let totalHeight = this.mod_FlipliftFrontHeightList.reduce((sum, value) => sum + value, 0);
    let thisHeight = this.mod_FrontHeight;
    frontWeight = (frontWeight / thisHeight) * totalHeight;
  }

  //===================================================
  //          Add module for the handle strip
  //===================================================

  if (this.mod_HandleDesign_matrix.HandleType == "Handlestrip" && !this.mod_FrontId.includes("Top")) {
    // Add the module
    let HandleStrip = this.addOD_M_mc_Handlestrip01();

    // Set values to the attributes of the child
    HandleStrip.mod_FrontType = "GroupFliplift";
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

  else if (this.mod_HandleDesign_matrix.HandleType == "Handle" && this.mod_FlipliftFrontNumber == 0) {
    // Add the module
    let Handle = this.addOD_M_mc_Handle01();

    // Set values to the attributes of the child
    Handle.mod_Width = retFlipLiftInfo.width;
    Handle.mod_Height = retFlipLiftInfo.height;
    Handle.mod_Depth = retFlipLiftInfo.thickness;

    // Provide Information about part on which the handle is positioned
    Handle.mod_FrontType = 'part_Fliplift';
    Handle.mod_PartInfo = this.mod_FlipliftType;

    // setOrigin
    Handle.setOrigin(retFlipLiftInfo.posX, retFlipLiftInfo.posY, retFlipLiftInfo.posZ);

    // Seal the handle to get the frontWeight
    let sealedHandle = Handle.seal();
    handleWeight = sealedHandle.mod_HandleWeightCalculations[0];
    this.mod_HandleWeightCalculations.push(handleWeight);
  }

  //===================================================
  //          Calculate FrontOverlay
  //===================================================

  let iFrontOverlay = GlobalFunc.calc_FrontOverlay(
    this, retFlipLiftInfo.width,
    retFlipLiftInfo.height,
    retFlipLiftInfo.posX + this.mod_Originpos[0],
    this.mod_FrontPosStart + retFlipLiftInfo.posY, 'FromFront'
  );
  let jsonFrontOverlay = JSON.stringify(iFrontOverlay);

  //===================================================
  //          Add module for hardware and fittings
  //===================================================

  // Add the module
  let hardware = this.addOD_M_mc_FlipliftHardware01();

  // Set the attributes
  hardware.mod_Width = CarcaseSpaceDimension.WidthFreeSpace;
  hardware.mod_Height = CarcaseSpaceDimension.HeightFreeSpace;
  hardware.mod_Depth = CarcaseSpaceDimension.DepthFreeSpace;
  hardware.mod_FrontType = this.mod_FlipliftType == 'DF' ? 'FlipliftDown' : 'FlipliftUp';
  hardware.mod_FlipliftFrontHeightList.push(...this.mod_FlipliftFrontHeightList);
  hardware.mod_FrontOverlayInfo = jsonFrontOverlay;
  hardware.mod_FrontpanelWeightCalculations.push(frontWeight);
  hardware.mod_HandleWeightCalculations.push(handleWeight);

  // setOrigin
  hardware.setOrigin(CarcaseSpaceDimension.WidthFreeStartPos, 0, 0);

  // Seal the hardware to retrieve the information regarding hinges and push to open
  let sealedHardware = hardware.seal();
  let txtPushToOpen = sealedHardware.mod_HardwareTypeList[0];
  let txtHinges = sealedHardware.mod_HardwareTypeList[1];
  let flipLiftHardwareType = sealedHardware.mod_HardwareTypeList[3];
  let hingeClass = sealedHardware.mod_HardwareTypeList[2];
  this.mod_OpeningAngle[0] = sealedHardware.mod_OpeningAngle[0];

  // Logic when to insert hinges and push to open
  let boolHinges = txtHinges === 'true' &&
    ((this.mod_FlipliftType === 'FHF' && this.mod_FlipliftFrontNumber === 1) ||
      (this.mod_FlipliftType !== 'FHF' && this.mod_FlipliftFrontNumber === 0));

  let boolPushToOpen = txtPushToOpen === 'true' && this.mod_FlipliftFrontNumber === 0;

  //===================================================
  //          Add module for the Push To Open
  //===================================================

  if (boolPushToOpen && this.mod_OpeningType == 'PushToOpenManual') {
    try {
      //---------------Run PushToOpen Process-----------------
      let retPushToOpen = GlobalFunc.process_Pushtoopen(this,
        this.mod_FrontPosStart + this.mod_HeightPosInsertion,
        retFlipLiftInfo.height, iFrontOverlay, (this.mod_FlipliftType_matrix.DirectionType ?? ''), this.mod_FlipliftType,
        retFlipLiftInfo.retFrontConstruction.FrontConstructionId
      );

      if (!retPushToOpen) throw new Error('Missing data for the push to open');

      //---------------Add module-----------------
      let pushToOpen = this.addOD_M_mc_Pushtoopen01();
      if (!pushToOpen) throw new Error('The module for push to open is not existing!');

      //---------------Pass info from process to module-----------------
      let pushToOpenInfo: any = {
        FrontWidth: retFlipLiftInfo.width,
        FrontHeight: retFlipLiftInfo.height,
        FrontWidthPos: retFlipLiftInfo.posX,
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

  // Get the hingeClass from the fliplift tables use this one:
  // hingeClass

  if (boolHinges && this.mod_HingeType !== 'NoHinges') {

    //---------------Add the module-----------------
    let HingeGroup = this.addOD_M_mc_HingeGroup01();

    //---------------Pass attributes to module-----------------
    HingeGroup.mod_Width = retFlipLiftInfo.width;
    HingeGroup.mod_Height = retFlipLiftInfo.height;
    HingeGroup.mod_Depth = retFlipLiftInfo.thickness;
    //HingeGroup.mod_FrontDesign = retFlipLiftInfo.retFrontConstruction.FrontDesign!;
    HingeGroup.mod_FrontType = this.mod_FlipliftType == 'DF' ? 'FlipliftDown' : 'FlipliftUp';
    HingeGroup.mod_FlipliftType = this.mod_FlipliftType;
    HingeGroup.mod_FlipliftHardwareType = flipLiftHardwareType;
    HingeGroup.mod_Originpos.push(this.mod_Originpos[0] + this.mod_FrontGapVert / 2);
    HingeGroup.mod_Originpos.push(this.mod_Originpos[1]);
    HingeGroup.mod_Originpos.push(this.mod_Originpos[2]);

    // Set mandatory attributes to any value
    HingeGroup.mod_DoorDirection = "Left";
    HingeGroup.mod_DoorType = "Single";

    //---------------Pass carcasePartInfo to module-----------------
    let strJsoncarcasePartInfo = JSON.stringify(carcasePartInfo);
    HingeGroup.mod_CarcasePartInfo.push(strJsoncarcasePartInfo);

    //---------------Pass FrontPanelConstruction information to module-----------------
    HingeGroup.mod_Information = JSON.stringify(retFlipLiftInfo);

    //--------------- setOrigin-----------------
    HingeGroup.setOrigin(retFlipLiftInfo.posX, retFlipLiftInfo.posY, retFlipLiftInfo.posZ);

    //===================================================
    // Seal mc_HingeGroup01 and get attribute with OpeningAngle 
    //===================================================
    let sealedHingeGroup = HingeGroup.seal();
    this.mod_OpeningAngle[0] = sealedHingeGroup.mod_OpeningAngle[0];
  }

  //===================================================
  //          Add module for the hinge in FHF between doors
  //===================================================

  if (this.mod_FlipliftType == 'FHF' && this.mod_FlipliftFrontNumber === 0) {

    //---------------Add the module-----------------
    let HingeGroupMiddleDoors = this.addOD_M_mc_HingeGroup01();

    //---------------Pass attributes to module-----------------
    HingeGroupMiddleDoors.mod_Width = retFlipLiftInfo.width;
    HingeGroupMiddleDoors.mod_Height = retFlipLiftInfo.height;
    HingeGroupMiddleDoors.mod_Depth = retFlipLiftInfo.thickness;
    //HingeGroupMiddleDoors.mod_FrontDesign = retFlipLiftInfo.retFrontConstruction.FrontDesign!;
    HingeGroupMiddleDoors.mod_FrontType = 'FlipliftUp';
    HingeGroupMiddleDoors.mod_FlipliftType = this.mod_FlipliftType;
    HingeGroupMiddleDoors.mod_FlipliftHardwareType = flipLiftHardwareType;
    HingeGroupMiddleDoors.mod_Originpos.push(this.mod_Originpos[0] + this.mod_FrontGapVert / 2);
    HingeGroupMiddleDoors.mod_Originpos.push(this.mod_Originpos[1]);
    HingeGroupMiddleDoors.mod_Originpos.push(this.mod_Originpos[2]);

    // Set mandatory attributes to any value
    HingeGroupMiddleDoors.mod_DoorDirection = "Left";
    HingeGroupMiddleDoors.mod_DoorType = "Single";


    carcasePartInfo.HorizontalPartsFrontAngle[1] = 180;
    //carcasePartInfo.HorizontalPartsPosY[1] = this.mod_Originpos[1] + retFlipLiftInfo.Height(this) + this.mod_FrontGapHor;
    carcasePartInfo.HorizontalPartsPosY[1] = this.mod_FrontPosStart + retFlipLiftInfo.height + this.mod_FrontGapHor;


    //---------------Pass carcasePartInfo to module-----------------
    let strJsoncarcasePartInfo = JSON.stringify(carcasePartInfo);
    HingeGroupMiddleDoors.mod_CarcasePartInfo.push(strJsoncarcasePartInfo);

    //---------------Pass FrontPanelConstruction information to module-----------------
    HingeGroupMiddleDoors.mod_Information = JSON.stringify(retFlipLiftInfo);

    //--------------- setOrigin-----------------
    HingeGroupMiddleDoors.setOrigin(retFlipLiftInfo.posX, retFlipLiftInfo.posY, retFlipLiftInfo.posZ);

  }