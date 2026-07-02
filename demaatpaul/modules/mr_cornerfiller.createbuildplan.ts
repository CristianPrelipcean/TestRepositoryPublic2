
  // Schuler Consulting
  // Create: July 2025
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
  //          Initialize
  //======================================================================

  const {
    CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE,
    CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_STRAIGHT,
    CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_PERPENDICULAR,
    CONTOUR_ATTRIBUTE_OWNER_ID,
    CONTOUR_ATTRIBUTE_OWNER_TYPE,
    CONTOUR_ATTRIBUTE_ADD_TOEKICK,
    mr_CornerunitStraight,
  } = GlobalFunc.process_MathLongparts();

  //===================================================
  //          Calculate Carcase Dimensions
  //===================================================

  let widthLeft: number = 0;
  let widthRight: number = 0;
  let depthRight: number = 0;
  let depthLeft: number = 0;
  let totalDimLeft: number = 0;
  let totalDimRight: number = 0;

  if (this.mod_CornerunitDimensionLogic == 'BasedInFrontDimension') {
    widthLeft = this.mod_WidthLeft;
    widthRight = this.mod_WidthRight;
    depthRight = this.mod_DepthRight;
    depthLeft = this.mod_DepthLeft;
    totalDimLeft = depthRight + widthLeft;
    totalDimRight = depthLeft + widthRight;
  }
  else if (this.mod_CornerunitDimensionLogic == 'BasedInWallDistance') {
    totalDimLeft = this.mod_TotalDimLeft;
    totalDimRight = this.mod_TotalDimRight;
    depthRight = this.mod_DepthRight;
    depthLeft = this.mod_DepthLeft;
    widthLeft = totalDimLeft - depthRight;
    widthRight = totalDimRight - depthLeft;
  }

  const plinthAreaHeight = (this.mod_PlinthAreaDesign_matrix?.PlinthAreaType !== 'None' ? (this.mod_PlinthAreaHeight ?? 0) : 0);

  //======================================================================
  // Countertop
  //======================================================================

  // Calculate the bounds of the contours
  //----------------------------------------------

  const countertopContourBounds = {
    xMin: 0,
    xMid: depthLeft,
    xMax: totalDimRight,

    zMin: 0,
    zMid: depthRight,
    zMax: totalDimLeft,

    h: this.mod_Height + plinthAreaHeight,
  };

  // Add the contours
  //----------------------------------------------


  // Left element
  const contourCountertopStraightPart = Contour
    .M(countertopContourBounds.xMin, countertopContourBounds.zMin)
    .L(CKind.Back, countertopContourBounds.xMax, countertopContourBounds.zMin)
    .L(CKind.Right, countertopContourBounds.xMax, countertopContourBounds.zMid)
    .L(CKind.Front, countertopContourBounds.xMin, countertopContourBounds.zMid)
    .Z(CKind.Left)
    ;

  contourCountertopStraightPart.attributes
    .set('mod_CarcaseDirection', 'Left')
    .set('mod_CarcaseVisLeft', 0)
    .set('mod_CarcaseVisRight', 0)
    .set(CONTOUR_ATTRIBUTE_OWNER_ID, this._id)
    .set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_CornerunitStraight)
    .set(CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE, CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_STRAIGHT);



  // Right element
  const contourCountertopPerpendicularPart = Contour
    .M(countertopContourBounds.xMin, countertopContourBounds.zMax)
    .L(CKind.Back, countertopContourBounds.xMin, countertopContourBounds.zMin)
    .L(CKind.Right, countertopContourBounds.xMid, countertopContourBounds.zMin)
    .L(CKind.Front, countertopContourBounds.xMid, countertopContourBounds.zMax)
    .Z(CKind.Left)
    ;

  contourCountertopPerpendicularPart.attributes
    .set('mod_CarcaseDirection', 'Left')
    .set('mod_CarcaseVisLeft', 0)
    .set('mod_CarcaseVisRight', 0)
    .set(CONTOUR_ATTRIBUTE_OWNER_ID, this._id)
    .set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_CornerunitStraight)
    .set(CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE, CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_PERPENDICULAR);


  if (this.mod_CreateCountertop) {

    this.addGenerationContour(
      GenerationMethod.Countertop,
      countertopContourBounds.h,
      contourCountertopStraightPart,
    );
    this.addGenerationContour(
      GenerationMethod.Countertop,
      countertopContourBounds.h,
      contourCountertopPerpendicularPart,
    );
  }

  // ===============
  // Backsplash
  // ===============

  if (this.mod_CreateBacksplash) {

    const backsplashTopY = countertopContourBounds.h + (this.mod_CreateCountertop ? this.mod_CountertopThk : 0);

    this.addGenerationContour(
      GenerationMethod.Backsplash,
      backsplashTopY,
      contourCountertopStraightPart,
    );
    this.addGenerationContour(
      GenerationMethod.Backsplash,
      backsplashTopY,
      contourCountertopPerpendicularPart,
    );
  }

  //======================================================================
  // Paneltop
  //======================================================================

  if (this.mod_CreatePaneltop) {

  }

  //======================================================================
  // Toekick
  //======================================================================

  if (this.mod_CreateToekick && this.mod_PlinthAreaDesign !== "10") {

    // Calculate the bounds of the contours
    //----------------------------------------------

    let legPositionInfo;
    try {
      legPositionInfo = JSON.parse(this.mod_PlinthAreaPositionInfo[0]);
    }
    catch {
      logError(`Could not parse this.mod_PlinthAreaPositionInfo[0] in mr_CornerunitStraight ${this._id}. Toekick will not be recessed correctly.`);
    }

    const LineLeft = legPositionInfo?.LineLeft ?? 0;
    const LineRight = legPositionInfo?.LineRight ?? 0;
    const LineFront = legPositionInfo?.LineFront ?? 0;
    const LineBack = legPositionInfo?.LineBack ?? 0;

    const mod_PlinthAreaVisLeft = this.mod_PlinthAreaVisLeft ?? false;
    const mod_PlinthAreaVisRight = this.mod_PlinthAreaVisRight ?? false;

    const toekickContourBounds = {
      xMin: LineBack,
      xMid: depthLeft - LineFront,
      xMax: totalDimRight,

      zMin: LineBack,
      zMid: depthRight - LineFront,  // Ecke
      zMax: totalDimLeft,

      h: plinthAreaHeight,
    };

    // Add the contours
    //----------------------------------------------

    // Left element
    const contourToekickStraightPart = Contour
      .M(toekickContourBounds.xMin, toekickContourBounds.zMin)
      .L(CKind.Back, toekickContourBounds.xMax, toekickContourBounds.zMin)
      .L(CKind.Right, toekickContourBounds.xMax, toekickContourBounds.zMid)
      .L(CKind.Front, toekickContourBounds.xMin, toekickContourBounds.zMid)
      .Z(CKind.Left);

    contourToekickStraightPart.attributes
      .set('mod_CarcaseDirection', 'Left')
      .set('mod_PlinthAreaVisLeft', mod_PlinthAreaVisLeft ? 1 : 0)
      .set('mod_PlinthAreaVisRight', mod_PlinthAreaVisRight ? 1 : 0)
      .set(CONTOUR_ATTRIBUTE_OWNER_ID, this._id)
      .set(CONTOUR_ATTRIBUTE_ADD_TOEKICK, 1)
      .set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_CornerunitStraight)
      .set(CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE, CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_STRAIGHT);

    this.addGenerationContour(
      GenerationMethod.Toekick,
      toekickContourBounds.h,
      contourToekickStraightPart,
    );

    // Right element
    const contourToekickPerpendicularPart = Contour
      .M(toekickContourBounds.xMin, toekickContourBounds.zMax)
      .L(CKind.Back, toekickContourBounds.xMin, toekickContourBounds.zMin)
      .L(CKind.Right, toekickContourBounds.xMid, toekickContourBounds.zMin)
      .L(CKind.Front, toekickContourBounds.xMid, toekickContourBounds.zMax)
      .Z(CKind.Left);

    contourToekickPerpendicularPart.attributes
      .set('mod_CarcaseDirection', 'Left')
      .set('mod_PlinthAreaVisLeft', mod_PlinthAreaVisLeft ? 1 : 0)
      .set('mod_PlinthAreaVisRight', mod_PlinthAreaVisRight ? 1 : 0)
      .set(CONTOUR_ATTRIBUTE_OWNER_ID, this._id)
      .set(CONTOUR_ATTRIBUTE_ADD_TOEKICK, 1)
      .set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_CornerunitStraight)
      .set(CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE, CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_PERPENDICULAR);

    this.addGenerationContour(
      GenerationMethod.Toekick,
      toekickContourBounds.h,
      contourToekickPerpendicularPart,
    );
  }

