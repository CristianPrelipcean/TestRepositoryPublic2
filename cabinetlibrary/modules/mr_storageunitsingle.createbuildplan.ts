
  // Schuler Consulting
  // Create: February 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // Insert the contours for the generation modules
  //
  // Revisions:
  //
  //======================================================================

  //======================================================================
  // Calculations
  //======================================================================

  // Read the information for the surroundings (allow the automatism)
  const storageunitInfo = GlobalFunc.process_ParseSuroundingInfo(this.mod_InformationList[0]);
  const autoFillerLeft = storageunitInfo.AutoFillerLeft;
  const wallDistanceLeft = storageunitInfo.WallDistanceLeft;
  const autoFillerRight = storageunitInfo.AutoFillerRight;
  const wallDistanceRight = storageunitInfo.WallDistanceRight;
  const contextInfo = JSON.parse(this.mod_ModuleContextInformationList[0] ?? "{}");
  const hasContext = contextInfo.DataComplete === true;
  const wallDistanceBack = hasContext ? (contextInfo.DistanceWallBack ?? 0) : 0;

  // Check all the added Information of CountertopInfo
  let cutout = 0;
  let strCutoutData = "";
  this.mod_CountertopInfo.forEach((entry, index) => {
    try {
      const obj = JSON.parse(entry);

      // If it is a hob correct the position in x-direction
      if (obj?.Supplier != null) {
        obj.CutPosX += this.mod_Width / 2;
        strCutoutData = JSON.stringify(obj);
        cutout = 1;
      }

    } catch (e) {
      console.error(`Error parsing mod_CountertopInfo[${index}]:`, e);
    }
  });

  // Create a JSON-object to provide it as attribute for the contour
  const countertopInfo = {
    Element: "storageUnit",
    Width: this.mod_Width,
    Depth: this.mod_Depth,
    DistanceWall: this.mod_CarcaseDistanceWall,
    Cutout: cutout,
    CutoutData: strCutoutData
  }

  const strJson = JSON.stringify(countertopInfo);

  const {
    CONTOUR_ATTRIBUTE_ADD_TOEKICK,
    CONTOUR_ATTRIBUTE_ADD_BASEBOARD,
    CONTOUR_ATTRIBUTE_OWNER_TYPE,
    mr_StorageunitSingle,
  } = GlobalFunc.process_MathLongparts();

  const mc_Storageunit01 = this.m.find(p => p instanceof OD_M_mc_Storageunit01) as any;
  const inSlopedCeilingArea = mc_Storageunit01.mod_SlopeAngle > 0;

  // StartPosition of Cabinet
  const StartPosCabinet = this.mod_PlacementLevels === 'OnFloor' ? this.mod_PlinthAreaHeight : 0;
  const carcaseTopY = mc_Storageunit01.mod_CarcaseHeight + StartPosCabinet;

  //======================================================================
  // Countertop
  //======================================================================

  const countertopContourBounds = {
    xMin: autoFillerLeft ? -wallDistanceLeft : 0,
    xMax: autoFillerRight ? this.mod_Width + wallDistanceRight : this.mod_Width,
    zMin: Math.min(0, -this.mod_CarcaseDistanceWall),
    zMax: this.mod_Depth,
  };

  const contourCountertop = Contour
    .M(countertopContourBounds.xMin, countertopContourBounds.zMin)
    .L(CKind.Back, countertopContourBounds.xMax, countertopContourBounds.zMin)
    .L(CKind.Right, countertopContourBounds.xMax, countertopContourBounds.zMax)
    .L(CKind.Front, countertopContourBounds.xMin, countertopContourBounds.zMax)
    .Z(CKind.Left)
    ;
  // This actually decides if the countertop should really be added.
  contourCountertop.attributes
    .set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_StorageunitSingle)
    .set('mod_CarcaseVisLeft', storageunitInfo.CarcaseVisLeft)
    .set('mod_CarcaseVisRight', storageunitInfo.CarcaseVisRight)
    .set('CountertopInfo', strJson)
    ;


  // TODO: The contour should be added always, because it is needed for further collision checks.
  if (this.mod_CreateCountertop) {
    this.addGenerationContour(
      GenerationMethod.Countertop,
      carcaseTopY,
      contourCountertop,
    );
  }

  //======================================================================
  // Backsplash
  //======================================================================
  // The same data as the countertop. The backsplash needs to be at the rear edge on the top of the countertop.

  if (this.mod_CreateBacksplash) {
    const backsplashTopY = carcaseTopY + (this.mod_CreateCountertop ? this.mod_CountertopThk : 0);
    this.addGenerationContour(
      GenerationMethod.Backsplash,
      backsplashTopY,
      contourCountertop,
    );
  }

  //======================================================================
  // Paneltop or Ceiling Filler
  //======================================================================

  if (this.mod_CreatePaneltop && this.mod_CreateCeilingFiller) {
    logError(`In mr_StorageunitSingle ${this._id}: Both mod_CreatePaneltop and mod_CreateCeilingFiller are activated. This can lead to errors in the generation. Please only activate one of them.`);
  }
  else if (this.mod_CreatePaneltop || this.mod_CreateCeilingFiller) {

    const topPanelDepth = inSlopedCeilingArea ? this.mod_TopDepth : this.mod_Depth;

    const paneltopContourBounds = {
      xMin: countertopContourBounds.xMin,
      xMax: countertopContourBounds.xMax,
      zMin:
        inSlopedCeilingArea ? ( this.mod_Depth - topPanelDepth )
          : ( countertopContourBounds.zMin - wallDistanceBack ),
      zMax: (
        + this.mod_Depth
      ),
    };

    const contourPaneltop = Contour
      .M(countertopContourBounds.xMin, paneltopContourBounds.zMin)
      .L(CKind.Back, paneltopContourBounds.xMax, paneltopContourBounds.zMin)
      .L(CKind.Right, paneltopContourBounds.xMax, paneltopContourBounds.zMax)
      .L(CKind.Front, paneltopContourBounds.xMin, paneltopContourBounds.zMax)
      .Z(CKind.Left)
      ;

    contourPaneltop.attributes
      .set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_StorageunitSingle)
      .set('mod_CeilingAreaVisLeft', storageunitInfo.CeilingAreaVisLeft)
      .set('mod_CeilingAreaVisRight', storageunitInfo.CeilingAreaVisRight)
      .set('mod_TypeElement', this.mod_TypeElement ?? 'None')
      ;

    const ceilingContourType = this.mod_CreatePaneltop ? GenerationMethod.Paneltop : GenerationMethod.CeilingFiller;

    this.addGenerationContour(
      ceilingContourType,
      carcaseTopY,
      contourPaneltop,
    );

  }

  //======================================================================
  // Fingergrip (gola)
  //======================================================================

  if (this.mod_CreateFingergrip) {

    // Fingergrip contour bounds
    const fingergripContourBounds = {
      xMin: 0,
      xMax: this.mod_Width,
      zMin: Math.min(0, -this.mod_CarcaseDistanceWall),
      zMax: this.mod_Depth,
    };

    // Adjust bounds when the corresponding side is blocked
    if (storageunitInfo.CarcaseVisLeft) {
      fingergripContourBounds.xMin += this.mod_SidepanelleftThk;
    }

    if (storageunitInfo.CarcaseVisRight) {
      fingergripContourBounds.xMax -= this.mod_SidepanelrightThk;
    }

    if (mc_Storageunit01) {
      const middleFingergripPositions = [
        mc_Storageunit01.mod_FingergripPos1 ?? 0,
        mc_Storageunit01.mod_FingergripPos2 ?? 0,
        mc_Storageunit01.mod_FingergripPos3 ?? 0,
        mc_Storageunit01.mod_FingergripPos4 ?? 0,
        mc_Storageunit01.mod_FingergripPos5 ?? 0,
      ].filter(p => p !== undefined && p > 0) as number[];

      let fingergripTopIndex = -1;
      if (mc_Storageunit01.mod_FingergripTop) {
        fingergripTopIndex = middleFingergripPositions.length;
        middleFingergripPositions.push(mc_Storageunit01.mod_CarcaseHeight - mc_Storageunit01.mod_FingergripType_matrix.LShapeHeight);
      }

      middleFingergripPositions.forEach((pos, idx) => {

        const fingergripContour = Contour
          .M(fingergripContourBounds.xMin, fingergripContourBounds.zMin)
          .L(CKind.Back, fingergripContourBounds.xMax, fingergripContourBounds.zMin)
          .L(CKind.Right, fingergripContourBounds.xMax, fingergripContourBounds.zMax)
          .L(CKind.Front, fingergripContourBounds.xMin, fingergripContourBounds.zMax)
          .Z(CKind.Left)
          ;

        fingergripContour.attributes
          .set('mod_FingergripPostype', idx === fingergripTopIndex ? 'Top' : 'Middle')
          .set('mod_FingergripType', mc_Storageunit01.mod_FingergripType ?? 'None')
          ;

        this.addGenerationContour(
          GenerationMethod.Fingergrip,
          pos + StartPosCabinet,
          fingergripContour,
        );
      });

    }

  }

  //======================================================================
  // Toekick and Baseboard
  //======================================================================
  // Seems sufficient without the isOnFloor check, but can be added later if needed.
  // const isOnFloor = this.getFullOrigin()._y < 1;
  const createToekick =
    // THIS CONDITION MUST BE IN PLACE !!!!!
    // WITHOUT THE WALL UNITS CREATE ERRORS !!!!!
    (this.mod_CreateToekick ?? false)
    // && isOnFloor
    && this.mod_PlinthAreaDesign_matrix.PlinthAreaType !== 'None'
    ;
  const createBaseboard = this.mod_CreateToekick && this.mod_PlinthAreaDesign_matrix.PlinthAreaType === 'Baseboard+Legs';

  // Use the legs provided by the plinth area, only add toekick to it
  if (createBaseboard) {
    // Baseboard Contour
    const mod_PlinthAreaVisLeft = storageunitInfo.PlinthAreaVisLeft === 1;
    const mod_PlinthAreaVisRight = storageunitInfo.PlinthAreaVisRight === 1;
    const baseboardContourBounds = {
      xMin: 0,
      xMax: this.mod_Width,
      zMin: -wallDistanceBack,
      zMax: this.mod_Depth,
    };

    const contourBaseboard = Contour
      .M(baseboardContourBounds.xMin, baseboardContourBounds.zMin)
      .L(CKind.Back, baseboardContourBounds.xMax, baseboardContourBounds.zMin)
      .L(CKind.Right, baseboardContourBounds.xMax, baseboardContourBounds.zMax)
      .L(CKind.Front, baseboardContourBounds.xMin, baseboardContourBounds.zMax)
      .Z(CKind.Left)
      ;

    contourBaseboard.attributes
      .set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_StorageunitSingle)
      .set(CONTOUR_ATTRIBUTE_ADD_BASEBOARD, 1)
      .set(CONTOUR_ATTRIBUTE_ADD_TOEKICK, 1)
      .set('mod_PlinthAreaVisLeft', storageunitInfo.PlinthAreaVisLeft)
      .set('mod_PlinthAreaVisRight', storageunitInfo.PlinthAreaVisRight)
      .set('mod_TypeElement', this.mod_TypeElement)
      .set('mod_PlinthAreaPosLeftMatrix', this.mod_PlinthAreaPosLeftMatrix)
      .set('mod_PlinthAreaPosRightMatrix', this.mod_PlinthAreaPosRightMatrix)
      .set('mod_PlinthAreaPosFrontMatrix', this.mod_PlinthAreaPosFrontMatrix)
      .set('mod_PlinthAreaPosBackMatrix', this.mod_PlinthAreaPosBackMatrix)
      ;

    this.addGenerationContour(
      GenerationMethod.PlinthAreaBaseboard,
      StartPosCabinet,
      contourBaseboard,
    );

  }
  else if (createToekick) {
    // Toekich Contour
    // Retrieve the positions of the legs
    let legPositionInfo = {
      LineLeft: 0,
      LineRight: 0,
      LineFront: 0,
      LineBack: 0
    };

    try {
      const parsed = JSON.parse(this.mod_PlinthAreaPositionInfo[0]);

      if (parsed && typeof parsed === "object") {
        legPositionInfo = {
          LineLeft: parsed.LineLeft ?? 0,
          LineRight: parsed.LineRight ?? 0,
          LineFront: parsed.LineFront ?? 0,
          LineBack: parsed.LineBack ?? 0
        };
      }
      else {
        logError(`Invalid legPositionInfo object in ${this._id}`);
      }
    }
    catch {
      logError(`Could not parse this.mod_PlinthAreaPositionInfo[0] in mr_StorageunitStraight ${this._id}. Toekick will not be recessed correctly.`);
    }

    const mod_PlinthAreaVisLeft = storageunitInfo.PlinthAreaVisLeft === 1;
    const mod_PlinthAreaVisRight = storageunitInfo.PlinthAreaVisRight === 1;
    const toekickContourBounds = {
      xMin: autoFillerLeft ? -wallDistanceLeft : (mod_PlinthAreaVisLeft ? legPositionInfo.LineLeft : 0),
      xMax: autoFillerRight ? this.mod_Width + wallDistanceRight : this.mod_Width - (mod_PlinthAreaVisRight ? legPositionInfo.LineRight : 0),
      zMin: legPositionInfo.LineBack - wallDistanceBack,
      zMax: this.mod_Depth - legPositionInfo.LineFront,
    };

    if (StartPosCabinet > 0) {

      const contourToekick = Contour
        .M(toekickContourBounds.xMin, toekickContourBounds.zMin)
        .L(CKind.Back, toekickContourBounds.xMax, toekickContourBounds.zMin)
        .L(CKind.Right, toekickContourBounds.xMax, toekickContourBounds.zMax)
        .L(CKind.Front, toekickContourBounds.xMin, toekickContourBounds.zMax)
        .Z(CKind.Left)
        ;

      contourToekick.attributes
        .set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_StorageunitSingle)
        .set(CONTOUR_ATTRIBUTE_ADD_TOEKICK, createToekick ? 1 : 0)
        .set('mod_PlinthAreaVisLeft', storageunitInfo.PlinthAreaVisLeft)
        .set('mod_PlinthAreaVisRight', storageunitInfo.PlinthAreaVisRight)
        ;

      this.addGenerationContour(
        GenerationMethod.Toekick,
        StartPosCabinet,
        contourToekick,
      );
    }

  }