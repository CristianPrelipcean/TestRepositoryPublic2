
  // By Jiri Polcar
  // Update Jiri Polcar Feb 2026 based on https://whiteboard.cloud.microsoft/me/whiteboards/p/c3BvOmh0dHBzOi8vZHVlcnItbXkuc2hhcmVwb2ludC5jb20vcGVyc29uYWwvbHVkd2lnX3dlYmVyX2hvbWFnLWdyb3VwX2NvbQ%3D%3D/b!KHha_3rsXECbRCD9hFGjSWChcA9avCJBiOyOCE00QlD1kQ__2HY-S4WWCNEZMofz/01Y22U2N67WRWY3SAJS5BJA5VIGTVL6JZS?source=applauncher&auth_upn=joao.lisboa-external%40homag-group.com
  //   - Add Construction3 side fillers
  // Update Jiri Polcar Mar 2026 - split to mr_Paneltop and mr_CeilingFiller


  const {
    LongPartSegment,
    LineSegmentEquation,
    mr_Upright,
    CONTOUR_ATTRIBUTE_OWNER_TYPE,
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

  let paneltopIndex = 1;
  const addPanelTop = () => {
    const paneltop = this.addOD_M_mc_Paneltop01();
    paneltop.mod_PaneltopId = `Paneltop_${paneltopIndex++}`;
    paneltop.mod_PaneltopThk = this.mod_PaneltopThk ?? 99;
    return paneltop;
  };

  startingSegments.forEach(start => {
    // fixed error: If you put the instantiation here and not after the return of the lone upright,
    // it will break at lonely contour uprights and they will walk away. I'm not kidding.
    // const paneltop = addPanelTop(); 

    let length = 0;
    let current: LongPartSegmentTypeAlias | null = start;
    let lastSegment: any = start;
    while (current) {
      length += lastSegment.getLengthBetweenParallelSides(CKind.Left, CKind.Right);
      current = current.neighbours.get(CKind.Right)?.other ?? null;
      if (current) { lastSegment = current; }
    }

    if (
      start === lastSegment
      && start.getAttributeOrDefault(CONTOUR_ATTRIBUTE_OWNER_TYPE, '') === mr_Upright
    ) {
      // do not add paneltop if it is an upright and it is only an upright
      return;
    }
    const paneltop = addPanelTop();

    const BL = start.getCornerPoint(CKind.Left, CKind.Back)!;
    const FR = start.getCornerPoint(CKind.Right, CKind.Front)!;
    const FL = start.getCornerPoint(CKind.Left, CKind.Front)!;
    const forward = FL.toVector3Extended().subtract(BL.toVector3Extended()).normalize();
    const right = FR.toVector3Extended().subtract(FL.toVector3Extended()).normalize();

    let offsetStartPoint = 0;
    let offsetEndPoint = 0;
    let frontFillerStartTransitionOffset = 0;
    let frontFillerEndTransitionOffset = 0;


    paneltop.mod_Width = length - offsetStartPoint - offsetEndPoint - frontFillerStartTransitionOffset - frontFillerEndTransitionOffset;
    paneltop.mod_Depth = (
      + FL?.toVector3Extended().distanceTo(BL?.toVector3Extended())
      + (this.mod_PaneltopOversizeBack ?? 0)
      + (this.mod_PaneltopOverhangFront ?? 0)
    );

    const frontSide = new LineSegmentEquation(FL.toVector3Extended(), FR.toVector3Extended())
      .translate({
        both:
          forward.scale(this.mod_PaneltopOverhangFront ?? 1)
      })
      .translate({
        both: right.scale(offsetStartPoint + frontFillerStartTransitionOffset),
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