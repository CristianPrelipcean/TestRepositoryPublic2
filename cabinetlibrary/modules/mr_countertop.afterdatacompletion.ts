  // CUSTOMSCRIPT_mr_Countertop_AFTERDATACOMPLETION
  // Schuler Consulting
  // Create: February 2025
  // By Jiri Polcar
  // Purpose: CabinetLibrary
  //
  // Description:
  // Insertion of the counter tops
  // Add GenerationContours logic to create the countertops.
  //
  // Revisions:
  //
  //===================================================

  let posLength = 0;
  let posDepth: number | undefined;

  //===================================================
  //    ANALYZE CONTOURS FOR COUNTERTOPS GENERATION
  //===================================================

  // We don't have an import statement, but this works like that: Imports the necessary functions from the global functions file

  const {
    LongPartSegment,
    LineSegmentEquation,
    LongPartSegmentEdge,
    Vector3Extended,
    evaluateCornerUnitStraightSizeOfPerpendicularPart,
    CONTOUR_ATTRIBUTE_OWNER_TYPE,
    CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE,
    CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_STRAIGHT,
    CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_PERPENDICULAR,
    mr_CornerunitStraight,
    mr_StorageunitSingle,
    mr_Upright,
  } = GlobalFunc.process_MathLongparts();
  // If import was used, this wouldn't be necessary, extract types from the imported functions for later use
  type LongPartSegmentTypeAlias = InstanceType<typeof LongPartSegment>;
  type LongPartSegmentEdgeTypeAlias = InstanceType<typeof LongPartSegmentEdge>;
  // An interable structure for Left and Right side computations
  type LeftRightAny = { Left: any, Right: any }

  //===================================================
  //    Fetch contours and create LongPartSegments
  //===================================================
  // The LongPartSegment is a class that is used to analyze the contours and their neighbours.

  const segments = this.getGenerationContours().map(contour => {
    const lps = new LongPartSegment(contour);
    lps.getOrAddSide(CKind.Left, CKind.Right);
    lps.getOrAddSide(CKind.Right, CKind.Left);
    const uprightOverhang: LeftRightAny = { Left: 0, Right: 0 };
    const visibleOverhang: LeftRightAny = { Left: 0, Right: 0 };
    const connectionType: LeftRightAny = {
      Left: lps.getAttributeOrDefault('mod_CarcaseVisLeft', 0) > 0 ? 'StraightFinished' : 'StraightUnfinished',
      Right: lps.getAttributeOrDefault('mod_CarcaseVisRight', 0) > 0 ? 'StraightFinished' : 'StraightUnfinished',
    };

    // Added by Ludwig -> get the data of the contour for the countertop drawings
    const countertopInfo = lps.getAttributeOrDefault('CountertopInfo', "");

    const connectionLength: LeftRightAny = { Left: 0, Right: 0 };
    lps.additionalData = {
      // An upright is present at the side - this adds its thickness to the countertop
      extensionUpright: uprightOverhang,
      // based on visible left/right, add an overhang
      visibleOverhang: visibleOverhang,
      // The distance in X from the rear left corner to the origin of the countertop
      // This is required especially for the starting countertop on corner units
      displaceOriginX: 0,
      // for assigning to the mc's mod_Countertop[Left|Right]EndType
      connectionType: connectionType,
      connectionLength: connectionLength,
      connectionSequenceIndex: 0,

      // For the countertop drawings
      countertopInfo: countertopInfo
    };
    return lps;
  });

  logInfo('mr_Countertop has been instantiated and has received ' + segments.length + ' generation contours.');

  // ===================================================
  // Match the LongPartSegments with their neighbours
  // ===================================================

  // Match sibling contours (corner units provide two sibling countertop contours for both sides of the corner)
  for (let i = 0; i < segments.length; i++) {
    const current = segments[i];
    const rest = segments.slice(i + 1);
    for (let j = 0; j < rest.length; j++) {
      current.tryMatchSiblings(rest);
    }
  }

  // Filter the carcases that have mod_CreateCountertop set only
  const carcaseSegmentsWithCountertops = segments.filter(segment =>
    [mr_CornerunitStraight, mr_StorageunitSingle].includes(segment.getAttributeOrDefault(CONTOUR_ATTRIBUTE_OWNER_TYPE, 'undefined'))
  );

  // Match carcases to carcases
  for (let i = 0; i < carcaseSegmentsWithCountertops.length; i++) {
    const current = carcaseSegmentsWithCountertops[i];
    const rest = carcaseSegmentsWithCountertops.slice(i + 1);
    for (let j = 0; j < rest.length; j++) {
      current.tryMatchNeighboursByAxialContinuity(CKind.Front, rest, { match3D: true, matchFootprint: true });
    }
  }

  /* Other contours interact with the countertop - these are:
      *  uprights
   * This will be necessary to determine other countertop attributes based on its neighbours.
   */
  const otherSegments = segments.filter(segment => !carcaseSegmentsWithCountertops.includes(segment));
  for (const nonCarcaseSegment of otherSegments) {
    nonCarcaseSegment.tryMatchNeighboursByPartialCoincidence(carcaseSegmentsWithCountertops, { match3D: false, matchFootprint: true });
  }

  // Helper formula for getting the depth of the segment from the side
  const getSegmentDepthFromSide = (segment: any) => {
    return segment.neighbours.get(CKind.Right)?.edge.length + this.mod_CountertopOverhangFront;
  };

  // Helper function to instantiate an mc_Countertop01
  let countertopIndex = 1;
  const addCountertop = () => {
    const countertop = this.addOD_M_mc_Countertop01();
    // Set an unique id to the mc - This prevents the "You can't assign Part to multiple Groups" error
    countertop.mod_CountertopId = `Countertop_${countertopIndex++}`;
    return countertop;
  }

  // Find the starting segments - these are the carcases that have no direct neighbour on the left side
  const startingSegments = carcaseSegmentsWithCountertops.filter(segment => segment.neighbours.get(CKind.Left)?.other === null);

  const mod_CountertopOverhangLeft = this.mod_CountertopOverhangLeft;
  const mod_CountertopOverhangRight = this.mod_CountertopOverhangRight;

  // ===================================================
  //        Get maximum countertop length
  // ===================================================
  let maximumLength;
  try {
    const boardMapping = GlobalFunc.find_BoardMapping(this.mod_CountertopColor, this.mod_CountertopThk);
    const boardEntry = GlobalFunc.find_BoardLibrary(boardMapping.BoardId!);
    maximumLength = boardEntry!.BoardLength;
  }
  catch (e) {
    maximumLength = 9999;
    logError(`Error while retrieving maximum countertop length. Using fallback value ${maximumLength}. Error: ${e}`);
  }

  // ===================================================
  //        Parse connection sequence
  // ===================================================
  const countertopConnectionSequence = this.mod_CountertopConnectionSequence.split('_');
  if (!countertopConnectionSequence || !countertopConnectionSequence.length) {
    logError('Countertop connection sequence is not set. Using default sequence (L).');
    countertopConnectionSequence.push('L');
  }

  // ===================================================
  //        Distribute connection sequence indices
  // ===================================================
  // We don't know which starting segment is the first one, so we need to go through all starts.
  // Then we count corner units, distributing the sequence indices to the corner parts.
  // This will crawl through the corner units that belong to 1 continuous countertop piece.
  // This also means that the indexing has reached from a previous starting segment. In which case, it already has a higher index and therefore we break the loop to quit - the higher index wins.
  for (const start of carcaseSegmentsWithCountertops) {
    let sequenceIndex = 0;
    let currentOrNull: LongPartSegmentTypeAlias | null | undefined = start;
    const alreadyVisited: LongPartSegmentTypeAlias[] = [start];
    while (currentOrNull) {
      const current: LongPartSegmentTypeAlias = currentOrNull!;

      const isCorner = current.getAttributeOrDefault(CONTOUR_ATTRIBUTE_OWNER_TYPE, 'undefined') === mr_CornerunitStraight;
      if (isCorner) {
        const sibling = current.siblings.find((s: any) => s.getAttributeOrDefault(CONTOUR_ATTRIBUTE_OWNER_TYPE, 'no corner') === mr_CornerunitStraight)!;
        if (current.additionalData.connectionSequenceIndex > sequenceIndex) {
          break;
        }
        else {
          current.additionalData.connectionSequenceIndex = sequenceIndex;
          sibling.additionalData.connectionSequenceIndex = sequenceIndex;
          sequenceIndex++;
        }
        const isLeftPartOfCorner = (
          current.getAttributeOrDefault('mod_CarcaseDirection', 'undefined') === 'Left' && current.getAttributeOrDefault(CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE, 'not a corner') === CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_PERPENDICULAR
          || current.getAttributeOrDefault('mod_CarcaseDirection', 'undefined') === 'Right' && current.getAttributeOrDefault(CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE, 'not a corner') === CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_STRAIGHT
        );
        // the neighbour must be on the right part
        currentOrNull = (isLeftPartOfCorner ? sibling : current).neighbours.get(CKind.Right)?.other;
      }
      else {
        currentOrNull = current.neighbours.get(CKind.Right)?.other;
      }
      if (currentOrNull && alreadyVisited.includes(currentOrNull!)) {
        logError('Countertop forms a closed loop. This is not supported.');
        break;
      }
      if (currentOrNull) {
        alreadyVisited.push(currentOrNull);
      }
    }
  }

  // ===================================================
  //       Cycle through the countertop segments
  // ===================================================
  // Compute the contributing lengths to the countertop segments
  // Compute their depth
  // Check if there are uprights, higher neighbours etc.


  // First run: Compute the lengths and depths of all segments simply by measuring between their contour's vertices.
  for (const current of carcaseSegmentsWithCountertops) {
    current.additionalData.segmentLength = current.getLengthBetweenParallelSides(CKind.Left, CKind.Right);
    current.additionalData.segmentDepth = getSegmentDepthFromSide(current);
  }


  for (const current of carcaseSegmentsWithCountertops) {

    const currentOwnerType: string = current.getAttributeOrDefault(CONTOUR_ATTRIBUTE_OWNER_TYPE, 'undefined owner type');
    const cornerContourType = current.getAttributeOrDefault(CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE, 'not a corner');
    const currentIsStraightCornerPart = cornerContourType === CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_STRAIGHT;

    // The neighbours of the current segment. 
    const dockingSegments: LeftRightAny = {
      Left: current,
      Right: current,
    }

    // ===================================================
    // compute length, depth and origin displacement of the long part segments
    // ===================================================

    if (
      currentOwnerType === mr_CornerunitStraight
      && currentIsStraightCornerPart // this ensures it runs only once
    ) {

      // Either CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_STRAIGHT or CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_PERPENDICULAR
      const evaluateSizesResult = evaluateCornerUnitStraightSizeOfPerpendicularPart(current, this.mod_CountertopOverhangFront, 'segmentLength', 'segmentDepth', 'displaceOriginX');

      dockingSegments.Left = evaluateSizesResult.leftCornerPart;
      dockingSegments.Right = evaluateSizesResult.rightCornerPart;


      // TODO: get the transition type from the attribute and distribute it to the corners
      const sequenceIndex = current.additionalData.connectionSequenceIndex;
      const countertopCornerConnectionType: string = countertopConnectionSequence[(sequenceIndex) % countertopConnectionSequence.length];
      if (sequenceIndex > countertopConnectionSequence.length) {
        logInfo(`mod_CountertopConnectionSequence ${countertopConnectionSequence.join('_')} is too short - it has ${countertopConnectionSequence.length}, but index ${sequenceIndex} is requested. Sequence is repeated.`);
      }
      if (countertopCornerConnectionType === 'L') {
        dockingSegments.Right.additionalData.segmentLength -= dockingSegments.Left.additionalData.segmentDepth;
        if (currentIsStraightCornerPart) {
          // this incrementation is running twice without this condition - TODO refactor so that all those computations run only once (this whole big block of code is duplicated, once for straight, once for perpendicular part of the corner unit)
          dockingSegments.Right.additionalData.displaceOriginX += dockingSegments.Left.additionalData.segmentDepth;
        }
        dockingSegments.Left.additionalData.connectionType.Right = 'Groove';
        dockingSegments.Right.additionalData.connectionType.Left = 'Tongue';
        dockingSegments.Left.additionalData.connectionLength.Right = dockingSegments.Right.additionalData.segmentDepth;
        dockingSegments.Right.additionalData.connectionLength.Left = dockingSegments.Left.additionalData.segmentDepth;
      }
      else if (countertopCornerConnectionType === 'R') {
        dockingSegments.Left.additionalData.segmentLength -= dockingSegments.Right.additionalData.segmentDepth;
        dockingSegments.Left.additionalData.connectionType.Right = 'Tongue';
        dockingSegments.Right.additionalData.connectionType.Left = 'Groove';
        dockingSegments.Left.additionalData.connectionLength.Right = dockingSegments.Right.additionalData.segmentDepth;
        dockingSegments.Right.additionalData.connectionLength.Left = dockingSegments.Left.additionalData.segmentDepth;
      }
      else if (countertopCornerConnectionType === 'M') {
        dockingSegments.Left.additionalData.connectionType.Right = 'Mitre';
        dockingSegments.Right.additionalData.connectionType.Left = 'Mitre';
        // TODO: Should be affected by sin(45 degrees)?
        dockingSegments.Left.additionalData.connectionLength.Right = dockingSegments.Right.additionalData.segmentDepth * Math.SQRT2;
        dockingSegments.Right.additionalData.connectionLength.Left = dockingSegments.Left.additionalData.segmentDepth * Math.SQRT2;
      }
      else {
        logError(`Unknown countertop corner connection type ${countertopCornerConnectionType} in ${this.mod_CountertopConnectionSequence}. Valid types: L, R, M.`);
      }
    }
    else if (currentOwnerType === mr_StorageunitSingle) {
      // nothing to do here, the lengths are already computed
    }
    else {
      // Perpendicular corner part of the corner unit - ignore, otherwise it'll compute two times.
    }

    // ===================================================
    // For both Left and Right sides, if free (other === null), check footprint neighbours
    // If there is a higher neighbour, no overhang
    // Else if there is an upright with the same size, extension for upright and check further overhang
    // ===================================================

    const currentHeight = current.generationContour.position.y + current.generationContour.height;

    // This also needs to run only once, and at the time the corner unit's dockingSegments are therefore set correctly
    if (
      currentOwnerType === mr_StorageunitSingle
      || currentOwnerType === mr_CornerunitStraight && currentIsStraightCornerPart
    ) {
      ['Left', 'Right'].forEach((s) => {
        const dock = dockingSegments[s as keyof LeftRightAny];
        const dockside = s as CKind;
        const dockEdge = dock.neighbours.get(dockside) as LongPartSegmentEdgeTypeAlias;

        // check if there is an upright
        // if there is an upright, add overhang
        const upright = dockEdge.neighboursInFootprint.find((n: LongPartSegmentTypeAlias) => n.getAttributeOrDefault(CONTOUR_ATTRIBUTE_OWNER_TYPE, 'undefined') === mr_Upright);
        if (upright) {
          const uprightHeight = (upright?.generationContour.height ?? 0) + (upright?.generationContour.position.y ?? 0);
          // this value comes from the upright
          const uprightThk = upright.getLengthBetweenParallelSides(CKind.Left, CKind.Right);
          // check if the upright's top edge is in the same height - if yes, it is covering this carcase and the countertop should be extended
          if (
            Math.abs(uprightHeight - currentHeight) < Vector3Extended.EPS
          ) {
            const overhang = s === 'Left' ? mod_CountertopOverhangLeft : mod_CountertopOverhangRight;
            current.additionalData.extensionUpright[s] = uprightThk! + overhang;
          }
        }
        // check if CarcaseVis on the set - if yes, add overhang
        // if yes, but there is an upright, do not add the overhang, because the upright is already adding it          
        else {
          const sideVisible = current.getAttributeOrDefault(`mod_CarcaseVis${s}`, 0) > 0;
          if (
            dockEdge.other === null
          ) {
            const overhang = s === 'Left' ? mod_CountertopOverhangLeft : mod_CountertopOverhangRight;
            current.additionalData.visibleOverhang[s] = sideVisible ? overhang : 0;
          }
        }

      });
    }
    else {
      // Perpendicular corner part of the corner unit - ignore, otherwise it'll compute two times.
    }

  }

  // =============================================================
  //       Cycle through the starting segments of the countertop
  // =============================================================
  // The starting segments are those who don't have a left neighbour carcase.
  // We need to collect them in a straight line by crawling to the right neighbours.
  // Then we divide the collected segment lengths by the maximum length of the material.

  for (const segmentIndex in startingSegments) {
    const firstSegment = startingSegments[segmentIndex];
    let currentOrNull: LongPartSegmentTypeAlias | null | undefined = firstSegment;
    let lastSegment: any = firstSegment;
    const allSegmentsInThisSection: LongPartSegmentTypeAlias[] = [];

    // From the firstSegment, crawl to the right neighbours until we get to the end
    while (currentOrNull) {
      const current: LongPartSegmentTypeAlias = currentOrNull!;
      allSegmentsInThisSection.push(current);
      // get the next one ... if there is none, the loop will terminate
      currentOrNull = current.neighbours.get(CKind.Right)?.other;
      if (current) { lastSegment = current; }
    }

    // ==========================================================================
    //       Apply the uprights, overhangs to the ends of the countertop
    // ==========================================================================
    // ... where it is eligible.
    // That means both sides of the mr_StorageunitSingle if the sides are free
    // And dockable sides of the mr_CornerUnitStraight if the sides are free

    const firstSegmentType = firstSegment.getAttributeOrDefault(CONTOUR_ATTRIBUTE_OWNER_TYPE, 'undefined');
    const lastSegmentType = lastSegment.getAttributeOrDefault(CONTOUR_ATTRIBUTE_OWNER_TYPE, 'undefined');
    const firstIsCornerWithFreeLeftSide = (
      firstSegmentType === mr_CornerunitStraight
      && firstSegment.neighbours.get(CKind.Left)?.other === null
      && (
        (
          firstSegment.getAttributeOrDefault('mod_CarcaseDirection', 'undefined') === 'Left'
          && firstSegment.getAttributeOrDefault(CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE, 'undefined') === CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_PERPENDICULAR
        )
        || (
          firstSegment.getAttributeOrDefault('mod_CarcaseDirection', 'undefined') === 'Right'
          && firstSegment.getAttributeOrDefault(CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE, 'undefined') === CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_STRAIGHT
        )
      )
    );
    const lastIsCornerWithFreeRightSide = (
      lastSegmentType === mr_CornerunitStraight
      && lastSegment.neighbours.get(CKind.Right)?.other === null
      && (
        (
          lastSegment.getAttributeOrDefault('mod_CarcaseDirection', 'undefined') === 'Right'
          && lastSegment.getAttributeOrDefault(CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE, 'undefined') === CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_PERPENDICULAR
        )
        || (
          lastSegment.getAttributeOrDefault('mod_CarcaseDirection', 'undefined') === 'Left'
          && lastSegment.getAttributeOrDefault(CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE, 'undefined') === CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_STRAIGHT
        )
      )
    );

    if (firstSegmentType === mr_StorageunitSingle || firstIsCornerWithFreeLeftSide) {
      // Extend by the upright thickness
      firstSegment.additionalData.segmentLength += firstSegment.additionalData.extensionUpright.Left;
      firstSegment.additionalData.displaceOriginX -= firstSegment.additionalData.extensionUpright.Left;
      // Extend by overhang
      firstSegment.additionalData.segmentLength += firstSegment.additionalData.visibleOverhang.Left;
      firstSegment.additionalData.displaceOriginX -= firstSegment.additionalData.visibleOverhang.Left;
      // The left side also needs to move the origin, because the countertop starts on the left side
    }

    if (lastSegmentType === mr_StorageunitSingle || lastIsCornerWithFreeRightSide) {
      // Extend by the upright thickness
      lastSegment.additionalData.segmentLength += lastSegment.additionalData.extensionUpright.Right;
      // Extend by the overhang
      lastSegment.additionalData.segmentLength += lastSegment.additionalData.visibleOverhang.Right;
    }

    // ===================================================
    //     Divide the countertop by maximum length
    // ===================================================
    const segmentLengths = allSegmentsInThisSection.map(segment => segment.additionalData.segmentLength);
    const segmentLengthsReversed = [...segmentLengths].reverse();
    const segmentGroupsLeftToRight = GlobalFunc.process_PanelLengthSplitByMaximum(segmentLengths, maximumLength, 'LeastToAvg');
    const segmentGroupsRightToLeft = GlobalFunc.process_PanelLengthSplitByMaximum(segmentLengthsReversed, maximumLength, 'LeastToAvg');

    // Check whether we get less segments if this is reversed or not
    const segmentGroups = segmentGroupsRightToLeft.length > segmentGroupsLeftToRight.length ? segmentGroupsLeftToRight : segmentGroupsRightToLeft;


    // ===================================================
    //     Instantiate the countertop segments
    // ===================================================
    for (let i = 0; i < segmentGroups.length - 1; i++) {
      const start = segmentGroups[i];
      const end = segmentGroups[i + 1] ?? segmentLengths.length;

      let totalLength = 0;

      for (let j = start; j < end; j++) {
        totalLength += allSegmentsInThisSection[j].additionalData.segmentLength;
      }

      const countertopSegmentStart = allSegmentsInThisSection[start];
      const countertopSegmentEnd = allSegmentsInThisSection[end - 1];

      const displacementCountertopX = countertopSegmentStart.additionalData.displaceOriginX;

      const countertop = addCountertop();
      countertop.mod_CountertopWidth = Math.round(totalLength * 10) / 10;;
      countertop.mod_CountertopThk = this.mod_CountertopThk;
      countertop.mod_CountertopLeftEndType = countertopSegmentStart.additionalData.connectionType.Left;
      countertop.mod_CountertopRightEndType = countertopSegmentEnd.additionalData.connectionType.Right;
      countertop.mod_CountertopConnectionLengthLeft = countertopSegmentStart.additionalData.connectionLength.Left;
      countertop.mod_CountertopConnectionLengthRight = countertopSegmentEnd.additionalData.connectionLength.Right;
      countertop.mod_CountertopDepth = countertopSegmentStart.additionalData.segmentDepth as number;

      // Added by Ludwig -> write the Edgetype correctly so we can use it in the BOM
      //===============================================================================================

      countertop.mod_CountertopEdgeLeftType = (
        countertopSegmentStart.additionalData.connectionType.Left === "StraightFinished"
        // [Jiri] if upright, always visible
        || countertopSegmentStart.additionalData.extensionUpright.Left > 0
      ) ? "Straight"
        : "NoEdge";

      countertop.mod_CountertopEdgeRightType = (
        countertopSegmentEnd.additionalData.connectionType.Right === "StraightFinished"
        // [Jiri] if upright, always visible
        || countertopSegmentEnd.additionalData.extensionUpright.Right > 0
      ) ? "Straight"
        : "NoEdge";

      // Added by Ludwig -> pass data for the drawings to the countertop segment
      //===============================================================================================

      totalLength = 0;
      for (let j = start; j < end; j++) {

        // Read the data from the contour segment
        let data = allSegmentsInThisSection[j].additionalData.countertopInfo;
        let parsedData = data ? JSON.parse(data) : "";

        // Check if data is existing
        if (data) {

          // Check if there is a cutout
          if (parsedData.Cutout === 1) {
            try {
              let cutoutData = JSON.parse(parsedData.CutoutData);

              // Calculate the position of the cutout
              if (typeof cutoutData.CutPosX === 'number') {
                cutoutData.CutPosX += totalLength;
                parsedData.CutoutData = JSON.stringify(cutoutData);
              }
            }
            catch (e) {
              logError('Error parsing HobData: ' + e);
            }
          }
        }

        // Position of the cabinet for next iteration
        totalLength += allSegmentsInThisSection[j].additionalData.segmentLength;
        totalLength = Math.round(totalLength * 10) / 10;

        // Push it to the countertop
        countertop.mod_CountertopInfo.push(JSON.stringify(parsedData));
      }

      //===============================================================================================

      // get the front edge as an insertion reference
      const frontLeftCorner = countertopSegmentStart.getCornerPoint(CKind.Left, CKind.Front)!.toVector3Extended();
      const frontRightCorner = countertopSegmentStart.getCornerPoint(CKind.Right, CKind.Front)!.toVector3Extended();
      const rearLeftCorner = countertopSegmentStart.getCornerPoint(CKind.Left, CKind.Back)!.toVector3Extended();
      // We must align the countertop with the front edge in some offset, but its pivot is at the rear left corner.
      const localTranslation =
        rearLeftCorner
          // direction from the rear left corner to the front left corner
          .subtract(frontLeftCorner)
          .normalize()
          // position of the countertop pivot
          .scale(countertop.mod_CountertopDepth - this.mod_CountertopOverhangFront)
        ;
      const directionEquation =
        new LineSegmentEquation(frontLeftCorner, frontRightCorner)
          .translate({ both: localTranslation })
          .extend(displacementCountertopX, displacementCountertopX)
        ;
      const transformation = directionEquation.getTransformationMatrixToStartPoint();

      countertop.setOrigin(transformation);

      // for pricing
      this.mod_LengthList.push(totalLength);

      posDepth ??= countertop.mod_CountertopDepth;
      posLength += countertop.mod_CountertopWidth ?? 0;
    }
  }

  // POS Data
  if (posDepth) {
    this._posData.set('depth', posDepth);
  }
  this._posData.set('width', posLength);
  this._posData.set('height', this.mod_CountertopThk);
  this._posData.set('color', this.mod_CountertopColor);
  this._posData.set('doorDirection', this.mod_CountertopConnectionSequence);

  //===================================================
  //          Call the UserExit of this module
  //===================================================

  let retInfo = GlobalFunc.ue_Countertop(this, posDepth, posLength);
