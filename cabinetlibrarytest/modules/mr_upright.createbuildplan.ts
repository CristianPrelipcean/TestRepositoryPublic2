
  const {
    CONTOUR_ATTRIBUTE_OWNER_TYPE,
    mr_Upright,
  } = GlobalFunc.process_MathLongparts();

  const countertopContourBounds = {
    xMin: 0,
    xMax: this.mod_UprightThk,
    zMin: 0,
    zMax: this.mod_UprightDepth,
    h: this.mod_UprightHeight + this.mod_PlinthAreaHeight,
  };

  const contourCountertop = Contour
    .M(countertopContourBounds.xMin, countertopContourBounds.zMin)
    .L(CKind.Back, countertopContourBounds.xMax, countertopContourBounds.zMin)
    .L(CKind.Right, countertopContourBounds.xMax, countertopContourBounds.zMax)
    .L(CKind.Front, countertopContourBounds.xMin, countertopContourBounds.zMax)
    .Z(CKind.Left)
    ;

  contourCountertop.attributes
    // owner type upright doesn't create its own countertop, but only extends a neighbouring one
    .set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_Upright)
    .set('mod_UprightThk', this.mod_UprightThk)
    ;

  if (this.mod_CreateCountertop) {
    this.addGenerationContour(
      GenerationMethod.Countertop,
      countertopContourBounds.h,
      contourCountertop,
    );
  }

  //==============================================================
  //          Paneltop or Ceiling Filler
  //==============================================================

  if (this.mod_CreatePaneltop && this.mod_CreateCeilingFiller) {
    logError(`In mr_Upright ${this._id}: Both mod_CreatePaneltop and mod_CreateCeilingFiller are activated. This can lead to errors in the generation. Please only activate one of them.`);
  }
  else if (this.mod_CreatePaneltop || this.mod_CreateCeilingFiller) {

    const ceilingContourType = this.mod_CreatePaneltop ? GenerationMethod.Paneltop : GenerationMethod.CeilingFiller;

    this.addGenerationContour(
      ceilingContourType,
      countertopContourBounds.h,
      contourCountertop,
    );
  }

  if (this.mod_CreateBacksplash) {

    const backsplashTopY = countertopContourBounds.h + (this.mod_CreateCountertop ? 25 /* TODO this.mod_CountertopThk */ : 0)

    this.addGenerationContour(
      GenerationMethod.Backsplash,
      backsplashTopY,
      contourCountertop,
    );
  }
