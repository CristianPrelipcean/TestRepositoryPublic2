
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

  // this should not create the countertop by itself, but it should rather extend an existing
  contourCountertop.attributes.set(CONTOUR_ATTRIBUTE_OWNER_TYPE, mr_Upright);

  if (this.mod_CreateCountertop) {
    this.addGenerationContour(
      GenerationMethod.Countertop,
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
