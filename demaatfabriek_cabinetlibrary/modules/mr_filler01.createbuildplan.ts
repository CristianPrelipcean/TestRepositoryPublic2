  
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
  // Calculations generation parts
  //======================================================================

  // Create a JSON-object to provide it as attribute for the contour
  const countertopInfo = {
	Element: "storageUnit",
	Width: this.mod_Width,
	Depth: this.mod_Depth,
	DistanceWall: this.mod_CarcaseDistanceWall,
	Hob: 0,
	HobData: ""
  }

  const strJson = JSON.stringify(countertopInfo);

  const {
    CONTOUR_ATTRIBUTE_ADD_TOEKICK,
    CONTOUR_ATTRIBUTE_OWNER_TYPE,
    mr_StorateunitSingle,
  } = GlobalFunc.process_MathLongparts();

  const inSlopedCeilingArea = false;
  const carcaseTopY = this.mod_Height + this.mod_PlinthAreaHeight;
  const plinthAreaHeight = this.mod_PlinthAreaHeight;
  const mc_Storageunit01 = this.m.find(p => p instanceof OD_M_mc_Storageunit01) as any;

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
      .set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_StorateunitSingle)
      .set('mod_CarcaseVisLeft', 0)
      .set('mod_CarcaseVisRight', 0)
      .set('CountertopInfo', strJson)
      ;


    if (this.mod_CreateCountertop) {
      this.addGenerationContour(
        GenerationMethod.Countertop,
        carcaseTopY,
        contourCountertop,
      );
    }
    

    // ===============
    // Backsplash
    // ===============

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

    const topPanelDepth = this.mod_Depth;

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
      .set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_StorateunitSingle)
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
          .M(countertopContourBounds.xMin, countertopContourBounds.zMin)
          .L(CKind.Back, countertopContourBounds.xMax, countertopContourBounds.zMin)
          .L(CKind.Right, countertopContourBounds.xMax, countertopContourBounds.zMax)
          .L(CKind.Front, countertopContourBounds.xMin, countertopContourBounds.zMax)
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
      .set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_StorateunitSingle)
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
        .set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_StorateunitSingle)
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







//===================================================
//          Add a ghost part for the plinth area
//===================================================

this.addpart_PlinthAreaUnit(0,0,0,1,1,1);


