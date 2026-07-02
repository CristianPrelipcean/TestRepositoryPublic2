
  // By Jiri Polcar Mar 2026, split from mr_Paneltop
  // Update April 2026 - move mod_CeilingFillerConstruction and mod_CeilingFillerHeight to the contour-owning modules

  
  const fillerRecessFront = this.mod_CeilingFillerRecess ?? 0;
  const fillerRecessLeft = this.mod_CeilingFillerRecessLeft ?? 0;
  const fillerRecessRight = this.mod_CeilingFillerRecessRight ?? 0;
  const ceilingFillerHeight = this.mod_CeilingFillerHeight ?? -1;
  const ceilingFillerConstruction = this.mod_CeilingFillerConstruction ?? 'NONE';
  // todo: replace this with proper table or matrix
  //const canHaveSideFillers = (x: string) => ['Construction2'].includes(x);
  const canHaveSideFillers = (x: string) => true;

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
      current.tryMatchNeighboursByAxialContinuity(
        CKind.Front,
        rest,
        {
          match3D: true,
          matchFootprint: true,
          condition(a, b) {
            const aHeight = a.getAttributeOrDefault('mod_CeilingFillerHeight', -1);
            const bHeight = b.getAttributeOrDefault('mod_CeilingFillerHeight', -1);
            const aConst = a.getAttributeOrDefault('mod_CeilingFillerConstruction', 'NONE');
            const bConst = b.getAttributeOrDefault('mod_CeilingFillerConstruction', 'NONE');
            // uprights and possibly further modules won't define heights or constructions, but they still need to match
            if (aConst === 'NONE' || bConst === 'NONE' || aHeight <= 0 || bHeight <= 0) {
              return true;
            }
            else {
              return aHeight === bHeight && aConst === bConst;
            }
          },
        }
      );
    }
  }

  const startingSegments = segments.filter(segment => segment.neighbours.get(CKind.Left)?.other === null);

  let ceilingFillerIndex = 1;
  const addCeilingFiller = (ceilingFillerConstruction: string, ceilingFillerHeight: number) => {
    const ceilingFiller = this.addOD_M_mc_CeilingFiller01();
    ceilingFiller.mod_CeilingFillerId = `CeilingFiller_${ceilingFillerIndex++}`;
    ceilingFiller.mod_CeilingFillerThk = this.mod_CeilingFillerThk ?? 99;
    ceilingFiller.mod_CeilingFillerConstruction = ceilingFillerConstruction;
    ceilingFiller.mod_CeilingFillerHeight = this.mod_CeilingFillerHeight;//ceilingFillerHeight;
    return ceilingFiller;
  };

  startingSegments.forEach(start => {
    // fixed error: If you put the instantiation here and not after the return of the lone upright,
    // it will break at lonely contour uprights and they will walk away. I'm not kidding.
    // const paneltop = addPanelTop(); 

    // Evaluate the ceiling filler construction and height. It might be that there are segments that do not define the properties.
    // In that case, crawl to the right through the matched neighbours until a defining segment is found.
    // If no segment is found, emit error message and quit.

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
    const filler = addCeilingFiller(ceilingFillerConstruction, ceilingFillerHeight);

    const BL = start.getCornerPoint(CKind.Left, CKind.Back)!;
    const FR = start.getCornerPoint(CKind.Right, CKind.Front)!;
    const FL = start.getCornerPoint(CKind.Left, CKind.Front)!;
    const forward = FL.toVector3Extended().subtract(BL.toVector3Extended()).normalize();
    const right = FR.toVector3Extended().subtract(FL.toVector3Extended()).normalize();

    let offsetStartPoint = 0;
    let offsetEndPoint = 0;
    let drawLeftFiller = false;
    let drawRightFiller = false;
    let frontFillerStartTransitionOffset = 0;
    let frontFillerEndTransitionOffset = 0;
    let leftFillerEndTransitionOffset = 0;
    let rightFillerStartTransitionOffset = 0;

    const frontCeilingFillerIsLong = (this.mod_CeilingFillerTransitionType ?? 'FrontLong') === 'FrontLong';

    if (canHaveSideFillers(ceilingFillerConstruction)) {
      const forceLeftReturnByFlag =
        start.getAttributeOrDefault('mod_ReturnCeilingFillerLeft', 0) === 1;

      const forceRightReturnByFlag =
        lastSegment.getAttributeOrDefault('mod_ReturnCeilingFillerRight', 0) === 1;

      const forceLeftReturnByUpright =
        !forceLeftReturnByFlag
        && start.getAttributeOrDefault(CONTOUR_ATTRIBUTE_OWNER_TYPE, '') === mr_Upright;

      const forceRightReturnByUpright =
        !forceRightReturnByFlag
        && lastSegment.getAttributeOrDefault(CONTOUR_ATTRIBUTE_OWNER_TYPE, '') === mr_Upright;

      const drawLeftReturn =
        start.getAttributeOrDefault('mod_CeilingAreaVisLeft', 0) === 1
        || forceLeftReturnByFlag
        || forceLeftReturnByUpright;

      const drawRightReturn =
        lastSegment.getAttributeOrDefault('mod_CeilingAreaVisRight', 0) === 1
        || forceRightReturnByFlag
        || forceRightReturnByUpright;

      if (drawLeftReturn) {
        offsetStartPoint = fillerRecessLeft;
        drawLeftFiller = true;

        if (frontCeilingFillerIsLong) {
          leftFillerEndTransitionOffset += this.mod_CeilingFillerThk ?? 0;
        }
        else {
          frontFillerStartTransitionOffset += this.mod_CeilingFillerThk ?? 0;
        }
      }

      if (drawRightReturn) {
        offsetEndPoint = fillerRecessRight;
        drawRightFiller = true;

        if (frontCeilingFillerIsLong) {
          rightFillerStartTransitionOffset += this.mod_CeilingFillerThk ?? 0;
        }
        else {
          frontFillerEndTransitionOffset += this.mod_CeilingFillerThk ?? 0;
        }
      }
    }

    filler.mod_Width = length - offsetStartPoint - offsetEndPoint - frontFillerStartTransitionOffset - frontFillerEndTransitionOffset;

    const frontSide = new LineSegmentEquation(FL.toVector3Extended(), FR.toVector3Extended())
      .translate({
        both:
          forward.scale(
            ceilingFillerConstruction === 'Construction1' ?
              fillerRecessFront ?? 1
              : 0
          )
      })
      .translate({
        start: right.scale(offsetStartPoint + frontFillerStartTransitionOffset),
        end: right.scale(-offsetEndPoint - frontFillerEndTransitionOffset),
      });

    filler.setOrigin(frontSide.getTransformationMatrixToStartPoint());

    // for pricing
    this.mod_LengthList.push(filler.mod_Width);

    if (drawLeftFiller) {
      const leftFiller = addCeilingFiller(ceilingFillerConstruction, ceilingFillerHeight);
      start.getOrAddSide(CKind.Back, undefined);
      start.getOrAddSide(CKind.Front, undefined);
      const startSegmentDepth = start.getLengthBetweenParallelSides(CKind.Front, CKind.Back) ?? 1000;
      leftFiller.mod_Width = startSegmentDepth - fillerRecessFront - leftFillerEndTransitionOffset;
      leftFiller.mod_CeilingFillerRecess = fillerRecessLeft;
      const leftSide = new LineSegmentEquation(BL.toVector3Extended(), FL.toVector3Extended());
      leftFiller.setOrigin(leftSide.getTransformationMatrixToStartPoint());

      // for pricing
      this.mod_LengthList.push(leftFiller.mod_Width);
    }
    if (drawRightFiller) {
      const rightFiller = addCeilingFiller(ceilingFillerConstruction, ceilingFillerHeight);
      lastSegment.getOrAddSide(CKind.Back, undefined);
      lastSegment.getOrAddSide(CKind.Front, undefined);
      const lastSegmentDepth = lastSegment.getLengthBetweenParallelSides(CKind.Front, CKind.Back) ?? 1000;
      rightFiller.mod_Width = lastSegmentDepth - fillerRecessFront - rightFillerStartTransitionOffset;
      rightFiller.mod_CeilingFillerRecess = fillerRecessRight;
      const eBR = lastSegment.getCornerPoint(CKind.Right, CKind.Back)!.toVector3Extended();
      const eFR = lastSegment.getCornerPoint(CKind.Right, CKind.Front)!.toVector3Extended();
      const rightSide = new LineSegmentEquation(eFR, eBR) .translate({ start: forward.scale(-fillerRecessFront - rightFillerStartTransitionOffset) });
      rightFiller.setOrigin(rightSide.getTransformationMatrixToStartPoint());

      // for pricing
      this.mod_LengthList.push(rightFiller.mod_Width);
    }

  });
