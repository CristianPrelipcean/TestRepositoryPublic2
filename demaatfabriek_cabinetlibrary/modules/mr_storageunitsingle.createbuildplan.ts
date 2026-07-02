
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
    CONTOUR_ATTRIBUTE_OWNER_TYPE,
    mr_StorageunitSingle,
  } = GlobalFunc.process_MathLongparts();

  const mc_Storageunit01 = this.m.find(p => p instanceof OD_M_mc_Storageunit01) as any;

  const PlinthAreaType = this.mod_PlinthAreaDesign_matrix.PlinthAreaType ?? 'None';
  const plinthAreaHeight = (PlinthAreaType !== 'None' ? (this.mod_PlinthAreaHeight ?? 0) : 0);
  const inSlopedCeilingArea = mc_Storageunit01.mod_SlopeAngle > 0;
  const carcaseTopY = mc_Storageunit01.mod_CarcaseHeight + plinthAreaHeight;

  //======================================================================
  // Countertop
  //======================================================================

  const countertopContourBounds = {
    xMin: 0,
    xMax: this.mod_Width,
    zMin: Math.min(
      0,
      -this.mod_CarcaseDistanceWall,
    ),
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
    .set('mod_CarcaseVisLeft', this.mod_CarcaseVisLeft ? 1 : 0)
    .set('mod_CarcaseVisRight', this.mod_CarcaseVisRight ? 1 : 0)
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
  // Paneltop
  //======================================================================

  if (this.mod_CreatePaneltop) {

    const topPanelDepth = inSlopedCeilingArea ? this.mod_TopDepth : this.mod_Depth;

    const paneltopContourBounds = {
      xMin: countertopContourBounds.xMin,
      xMax: countertopContourBounds.xMax,
      zMin:
        inSlopedCeilingArea
          ? (
            +	this.mod_Depth
            - topPanelDepth
          )
          : (
            countertopContourBounds.zMin
          ),
      zMax: (
        +	this.mod_Depth
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
      ;

    this.addGenerationContour(
      GenerationMethod.Paneltop,
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
    if (this.mod_CarcaseVisLeft) {
      fingergripContourBounds.xMin += this.mod_SidepanelleftThk;
    }

    if (this.mod_CarcaseVisRight) {
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
          pos + plinthAreaHeight,
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
    const mod_PlinthAreaVisLeft = this.mod_PlinthAreaVisLeft ?? false;
    const mod_PlinthAreaVisRight = this.mod_PlinthAreaVisRight ?? false;
    const baseboardContourBounds = {
      xMin: 0,
      xMax: this.mod_Width,
      zMin: 0,
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
      .set('mod_PlinthAreaVisLeft', mod_PlinthAreaVisLeft ? 1 : 0)
      .set('mod_PlinthAreaVisRight', mod_PlinthAreaVisRight ? 1 : 0)
      .set('mod_TypeElement', this.mod_TypeElement)
      .set('mod_PlinthAreaPosLeftMatrix', this.mod_PlinthAreaPosLeftMatrix)
      .set('mod_PlinthAreaPosRightMatrix', this.mod_PlinthAreaPosRightMatrix)
      .set('mod_PlinthAreaPosFrontMatrix', this.mod_PlinthAreaPosFrontMatrix)
      .set('mod_PlinthAreaPosBackMatrix', this.mod_PlinthAreaPosBackMatrix)
      ;

    this.addGenerationContour(
      GenerationMethod.PlinthAreaBaseboard,
      plinthAreaHeight,
      contourBaseboard,
    );

  }
  else if (this.mod_CreateToekick && this.mod_PlinthAreaDesign != "10") {
    // Toekich Contour
    // Retrieve the positions of the legs
    let legPositionInfo;
    try {
      legPositionInfo = JSON.parse(this.mod_PlinthAreaPositionInfo[0]);
    }
    catch {
      logError(`Could not parse this.mod_PlinthAreaPositionInfo[0] in mr_StorageunitStraight ${this._id}. Toekick will not be recessed correctly.`);
      legPositionInfo = undefined;
    }
    // legPositionInfo.LineLeft  (In case this.mod_PlinthAreaVisLeft == true)
    // legPositionInfo.LineRight  (In case this.mod_PlinthAreaVisRight == true)
    // legPositionInfo.LineFront
    // legPositionInfo.LineBack (Probably not needed)

    const LineLeft = legPositionInfo?.LineLeft ?? 0;
    const LineRight = legPositionInfo?.LineRight ?? 0;
    const LineFront = legPositionInfo?.LineFront ?? 0;
    const LineBack = legPositionInfo?.LineBack ?? 0;
    const mod_PlinthAreaVisLeft = this.mod_PlinthAreaVisLeft ?? false;
    const mod_PlinthAreaVisRight = this.mod_PlinthAreaVisRight ?? false;

    const toekickContourBounds = {
      xMin: mod_PlinthAreaVisLeft ? LineLeft : 0,
      xMax: this.mod_Width - (mod_PlinthAreaVisRight ? LineRight : 0),
      zMin: LineBack,
      zMax: this.mod_Depth - LineFront,
    };

    if (plinthAreaHeight > 0) {

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
        .set('mod_PlinthAreaVisLeft', mod_PlinthAreaVisLeft ? 1 : 0)
        .set('mod_PlinthAreaVisRight', mod_PlinthAreaVisRight ? 1 : 0)
        ;

      this.addGenerationContour(
        GenerationMethod.Toekick,
        plinthAreaHeight,
        contourToekick,
      );
    }

  }