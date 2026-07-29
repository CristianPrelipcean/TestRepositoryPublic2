
  // Schuler Consulting
  // Create: April 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mr_Appliance
  // Add a drop zone in the graphic
  //
  // Revisions:
  //
  //===================================================================================

  // Show the drop zone if there is no appliance inserted
  if (this.mod_DropZoneVisible[0]) {
    this.addpart_DropZone(0, 0, 0, this.mod_Width, this.mod_Height + this.mod_PlinthAreaHeight, this.mod_Depth);
  }

  //======================================================================
  // Calculations generation parts
  //======================================================================

  interface DwInfo {
    Width: number;
    Depth: number;
    Height: number;
    GraphicId: string | undefined;
  }

  let dwInfo: DwInfo = JSON.parse(this.mod_InformationList[0]);
  const realWidth = dwInfo.Width ? dwInfo.Width : this.mod_Width;

  // Create a JSON-object to provide it as attribute for the contour
  const countertopInfo = {
    Element: "storageUnit",
    Width: realWidth,
    Depth: this.mod_Depth,
    DistanceWall: this.mod_CarcaseDistanceWall,
    Hob: 0,
    HobData: ""
  }

  const strJson = JSON.stringify(countertopInfo);

  const {
    CONTOUR_ATTRIBUTE_ADD_TOEKICK,
    CONTOUR_ATTRIBUTE_OWNER_TYPE,
    mr_StorageunitSingle,
  } = GlobalFunc.process_MathLongparts();

  const inSlopedCeilingArea = false;
  const carcaseTopY = this.mod_Height + this.mod_PlinthAreaHeight;
  const plinthAreaHeight = this.mod_PlinthAreaHeight;

  //======================================================================
  // Countertop
  //======================================================================

  const countertopContourBounds = {
    xMin: 0,
    xMax: realWidth,
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
    .set('mod_CarcaseVisLeft', 0)
    .set('mod_CarcaseVisRight', 0)
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
    logError(`In mr_Appliance ${this._id}: Both mod_CreatePaneltop and mod_CreateCeilingFiller are activated. This can lead to errors in the generation. Please only activate one of them.`);
  }
  else if (this.mod_CreatePaneltop || this.mod_CreateCeilingFiller) {

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
      .set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_StorageunitSingle)
      .set('mod_CeilingFillerConstruction', this.mod_CeilingFillerConstruction ?? this.g.basic_CeilingFillerConstruction)
      .set('mod_CeilingFillerHeight', this.mod_CeilingFillerHeight ?? this.g.basic_CeilingFillerHeight)
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

  }

  //======================================================================
  // Toekick
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

  if (this.mod_CreateToekick ?? false) {


    // Retrieve the positions of the legs
    let legPositionInfo;
    try {
      legPositionInfo = JSON.parse(this.mod_PlinthAreaPositionInfo[0]);
    }
    catch {
      logError(`Could not parse this.mod_PlinthAreaPositionInfo[0] in mr_StorageunitStraight ${this._id}. Toekick will not be recessed correctly.`);
      legPositionInfo = undefined;
    }

    const LineLeft = legPositionInfo?.LineLeft ?? 0;
    const LineRight = legPositionInfo?.LineRight ?? 0;
    const LineFront = legPositionInfo?.LineFront ?? 0;
    const LineBack = legPositionInfo?.LineBack ?? 0;
    const mod_PlinthAreaVisLeft = this.mod_PlinthAreaVisLeft ?? false;
    const mod_PlinthAreaVisRight = this.mod_PlinthAreaVisRight ?? false;

    const toekickContourBounds = {
      xMin: mod_PlinthAreaVisLeft ? LineLeft : 0,
      xMax: realWidth - (mod_PlinthAreaVisRight ? LineRight : 0),
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