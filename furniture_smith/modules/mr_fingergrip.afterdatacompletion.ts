
  let posLength = 0;
  // By Jiri Polcar 

  const {
    LongPartSegment,
    LineSegmentEquation,
  } = GlobalFunc.process_MathLongparts();
  type LongPartSegmentTypeAlias = InstanceType<typeof LongPartSegment>;

  const segments = this.getGenerationContours().map(contour => {
    const lps = new LongPartSegment(contour);
    lps.getOrAddSide(CKind.Left, CKind.Right);
    lps.getOrAddSide(CKind.Right, CKind.Left);
    lps.getOrAddSide(CKind.Front, CKind.None);
    lps.additionalData = {
      segmentLength: lps.getLengthBetweenParallelSides(CKind.Left, CKind.Right),
      postype: lps.getAttributeOrDefault('mod_FingergripPostype', 'NA'),
      type: lps.getAttributeOrDefault('mod_FingergripType', 'NA'),
    };
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
            const aPostype = a.getAttributeOrDefault('mod_FingergripPostype', 'aNA');
            const bPostype = b.getAttributeOrDefault('mod_FingergripPostype', 'bNA');
            const aType = a.getAttributeOrDefault('mod_FingergripType', 'aNA');
            const bType = b.getAttributeOrDefault('mod_FingergripType', 'bNA');
            return aPostype === bPostype && aType === bType;
          },
        }
      );
    }
  }

  const startingSegments = segments.filter(segment => segment.neighbours.get(CKind.Left)?.other === null);

  startingSegments.forEach(start => {
    const fingergrip = this.addOD_M_mc_Fingergrip01();

    let length = 0;
    let current: LongPartSegmentTypeAlias | null = start;
    let lastSegment: any = start;
    while (current) {
      length += lastSegment.getLengthBetweenParallelSides(CKind.Left, CKind.Right);
      current = current.neighbours.get(CKind.Right)?.other ?? null;
      if (current) { lastSegment = current; }
    }

    fingergrip.mod_FingergripLength = length;
    fingergrip.mod_FingergripPostype = start.additionalData.postype;
    fingergrip.mod_FingergripType = start.additionalData.type;

    const frontSide = new LineSegmentEquation(
      start.getCornerPoint(CKind.Front, CKind.Left)!.toVector3Extended(),
      start.getCornerPoint(CKind.Front, CKind.Right)!.toVector3Extended(),
    );

    fingergrip.setOrigin(frontSide.getTransformationMatrixToStartPoint());

    // for pricing
    this.mod_LengthList.push(length);

    posLength += length;
 });

	//===================================================
	//          Call the UserExit of this module
	//===================================================

  let retInfo = GlobalFunc.ue_Fingergrip(this, posLength);
  