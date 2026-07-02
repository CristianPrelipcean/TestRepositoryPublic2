
  // By Jiri Polcar

  const {
    LongPartSegment,
    LineSegmentEquation,
  } = GlobalFunc.process_MathLongparts();
  type LongPartSegmentTypeAlias = InstanceType<typeof LongPartSegment>;

  const segments = this.getGenerationContours().map(contour => {
    const lps = new LongPartSegment(contour);
    lps.additionalData = {
      segmentLength: lps.getLengthBetweenParallelSides(CKind.Left, CKind.Right),
    };
    lps.getOrAddSide(CKind.Left, CKind.Right);
    lps.getOrAddSide(CKind.Right, CKind.Left);
    lps.getOrAddSide(CKind.Front, CKind.None);
    return lps;
  });

  for (let i = 0; i < segments.length; i++) {
    const current = segments[i];
    const rest = segments.slice(i + 1);
    for (let j = 0; j < rest.length; j++) {
      current.tryMatchNeighboursByAxialContinuity(CKind.Front, rest, { match3D: true, matchFootprint: true, });
    }
  }

  const startingSegments = segments.filter(segment => segment.neighbours.get(CKind.Left)?.other === null);

  startingSegments.forEach(start => {
    const paneltop = this.addOD_M_mc_Paneltop01();

    let length = 0;
    let current: LongPartSegmentTypeAlias | null = start;
    let lastSegment: any = start;
    while (current) {
      length += lastSegment.getLengthBetweenParallelSides(CKind.Left, CKind.Right);
      current = current.neighbours.get(CKind.Right)?.other ?? null;
      if (current) { lastSegment = current; }
    }

    const BL = start.getCornerPoint(CKind.Left, CKind.Back)!;
    const FR = start.getCornerPoint(CKind.Right, CKind.Front)!;
    const FL = start.getCornerPoint(CKind.Left, CKind.Front)!;
    const forward = FL.toVector3Extended().subtract(BL.toVector3Extended()).normalize();

    paneltop.mod_Width = length;
    paneltop.mod_PaneltopThk = this.mod_PaneltopThk ?? 99;
    paneltop.mod_PaneltopConstruction = this.mod_PaneltopConstruction;
    paneltop.mod_Depth = (
      + FL?.toVector3Extended().distanceTo(BL?.toVector3Extended())
      + (paneltop.mod_PaneltopConstruction === 'Construction1' ? (this.mod_PaneltopOversizeBack ?? 0) : 0)
      + (paneltop.mod_PaneltopConstruction === 'Construction1' ? (this.mod_PaneltopOverhangFront ?? 0) : 0)
    );

    const frontSide = new LineSegmentEquation(FL.toVector3Extended(), FR.toVector3Extended())
      .translate({
        both:
          forward.scale(
            paneltop.mod_PaneltopConstruction === 'Construction1' ?
              this.mod_PaneltopOverhangFront ?? 1
              : 0
          )
      })
      ;

    paneltop.setOrigin(frontSide.getTransformationMatrixToStartPoint());

    // for pricing
    this.mod_LengthList.push(length);

  });

  //===================================================
	//          Call the UserExit of this module
	//===================================================

  let retInfo = GlobalFunc.ue_Paneltop(this);
  