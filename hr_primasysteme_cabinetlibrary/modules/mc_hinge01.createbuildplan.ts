  // Schuler Consulting
  // Create: Nov 2022
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_Hinge01
  // Add a single hinge
  //
  // Revisions:
  // 
  //====================================================================

  //====================================================================
  // Get Hinge Data
  //====================================================================

  const hingeInfo = JSON.parse(this.mod_HingeInfo[0]);

  //====================================================================
  // Define the Hinge Insertion Side (Left, Right, Top or Bottom)
  //====================================================================

  let hingeInsertionSide: string = '';
  if (this.mod_ModuleName == 'mc_Door01') {
    hingeInsertionSide = this.mod_DoorDirection === 'Right' ? 'Right' : 'Left';
  }
  else if (this.mod_ModuleName == 'mc_Fliplift01') {
    if (this.mod_FrontType == 'FlipliftUp') {
      hingeInsertionSide = 'Top';
    }
    else if (this.mod_FrontType == 'FlipliftDown') {
      hingeInsertionSide = 'Bottom';
    }
    else {
      throw new Error('Module FrontType is unknown. Could not define the Insertion Side of the hinges.');
    }
  }
  else {
    throw new Error('Module name is unknown. Could not define the positioning of the hinges.');
  }

  //====================================================================
  // Hinge Front Drawing
  //====================================================================

  // Retrieve data from GraphicLibrary
  const [HingeFrontInfo, GraphicFrontInfo] = GlobalFunc.process_GraphicLibraryData(hingeInfo.FrontGraphic.GraphicFileId);

  // Process Graphic Insertion Helper
  const positionHinge = GlobalFunc.process_GraphicInsertionHelper("012", hingeInfo.FrontGraphic.in_Model3DGroupName!, hingeInfo.FrontGraphic.DimensionX!, hingeInfo.FrontGraphic.DimensionY!, hingeInfo.FrontGraphic.DimensionZ!);

  if (!HingeFrontInfo || !GraphicFrontInfo || !positionHinge) {
    const ErrorMessage = GlobalFunc.find_ErrorList('Error 21009', 1);
    logError(ErrorMessage.Message(""));
    return;
  }

  // Get Positioning data for the Hinge
  const HingeData = GlobalFunc.find_HingeConstruction('HingeDoor', hingeInfo.CarcaseFrontAngle, hingeInsertionSide);
  const hingePosX = HingeData.PositionX(this, positionHinge.DimensionX!, positionHinge.DimensionY!, positionHinge.DimensionZ!, positionHinge.InsertionPointX, positionHinge.InsertionPointY!, positionHinge.InsertionPointZ!, positionHinge.GraphicLibrary.PartOffsetX!, positionHinge.GraphicLibrary.PartOffsetY!, positionHinge.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);
  const hingePosY = HingeData.PositionY(this, positionHinge.DimensionX!, positionHinge.DimensionY!, positionHinge.DimensionZ!, positionHinge.InsertionPointX, positionHinge.InsertionPointY!, positionHinge.InsertionPointZ!, positionHinge.GraphicLibrary.PartOffsetX!, positionHinge.GraphicLibrary.PartOffsetY!, positionHinge.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);
  const hingePosZ = HingeData.PositionZ(this, positionHinge.DimensionX!, positionHinge.DimensionY!, positionHinge.DimensionZ!, positionHinge.InsertionPointX, positionHinge.InsertionPointY!, positionHinge.InsertionPointZ!, positionHinge.GraphicLibrary.PartOffsetX!, positionHinge.GraphicLibrary.PartOffsetY!, positionHinge.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);
  const hingeDimX = HingeData.DimensionX(this, positionHinge.DimensionX!, positionHinge.DimensionY!, positionHinge.DimensionZ!, positionHinge.InsertionPointX, positionHinge.InsertionPointY!, positionHinge.InsertionPointZ!, positionHinge.GraphicLibrary.PartOffsetX!, positionHinge.GraphicLibrary.PartOffsetY!, positionHinge.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);
  const hingeDimY = HingeData.DimensionY(this, positionHinge.DimensionX!, positionHinge.DimensionY!, positionHinge.DimensionZ!, positionHinge.InsertionPointX, positionHinge.InsertionPointY!, positionHinge.InsertionPointZ!, positionHinge.GraphicLibrary.PartOffsetX!, positionHinge.GraphicLibrary.PartOffsetY!, positionHinge.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);
  const hingeDimZ = HingeData.DimensionZ(this, positionHinge.DimensionX!, positionHinge.DimensionY!, positionHinge.DimensionZ!, positionHinge.InsertionPointX, positionHinge.InsertionPointY!, positionHinge.InsertionPointZ!, positionHinge.GraphicLibrary.PartOffsetX!, positionHinge.GraphicLibrary.PartOffsetY!, positionHinge.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);
  const hingeRotationAngle = HingeData.RotationAngle(this, positionHinge.DimensionX!, positionHinge.DimensionY!, positionHinge.DimensionZ!, positionHinge.InsertionPointX, positionHinge.InsertionPointY!, positionHinge.InsertionPointZ!, positionHinge.GraphicLibrary.PartOffsetX!, positionHinge.GraphicLibrary.PartOffsetY!, positionHinge.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);

  // Add Part HingeFront
  const hingeFront = this.addpart_HingeDoor(hingePosX, hingePosY, hingePosZ, hingeDimX, hingeDimY, hingeDimZ);
  this.assignPartGroup(this.mod_FrontId, hingeFront);
  hingeFront.assign3DModel(GraphicFrontInfo.Model3D, true);
  hingeFront.pa_HardwareId = hingeInfo.FrontHardwareItem;

  // Add the material in the graphic
  GlobalFunc.process_AddMaterial(hingeFront, 'hinge', HingeFrontInfo.ColorId ?? "");

  // Assign hinge to OpenGroup
  //this.assignOpenGroup(this.mod_FrontId, hingeFront);

  //Rotate the drawing
  const partMatrix = PartHelper.rotateZ(hingeFront, hingeRotationAngle, new Vector3(0, 0, 0));
  hingeFront.setMatrix(partMatrix)

  //====================================================================
  // Hinge Processing
  //====================================================================

  // Get Positioning data for the Hinge Drills
  const HingeDrillData = GlobalFunc.find_HingeConstruction('HingeDrill', hingeInfo.CarcaseFrontAngle, hingeInsertionSide);
  const hingeDrillPosX = HingeDrillData.PositionX(this, positionHinge.DimensionX!, positionHinge.DimensionY!, positionHinge.DimensionZ!, positionHinge.InsertionPointX, positionHinge.InsertionPointY!, positionHinge.InsertionPointZ!, positionHinge.GraphicLibrary.PartOffsetX!, positionHinge.GraphicLibrary.PartOffsetY!, positionHinge.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);
  const hingeDrillPosY = HingeDrillData.PositionY(this, positionHinge.DimensionX!, positionHinge.DimensionY!, positionHinge.DimensionZ!, positionHinge.InsertionPointX, positionHinge.InsertionPointY!, positionHinge.InsertionPointZ!, positionHinge.GraphicLibrary.PartOffsetX!, positionHinge.GraphicLibrary.PartOffsetY!, positionHinge.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);
  const hingeDrillPosZ = HingeDrillData.PositionZ(this, positionHinge.DimensionX!, positionHinge.DimensionY!, positionHinge.DimensionZ!, positionHinge.InsertionPointX, positionHinge.InsertionPointY!, positionHinge.InsertionPointZ!, positionHinge.GraphicLibrary.PartOffsetX!, positionHinge.GraphicLibrary.PartOffsetY!, positionHinge.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);
  const hingeDrillDimX = HingeDrillData.DimensionX(this, positionHinge.DimensionX!, positionHinge.DimensionY!, positionHinge.DimensionZ!, positionHinge.InsertionPointX, positionHinge.InsertionPointY!, positionHinge.InsertionPointZ!, positionHinge.GraphicLibrary.PartOffsetX!, positionHinge.GraphicLibrary.PartOffsetY!, positionHinge.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);
  const hingeDrillDimY = HingeDrillData.DimensionY(this, positionHinge.DimensionX!, positionHinge.DimensionY!, positionHinge.DimensionZ!, positionHinge.InsertionPointX, positionHinge.InsertionPointY!, positionHinge.InsertionPointZ!, positionHinge.GraphicLibrary.PartOffsetX!, positionHinge.GraphicLibrary.PartOffsetY!, positionHinge.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);
  const hingeDrillDimZ = HingeDrillData.DimensionZ(this, positionHinge.DimensionX!, positionHinge.DimensionY!, positionHinge.DimensionZ!, positionHinge.InsertionPointX, positionHinge.InsertionPointY!, positionHinge.InsertionPointZ!, positionHinge.GraphicLibrary.PartOffsetX!, positionHinge.GraphicLibrary.PartOffsetY!, positionHinge.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);

  const isFHF = hingeInfo.CarcaseFrontAngle === 180 && hingeInsertionSide === 'Top';
  const isBottom = hingeInfo.CarcaseFrontAngle === 90 && hingeInsertionSide === 'Bottom';

  // Add the hinge drill part
  const hingeDrill = isFHF 
    ? this.addpart_HingeDrillFHF(hingeDrillPosX, hingeDrillPosY, hingeDrillPosZ, hingeDrillDimX, hingeDrillDimY, hingeDrillDimZ)
    : this.addpart_HingeDrill(hingeDrillPosX, hingeDrillPosY, hingeDrillPosZ, hingeDrillDimX, hingeDrillDimY, hingeDrillDimZ);

  // Set attributes of the hinge drill part
  hingeDrill.pa_Model3DGroupName = hingeInfo.FrontGraphic.in_Model3DGroupName;
  hingeDrill.pa_Model3DGroupName2 = isBottom ? hingeInfo.FrontGraphic.in_Model3DGroupName : hingeInfo.CarcaseGraphic.in_Model3DGroupName;
  hingeDrill.pa_ProcessingId2 = isBottom ? hingeInfo.FrontProcessingItem : hingeInfo.CarcaseProcessingItem;
  hingeDrill.pa_DrillDistance = hingeInfo.DrillingDistance;
  hingeDrill.pa_FrontOverlay = hingeInfo.FrontOverlay;
  hingeDrill.pa_ProcessingId = hingeInfo.FrontProcessingItem;
  hingeDrill.pa_HingeGapCarcase = hingeInfo.HingeGapCarcase;
  hingeDrill.pa_FrontGapCarcase = hingeInfo.CarcaseFrontAngle == 180 ? this.mod_FrontGapVert : hingeInfo.FrontGapCarcase;

  //====================================================================
  // MountingPlate Drawing
  //====================================================================

  if (hingeInfo.CarcaseFrontAngle == 90 && hingeInsertionSide == 'Bottom') { }
  else {

    // Retrieve data from GraphicLibrary
    const [HingeCarcInfo, GraphicCarcInfo] = GlobalFunc.process_GraphicLibraryData(hingeInfo.CarcaseGraphic.GraphicFileId);

    if (!HingeCarcInfo || !GraphicCarcInfo) {
      const ErrorMessage = GlobalFunc.find_ErrorList('Error 21009', 1);
      logError(ErrorMessage.Message(""));
      return;
    }

    // Calculate Position of MountingPlate BoundaryBox and insert as 90º situation and Left opening
    const positionMPlate = GlobalFunc.process_GraphicInsertionHelper("012", hingeInfo.CarcaseGraphic.in_Model3DGroupName!, hingeInfo.CarcaseGraphic.DimensionX!, hingeInfo.CarcaseGraphic.DimensionY!, hingeInfo.CarcaseGraphic.DimensionZ!);

    // Get Positioning data for the Mounting Plate
    const mplateDate = GlobalFunc.find_HingeConstruction('MountingPlate', hingeInfo.CarcaseFrontAngle, hingeInsertionSide);
    const mplatePosX = mplateDate.PositionX(this, positionMPlate.DimensionX!, positionMPlate.DimensionY!, positionMPlate.DimensionZ!, positionMPlate.InsertionPointX, positionMPlate.InsertionPointY!, positionMPlate.InsertionPointZ!, positionMPlate.GraphicLibrary.PartOffsetX!, positionMPlate.GraphicLibrary.PartOffsetY!, positionMPlate.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);
    const mplatePosY = mplateDate.PositionY(this, positionMPlate.DimensionX!, positionMPlate.DimensionY!, positionMPlate.DimensionZ!, positionMPlate.InsertionPointX, positionMPlate.InsertionPointY!, positionMPlate.InsertionPointZ!, positionMPlate.GraphicLibrary.PartOffsetX!, positionMPlate.GraphicLibrary.PartOffsetY!, positionMPlate.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);
    const mplatePosZ = mplateDate.PositionZ(this, positionMPlate.DimensionX!, positionMPlate.DimensionY!, positionMPlate.DimensionZ!, positionMPlate.InsertionPointX, positionMPlate.InsertionPointY!, positionMPlate.InsertionPointZ!, positionMPlate.GraphicLibrary.PartOffsetX!, positionMPlate.GraphicLibrary.PartOffsetY!, positionMPlate.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);
    const mplateDimX = mplateDate.DimensionX(this, positionMPlate.DimensionX!, positionMPlate.DimensionY!, positionMPlate.DimensionZ!, positionMPlate.InsertionPointX, positionMPlate.InsertionPointY!, positionMPlate.InsertionPointZ!, positionMPlate.GraphicLibrary.PartOffsetX!, positionMPlate.GraphicLibrary.PartOffsetY!, positionMPlate.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);
    const mplateDimY = mplateDate.DimensionY(this, positionMPlate.DimensionX!, positionMPlate.DimensionY!, positionMPlate.DimensionZ!, positionMPlate.InsertionPointX, positionMPlate.InsertionPointY!, positionMPlate.InsertionPointZ!, positionMPlate.GraphicLibrary.PartOffsetX!, positionMPlate.GraphicLibrary.PartOffsetY!, positionMPlate.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);
    const mplateDimZ = mplateDate.DimensionZ(this, positionMPlate.DimensionX!, positionMPlate.DimensionY!, positionMPlate.DimensionZ!, positionMPlate.InsertionPointX, positionMPlate.InsertionPointY!, positionMPlate.InsertionPointZ!, positionMPlate.GraphicLibrary.PartOffsetX!, positionMPlate.GraphicLibrary.PartOffsetY!, positionMPlate.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);
    const mplateRotation = mplateDate.RotationAngle(this, positionMPlate.DimensionX!, positionMPlate.DimensionY!, positionMPlate.DimensionZ!, positionMPlate.InsertionPointX, positionMPlate.InsertionPointY!, positionMPlate.InsertionPointZ!, positionMPlate.GraphicLibrary.PartOffsetX!, positionMPlate.GraphicLibrary.PartOffsetY!, positionMPlate.GraphicLibrary.PartOffsetZ!, hingeInfo.DrillingDistance!, hingeInfo.FrontOverlay!, hingeInfo.HingeGapCarcase!);

    // Add Part MountingPlate
    const mPlate = this.addpart_HingeCarcase(mplatePosX, mplatePosY, mplatePosZ, mplateDimX, mplateDimY, mplateDimZ);
    this.assignPartGroup(this.mod_CarcaseId, mPlate);
    mPlate.assign3DModel(GraphicCarcInfo.Model3D, true);
    mPlate.pa_HardwareId = hingeInfo.CarcaseHardwareItem;
    GlobalFunc.process_AddMaterial(mPlate, 'hinge', HingeCarcInfo.ColorId ?? "");

    if (hingeInfo.CarcaseFrontAngle == 180 && hingeInsertionSide == 'Left') {
      const partMatrix = PartHelper.rotateY(mPlate, 90, new Vector3(0, -mplatePosY, -mplatePosZ));
      mPlate.setMatrix(partMatrix);
    }
    else if (hingeInfo.CarcaseFrontAngle == 180 && hingeInsertionSide == 'Right') {
      let partMatrix = PartHelper.rotateZ(mPlate, 180, new Vector3(-mplatePosX, -mplatePosY, -mplatePosZ));
      let partMatrix1 = PartHelper.rotateY(mPlate, 90, new Vector3(0, -mplatePosY, -mplatePosZ));
      partMatrix = partMatrix.multiply(partMatrix1);
      mPlate.setMatrix(partMatrix);
    }
    else if (hingeInfo.CarcaseFrontAngle == 180 && hingeInsertionSide == 'Top') {
      let partMatrix = PartHelper.rotateZ(mPlate, mplateRotation, new Vector3(0, 0, 0));
      let partMatrix1 = PartHelper.rotateY(mPlate, 90, new Vector3(0, 0, -mplatePosZ));
      partMatrix = partMatrix.multiply(partMatrix1);
      mPlate.setMatrix(partMatrix);

      // Create OpenGroup to move the MoutingPlate together with the Door
      const openGrp = this.createOpenGroup(this._id, mPlate);
      openGrp.openMatrix = MatrixHelper.rotateX((-hingeInfo.OpeningAngle), new Vector3(0, this.mod_Height + this.mod_FrontGapHor, 12));
    }
    else if (hingeInfo.CarcaseFrontAngle == 90 && hingeInsertionSide == 'Right') {
      const partMatrix = PartHelper.rotateZ(mPlate, mplateRotation, new Vector3(-mplatePosX, -mplatePosY, -mplatePosZ));
      mPlate.setMatrix(partMatrix);
    }

    else {
      const partMatrix = PartHelper.rotateZ(mPlate, mplateRotation, new Vector3(0, 0, 0));
      mPlate.setMatrix(partMatrix);
    }
  }