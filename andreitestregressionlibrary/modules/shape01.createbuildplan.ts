  const assign_corpusColorMatrix = (part: IPartBase) => {
    const matrix = this.corpusColor_matrix;
    if (matrix.FaceDefault) {
      part.addFaceMaterial(matrix.FaceDefault, FaceKey.Default);
    }

    if (matrix.FaceFront) {
      part.addFaceMaterial(matrix.FaceFront, FaceKey.Front, matrix.FaceFrontRotation,
        matrix.FaceFrontOffset, matrix.FaceFrontOffset, matrix.FaceFrontScale, matrix.FaceFrontScale);
    }

    if (matrix.FaceBack) {
      part.addFaceMaterial(matrix.FaceBack, FaceKey.Back);
    }

    if (matrix.FaceBottom) {
      part.addFaceMaterial(matrix.FaceBottom, FaceKey.Bottom);
    }

    if (matrix.FaceLeft) {
      part.addFaceMaterial(matrix.FaceLeft, FaceKey.Left);
    }

    if (matrix.FaceRight) {
      part.addFaceMaterial(matrix.FaceRight, FaceKey.Right);
    }

    if (matrix.FaceSide) {
      part.addFaceMaterial(matrix.FaceSide, FaceKey.Side);
    }

    if (matrix.FaceTop) {
      part.addFaceMaterial(matrix.FaceTop, FaceKey.Top);
    }
  }

  logInfo("Matrix-Values: " + JSON.stringify(this.width_matrix));

  var res = this.ct_Custom_Table_03.find(p => p.in_integerFieldIn === 89)!;
  res.func3(this);

  var corpus = this.add000_Corpus(0, 0, 0, 0, 0, 0);
  this.createPartGroup("corpus", corpus);

  const corpusMatrix = this.corpusColor_matrix;

  var spl = this.add101_SidePanelLeft(0, 0, 0, this.sidePanelThickness, this.height, this.depth);
  assign_corpusColorMatrix(spl);
  this.assignPartGroup("corpus", spl);

  var spr = this.add102_SidePanelRight(this.width - this.sidePanelThickness, 0, 0,
    this.sidePanelThickness, this.height, this.depth);
  assign_corpusColorMatrix(spr);
  this.assignPartGroup("corpus", spr);

  this.add120_BottomShelf(this.sidePanelThickness, 0, 0,
    this.width - (2 * this.sidePanelThickness), this.sidePanelThickness, this.depth);

  this.add124_RailHorizontalFront(this.sidePanelThickness, this.height - this.sidePanelThickness, 0,
    this.width - (2 * this.sidePanelThickness), this.sidePanelThickness, this.depth / 8);

  this.add125_RailHorizontalBack(this.sidePanelThickness, this.height - this.sidePanelThickness, this.depth - (this.depth / 8),
    this.width - (2 * this.sidePanelThickness), this.sidePanelThickness, this.depth / 8)

  this.add140_Backwall(0, 0, this.depth,
    this.width, this.height, 8);

  if (this.generateWorktop) {
    this.addGenerationContour(GenerationMethod.APL, this.height,
      Contour.M(0, 0).H(CKind.Front, this.width).V(CKind.Left, this.depth).H(CKind.Back, 0).Z(CKind.Right));
  }
  
  if (this.showRoomContours) {
    this.addGenerationContour(GenerationMethod.ROOM, 0.0, Contour.M(0, 0));
  }