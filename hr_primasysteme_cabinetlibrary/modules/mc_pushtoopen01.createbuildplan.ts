  //====================================================================
  // Get PushToOpen Info
  //====================================================================
  let pushToOpenInfo = JSON.parse(this.mod_PushtoopenInfo[0]);

  //====================================================================
  // Get CarcasePartInfo
  //====================================================================
  let carcasePartInfo = JSON.parse(this.mod_CarcasePartInfo[0]);


  // Calculate Position of PushToOpen BoundaryBox

  let positionPushToOpen = GlobalFunc.process_GraphicInsertionHelper("112", pushToOpenInfo.CarcaseGraphic.in_Model3DGroupName!, pushToOpenInfo.CarcaseGraphic.DimensionX!, pushToOpenInfo.CarcaseGraphic.DimensionY!, pushToOpenInfo.CarcaseGraphic.DimensionZ!);


  //====================================================================
  // Calculate insertion position of the PushToOpen
  //====================================================================

  let dimxDrill: number = 0;
  let dimyDrill: number = 0;
  let dimzDrill: number = 0;
  let posxDrill: number = 0;
  let posyDrill: number = 0;
  let poszDrill: number = 0;
  let posxDrawing: number = 0;
  let posyDrawing: number = 0;
  let poszDrawing: number = 0;
  let rotationDrill: number = 0;
  let rotationDrawing: number = 0;
  let frontGapCarcasePushToOpen: number = 0; // Gap between the front and the part that receives the PushToOpen

  try {

    //---------------Calculate Position in Height (used in case of applying PushToOpen in Left or Right Parts)-----------------
    let positionHeightMap = new Map<string, () => number>([
      ["Top", () => (carcasePartInfo.HorizontalPartsPosY[1] ?? this.mod_FrontPosStart + pushToOpenInfo.FrontHeight) - pushToOpenInfo.Offset - positionPushToOpen.DimensionX!],
      ["Bottom", () => (carcasePartInfo.HorizontalPartsDimZ[0] == null ? this.mod_FrontPosStart : carcasePartInfo.HorizontalPartsPosY[0] + carcasePartInfo.HorizontalPartsDimY[0]) + pushToOpenInfo.Offset],
      ["AtTheLine", () => this.mod_PushtoopenLine - positionPushToOpen.DimensionX! / 2]
    ]);

    let posHeight = positionHeightMap.get(pushToOpenInfo.PositionHeight ?? "")?.() ?? (() => {
      throw new Error('Position in height cannot be calculated!');
    })();

    //---------------Calculate Position in Width (used in case of applying PushToOpen in Top or Bottom Parts)-----------------
    let positionWidthMap = new Map<string, () => number>([
      ["Left", () => (carcasePartInfo.VerticalPartsDimX[0] == 0 ? this.mod_Originpos[0] : carcasePartInfo.VerticalPartsPosX[0] + carcasePartInfo.VerticalPartsDimX[0]) + positionPushToOpen.DimensionX / 2 + pushToOpenInfo.Offset],
      ["Right", () => (carcasePartInfo.VerticalPartsDimX[1] == 0 ? this.mod_Originpos[0] + pushToOpenInfo.FrontWidth : carcasePartInfo.VerticalPartsPosX[1]) - positionPushToOpen.DimensionX / 2 - pushToOpenInfo.Offset],
      ["Center", () => this.mod_Originpos[0] + pushToOpenInfo.FrontWidth / 2]// - (positionPushToOpen.DimensionX! / 2)]
    ]);

    let posWidth = positionWidthMap.get(pushToOpenInfo.PositionWidth ?? "")?.() ?? (() => {
      throw new Error('Position in width cannot be calculated!');
    })();


    //---------------Set PointOfInsertion for Drawing-----------------
    const pointOfInserionMapDrawing = new Map([
      ["Left", {
        posX: -this.mod_Originpos[0] + carcasePartInfo.VerticalPartsPosX[0] + pushToOpenInfo.PartThk - pushToOpenInfo.PosThk + positionPushToOpen.InsertionPointY! + positionPushToOpen.GraphicLibrary.PartOffsetY!,
        posY: positionPushToOpen.DimensionX - this.mod_FrontPosStart + posHeight ,
        posZ: positionPushToOpen.InsertionPointZ! + positionPushToOpen.GraphicLibrary.PartOffsetZ! - (this.mod_Originpos[2] - (carcasePartInfo.VerticalPartsPosZ[0] + carcasePartInfo.VerticalPartsDimZ[0])),
        rotation: 270,
        frontGapCarcasePushToOpen: this.mod_Originpos[2] - (carcasePartInfo.VerticalPartsPosZ[0] + carcasePartInfo.VerticalPartsDimZ[0])
      }],
      ["Right", {
        posX: positionPushToOpen.DimensionY - this.mod_Originpos[0] + carcasePartInfo.VerticalPartsPosX[1] - positionPushToOpen.DimensionY + pushToOpenInfo.PosThk - positionPushToOpen.InsertionPointY! - positionPushToOpen.GraphicLibrary.PartOffsetY!,
        posY: - this.mod_FrontPosStart + posHeight,
        posZ: positionPushToOpen.InsertionPointZ! + positionPushToOpen.GraphicLibrary.PartOffsetZ! - (this.mod_Originpos[2] - (carcasePartInfo.VerticalPartsPosZ[1] + carcasePartInfo.VerticalPartsDimZ[1])),
        rotation: 90,
        frontGapCarcasePushToOpen: this.mod_Originpos[2] - (carcasePartInfo.VerticalPartsPosZ[1] + carcasePartInfo.VerticalPartsDimZ[1])
      }],
      ["Top", {
        posX: -this.mod_Originpos[0] + posWidth + positionPushToOpen.DimensionX + positionPushToOpen.InsertionPointX! + positionPushToOpen.GraphicLibrary.PartOffsetX!,
        posY: positionPushToOpen.DimensionY - this.mod_FrontPosStart + carcasePartInfo.HorizontalPartsPosY[1] + pushToOpenInfo.PosThk + positionPushToOpen.InsertionPointY! - positionPushToOpen.GraphicLibrary.PartOffsetY!,
        posZ: positionPushToOpen.InsertionPointZ! + positionPushToOpen.GraphicLibrary.PartOffsetZ! - (this.mod_Originpos[2] - (carcasePartInfo.HorizontalPartsPosZ[1] + carcasePartInfo.HorizontalPartsDimZ[1])),
        rotation: 180,
        frontGapCarcasePushToOpen: this.mod_Originpos[2] - (carcasePartInfo.HorizontalPartsPosZ[1] + carcasePartInfo.HorizontalPartsDimZ[1])
      }],
      ["Bottom", {
        posX: -this.mod_Originpos[0] + posWidth + positionPushToOpen.InsertionPointX! + positionPushToOpen.GraphicLibrary.PartOffsetX!,
        posY: - this.mod_FrontPosStart + carcasePartInfo.HorizontalPartsPosY[0] + pushToOpenInfo.PartThk - pushToOpenInfo.PosThk + positionPushToOpen.InsertionPointY! + positionPushToOpen.GraphicLibrary.PartOffsetY!,
        posZ: positionPushToOpen.InsertionPointZ! + positionPushToOpen.GraphicLibrary.PartOffsetZ! - (this.mod_Originpos[2] - (carcasePartInfo.HorizontalPartsPosZ[0] + carcasePartInfo.HorizontalPartsDimZ[0])),
        rotation: 0,
        frontGapCarcasePushToOpen: this.mod_Originpos[2] - (carcasePartInfo.HorizontalPartsPosZ[0] + carcasePartInfo.HorizontalPartsDimZ[0])
      }]
    ]);

    const pointOfInserionDrawing = pointOfInserionMapDrawing.get(pushToOpenInfo.Part ?? "");
    if (pointOfInserionDrawing) {
      posxDrawing = pointOfInserionDrawing.posX;
      posyDrawing = pointOfInserionDrawing.posY;
      poszDrawing = pointOfInserionDrawing.posZ;
      rotationDrawing = pointOfInserionDrawing.rotation;
      frontGapCarcasePushToOpen = pointOfInserionDrawing.frontGapCarcasePushToOpen;
    }
    else {
      throw new Error('Position not found!');
    }




    //---------------Set PointOfInsertion for Drilling-----------------
    const pointOfInserionMapDrill = new Map([
      ["Left", {
        posX: -this.mod_Originpos[0] + carcasePartInfo.VerticalPartsPosX[0] + pushToOpenInfo.PartThk - pushToOpenInfo.PosThk + positionPushToOpen.InsertionPointY! + positionPushToOpen.GraphicLibrary.PartOffsetY!,
        posY: - this.mod_FrontPosStart + posHeight ,
        posZ: positionPushToOpen.InsertionPointZ! + positionPushToOpen.GraphicLibrary.PartOffsetZ! - this.mod_FrontGapCarcase,
        rotationDrill: 0,
        dimxDrill: positionPushToOpen.DimensionY,
        dimyDrill: positionPushToOpen.DimensionX,
        dimzDrill: positionPushToOpen.DimensionZ
      }],
      ["Right", {
        posX: -this.mod_Originpos[0] + carcasePartInfo.VerticalPartsPosX[1] - positionPushToOpen.DimensionY + pushToOpenInfo.PosThk - positionPushToOpen.InsertionPointY! - positionPushToOpen.GraphicLibrary.PartOffsetY!,
        posY: - this.mod_FrontPosStart + posHeight ,
        posZ: positionPushToOpen.InsertionPointZ! + positionPushToOpen.GraphicLibrary.PartOffsetZ! - this.mod_FrontGapCarcase,
        rotationDrill: 0,
        dimxDrill: positionPushToOpen.DimensionY,
        dimyDrill: positionPushToOpen.DimensionX,
        dimzDrill: positionPushToOpen.DimensionZ
      }],
      ["Top", {
        posX: -this.mod_Originpos[0] + posWidth + positionPushToOpen.InsertionPointX! + positionPushToOpen.GraphicLibrary.PartOffsetX!,
        posY: - this.mod_FrontPosStart + carcasePartInfo.HorizontalPartsPosY[1] - positionPushToOpen.DimensionY + pushToOpenInfo.PosThk - positionPushToOpen.InsertionPointY! - positionPushToOpen.GraphicLibrary.PartOffsetY!,
        posZ: positionPushToOpen.InsertionPointZ! + positionPushToOpen.GraphicLibrary.PartOffsetZ! - this.mod_FrontGapCarcase,
        rotationDrill: 0,
        dimxDrill: positionPushToOpen.DimensionX,
        dimyDrill: positionPushToOpen.DimensionY,
        dimzDrill: positionPushToOpen.DimensionZ
      }],
      ["Bottom", {
        posX: -this.mod_Originpos[0] + posWidth + positionPushToOpen.InsertionPointX! + positionPushToOpen.GraphicLibrary.PartOffsetX!,
        posY: - this.mod_FrontPosStart + carcasePartInfo.HorizontalPartsPosY[0] + pushToOpenInfo.PartThk - pushToOpenInfo.PosThk + positionPushToOpen.InsertionPointY! + positionPushToOpen.GraphicLibrary.PartOffsetY!,
        posZ: positionPushToOpen.InsertionPointZ! + positionPushToOpen.GraphicLibrary.PartOffsetZ! - this.mod_FrontGapCarcase,
        rotationDrill: 0,
        dimxDrill: positionPushToOpen.DimensionX,
        dimyDrill: positionPushToOpen.DimensionY,
        dimzDrill: positionPushToOpen.DimensionZ
      }]
    ]);

    const pointOfInserionDrill = pointOfInserionMapDrill.get(pushToOpenInfo.Part ?? "");
    if (pointOfInserionDrill) {
      posxDrill = pointOfInserionDrill.posX;
      posyDrill = pointOfInserionDrill.posY;
      poszDrill = pointOfInserionDrill.posZ;
      rotationDrill = pointOfInserionDrill.rotationDrill;
      dimxDrill= pointOfInserionDrill.dimxDrill;
      dimyDrill= pointOfInserionDrill.dimyDrill;
      dimzDrill= pointOfInserionDrill.dimzDrill;
    }
    else {
      throw new Error('Position not found!');
    }


    // Check if the gap is correct
    if ((pushToOpenInfo.MinFrontGapCarcase) > frontGapCarcasePushToOpen) throw new Error('The gap between the front and the carcase needs to set to a minimum of: ' + (pushToOpenInfo.MinFrontGapCarcase - frontGapCarcasePushToOpen + this.mod_FrontGapCarcase));

  }
  catch (error: any) {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 22006', 1);
    logError(ErrorMessage.Message(error.message));
    return;
  }



  //====================================================================
  // PushToOpen Drawing
  //====================================================================

  let dimxDrawing = positionPushToOpen.DimensionX!;
  let dimyDrawing = positionPushToOpen.DimensionY!;
  let dimzDrawing = positionPushToOpen.DimensionZ!;

  // Add Part PushToOpen
  let pushToOpenDrawing = this.addpart_Pushtoopen(posxDrawing, posyDrawing, poszDrawing, dimxDrawing, dimyDrawing, dimzDrawing);
  pushToOpenDrawing.assign3DModel(pushToOpenInfo.CarcaseGraphic.Model3D!);
  this.assignPartGroup(this.mod_FrontId, pushToOpenDrawing);
  

  let partMatrix = PartHelper.rotateZ(pushToOpenDrawing, rotationDrawing, new Vector3(0, 0, 0));
  pushToOpenDrawing.setMatrix(partMatrix);



  //====================================================================
  // PushToOpen Drill
  //====================================================================
  let partConfig = new Map([
    ['DrilledCenter', {
      createPart: () => this.addpart_PushtoopenDrill(posxDrill, posyDrill, 0 - frontGapCarcasePushToOpen, dimxDrill, dimyDrill, frontGapCarcasePushToOpen),
    }],
    ['DrilledAdjustable', {
      createPart: () => this.addpart_PushtoopenDrill(posxDrill, posyDrill, 0 - frontGapCarcasePushToOpen, dimxDrill, dimyDrill, frontGapCarcasePushToOpen),
    }],
    ['WithAdapterHousing', {
      createPart: () => this.addpart_PushtoopenMountingPlateDrill(posxDrill, posyDrill, 0 - frontGapCarcasePushToOpen - dimzDrill + positionPushToOpen.GraphicLibrary.PartOffsetZ!, dimxDrill, dimyDrill, frontGapCarcasePushToOpen + dimzDrill - positionPushToOpen.GraphicLibrary.PartOffsetZ!),
    }]
  ]);

  // Search pushToOpenInfo.Type in the map
  let config = partConfig.get(pushToOpenInfo.Type!)!;

  // Check if pushToOpenInfo.Type is valid (included in the map)
  if (config) {

    // If pushToOpenInfo.Type is valid we get the information from the map
    let { createPart } = config;

    // Create the part drill
    let pushToOpenDrill = createPart();

    this.assignPartGroup(this.mod_FrontId, pushToOpenDrill);

    // Set attributes
    pushToOpenDrill.pa_Model3DGroupName = pushToOpenInfo.CarcaseGraphic.in_Model3DGroupName!;
    pushToOpenDrill.pa_ProcessingId = pushToOpenInfo.CarcaseProcessingItem!;
    pushToOpenDrill.pa_Rotation = rotationDrawing;

    let partMatrix = PartHelper.rotateZ(pushToOpenDrill, rotationDrill, new Vector3(0, 0, 0));
    pushToOpenDrill.setMatrix(partMatrix);



  }

  else {
    // Could not insert the PushToOpenDrill
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 21005', 1);
    logError(ErrorMessage.Message(''));
  }


  //====================================================================
  // PushToOpen BOM 
  //====================================================================
  let hardwareBOM = this.addpart_PushtoopenBom(0, 0, 0, 10, 10, 10);
  this.assignPartGroup(this.mod_FrontId, hardwareBOM);
  hardwareBOM.pa_HardwareId = pushToOpenInfo.CarcaseHardwareItem!;