
  // Schuler Consulting
  // Create: Nov 2025
  // By Ludwig Weber
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

  const PullOutDesign = retDrawerInfo.retFrontConstruction.FrontModuleId;
  const handleLine = this.mod_HandleLine;
  let heightHandleRelevantFront = retDrawerInfo.height;
  let startPosHandleRelevantFront = retDrawerInfo.posY;

  //-------------------Splited front-------------------

  if (this.mod_FrontSplit) {
    const FrontHeightList = GlobalFunc.process_Descriptor(this.mod_FrontSplitDescriptor, retDrawerInfo.height);
    const gap = this.mod_FrontGapHor ?? 0;
    let finalFrontList: { height: number; start: number }[] = [];
    let runningHeight = retDrawerInfo.posY;

    // Collect all frontheights from the descriptor
    FrontHeightList.forEach((originalHeight) => {
      const adjustedHeight = originalHeight - gap;
      finalFrontList.push({ height: adjustedHeight, start: runningHeight });
      runningHeight += originalHeight;
    });

    // Calculate the last front 
    const lastHeight = retDrawerInfo.height - runningHeight;
    finalFrontList.push({ height: lastHeight, start: runningHeight });

    // Insert all front modules
    for (let i = 0; i < finalFrontList.length; i++) {
      const front = finalFrontList[i];

      // Front insertion
      const PullOut = addModule(this, PullOutDesign);
      if (!PullOut) return;
      frontWeight += setModule(PullOut, retDrawerInfo, OversizeInfo, front.height, front.start);

      // Handle insertion
      let handleDataResult = handleInsertionHelper(this, retDrawerInfo, front.height, front.start, i, finalFrontList.length);
      handleWeight += handleDataResult.weight;
      PullOut.mod_HardwareTypeList.push(handleDataResult.hardwareTypeList[0]);	
    }
  }

  //-------------------Single front--------------------

  else {

    // Front insertion
    const PullOut = addModule(this, PullOutDesign);
    if (!PullOut) return;
    frontWeight = setModule(PullOut, retDrawerInfo, OversizeInfo, retDrawerInfo.height, retDrawerInfo.posY);

    // Handle insertion
    let handleDataResult = handleInsertionHelper(this, retDrawerInfo, retDrawerInfo.height, retDrawerInfo.posY, 1, 1);
    handleWeight += handleDataResult.weight;
    PullOut.mod_HardwareTypeList.push(handleDataResult.hardwareTypeList[0]);	
  }

  //-------------------Helper function AddModule-------

  function addModule(m: any, PullOutDesign: string) {
    switch (PullOutDesign) {
      case "FrontPanel01":
        return m.addOD_M_mc_FrontPanel01();
      case "WoodFrame01":
        return m.addOD_M_mc_PanelWoodFrame01();
      /*
      case "AlluminiumFrame":
        return m.addOD_M_mc_MetalFrame01();
      case "ThermoformedFrame":
        return m.addOD_M_mc_ThermoformedPanel01();
      */
      default:
        const ErrorMessage = GlobalFunc.find_ErrorList("Error 22036", 1);
        logError(ErrorMessage.Message(""));
        return null;
    }
  }

  //-------------------Helper function SetModule-------

  function setModule(PullOut: any, retDrawerInfo: any, OversizeInfo: any, frontHeight: number, frontStart: number) {
    PullOut.mod_Width = retDrawerInfo.width + OversizeInfo.OversizeLeft + OversizeInfo.OversizeRight;
    PullOut.mod_Height = frontHeight + OversizeInfo.OversizeTop + OversizeInfo.OversizeBottom;
    PullOut.mod_Depth = retDrawerInfo.thickness;

    PullOut.mod_FrontType = "PantryPullout";
    PullOut.mod_Information = JSON.stringify(retDrawerInfo);

    PullOut.setOrigin(
      retDrawerInfo.posX - OversizeInfo.OversizeLeft, frontStart - OversizeInfo.OversizeBottom, retDrawerInfo.posZ
    );

    const sealed = PullOut.seal();
    return sealed.mod_FrontpanelWeightCalculations?.[0] ?? 0;
  }

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

  function handleInsertionHelper(m: any, retDrawerInfo: any, heightFront: number, startPos: number, index: number, quantity: number): {weight: number, hardwareTypeList: string[]} {
    // Interface
    let weight: number = 0;
    let hardwareTypeList: string[] = [];

    // Check if there should be a handle inserted:
    if (m.mod_HandleDesign_matrix?.HandleType !== "Handle" && m.mod_HandleDesign_matrix?.HandleType !== "InsetHandle") return { weight, hardwareTypeList};

    // Check if there should be a handle for the specific front
    const mode = m.mod_HandleActivated ?? "All";
    const isBottom = index === 0;
    const isTop = index === quantity - 1;
    let insert = true;

    switch (mode) {
      case "All":
        insert = true;
        break;
      case "Top":
        insert = isTop;
        break;
      case "Bottom":
        insert = isBottom;
        break;
      default:
        insert = false;
        break;
    }

    // Break if the handle should not be inserted
    if (!insert) return { weight, hardwareTypeList };

    // Add the module
    let Handle = m.addOD_M_mc_Handle01();

    // Set values to the attributes of the child
    Handle.mod_Width = retDrawerInfo.width;
    Handle.mod_Height = heightFront;
    Handle.mod_Depth = retDrawerInfo.thickness;
    Handle.mod_FrontPosStart = startPos;

    // Matrix logic: set HandlePosMatrix based on segment position
    if (m.mod_HandlePosLogic === "Matrix" && quantity > 1) {
      if (isBottom) {
        Handle.mod_HandlePosMatrix = m.mod_HandlePosMatrixMultiple_matrix.FirstMatrix;
      }
      else if (isTop) {
        Handle.mod_HandlePosMatrix = m.mod_HandlePosMatrixMultiple_matrix.SecondMatrix;
      }
    }
    else if (m.mod_HandlePosLogic === "Matrix") {
      Handle.mod_HandlePosMatrix = m.mod_HandlePosMatrix;
    }

    // Provide Information about part on which the handle is positioned
    Handle.mod_FrontType = 'part_PantryPullout';
    Handle.mod_PartInfo = 'None';

    // setOrigin
    Handle.setOrigin(retDrawerInfo.posX, startPos, retDrawerInfo.posZ);

    // Seal the handle to get the frontWeight
    let sealedHandle = Handle.seal();
    weight = sealedHandle.mod_HandleWeightCalculations[0] ?? 0;
    hardwareTypeList.push(sealedHandle.mod_HardwareTypeList[0]);	
    return { weight, hardwareTypeList }
  };

  //===================================================
  //          Add module for hardware
  //===================================================

  // Process the pantry pullout hardware
  let retHardwareInfo = GlobalFunc.process_PantryPullout(this, CarcaseSpaceDimension.WidthFreeSpace, CarcaseSpaceDimension.HeightFreeSpace, CarcaseSpaceDimension.DepthFreeSpace);

  // Add the module
  let pulloutHardware = this.addOD_M_mc_PantryPulloutHardware01();

  // Set values to the attributes of the child
  pulloutHardware.mod_Information = JSON.stringify(retHardwareInfo);
  pulloutHardware.mod_Width = CarcaseSpaceDimension.WidthFreeSpace;
  pulloutHardware.mod_Height = CarcaseSpaceDimension.HeightFreeSpace;
  pulloutHardware.mod_Depth = CarcaseSpaceDimension.DepthFreeSpace;

  // setOrigin
  pulloutHardware.setOrigin(CarcaseSpaceDimension.WidthFreeStartPos + CarcaseSpaceDimension.WidthFreeSpace / 2, CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1], 0);

  //===================================================
  //          Add the fixed shelf if needed
  //=================================================== 

  if (retHardwareInfo.FixedShelfRequired) {
    const fs = this.addOD_M_mc_StorageunitShelffixed01();
    fs.mod_Width = CarcaseSpaceDimension.WidthFreeSpace;
    fs.mod_Depth = CarcaseSpaceDimension.DepthFreeSpace - this.g.basic_ShelvesOffsetFront;
    fs.setOrigin(
      CarcaseSpaceDimension.WidthFreeStartPos,
      CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1] + retHardwareInfo.SpaceHeight,
      -CarcaseSpaceDimension.DepthFreeSpace - this.mod_FrontGapCarcase - this.g.basic_ShelvesOffsetFront
    );
  }