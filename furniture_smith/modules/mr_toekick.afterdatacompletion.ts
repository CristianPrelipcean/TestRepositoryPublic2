  // Schuler Consulting
  // Create: October 2024
  // By Stefano Cortese
  // Purpose: CabinetLibrary
  //
  // Description:
  // Creation of the Toekick
  // 
  // Modified by Jiri Polcar in Match 2025
  // Added generated toekick from the contours
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add module for the Toeckick
  //===================================================
  let toekickCounter = 0
  let posHeight: number | undefined;
  let posLength = 0;
  const {
    LongPartSegment,
    LineSegmentEquation,
    LongPartSegmentEdge,
    Vector3Extended,
    CONTOUR_ATTRIBUTE_OWNER_TYPE,
    CONTOUR_ATTRIBUTE_ADD_TOEKICK,
    CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE,
    CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_STRAIGHT,
    CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_PERPENDICULAR,
    mr_CornerunitStraight,
    mr_StorageunitSingle,
    mr_Upright, // do we have to solve the upright? it won't touch the upright contour anyway
  } = GlobalFunc.process_MathLongparts();
  type LongPartSegmentTypeAlias = InstanceType<typeof LongPartSegment>;
  type LongPartSegmentEdgeTypeAlias = InstanceType<typeof LongPartSegmentEdge>;
  type LeftRightAny = { Left: any, Right: any }

  const segments = this.getGenerationContours().map(contour => {
    const lps = new LongPartSegment(contour);
    lps.getOrAddSide(CKind.Left, CKind.Right);
    lps.getOrAddSide(CKind.Right, CKind.Left);
    const sideToekickPossible: LeftRightAny = { Left: true, Right: true };
    lps.additionalData = {
      segmentLength: lps.getLengthBetweenParallelSides(CKind.Left, CKind.Right),
      sideToekickPossible: sideToekickPossible,
      displacementToekickX_Corner: 0,
      addToekickWithLength: 0,
    };
    return lps;
  });

  const frontIsLong = this.mod_ToekickSidepanelTransitionType === 'FrontLong';

  logInfo('mr_Toekick has been instantiated and has received ' + segments.length + ' generation contours.');

  const carcaseSegmentsWithToekicks = segments.filter(segment =>
    [mr_CornerunitStraight, mr_StorageunitSingle].includes(segment.getAttributeOrDefault(CONTOUR_ATTRIBUTE_OWNER_TYPE, 'undefined'))
    && segment.getAttributeOrDefault(CONTOUR_ATTRIBUTE_ADD_TOEKICK, 0) === 1
  );
  const otherSegments = segments.filter(segment => !carcaseSegmentsWithToekicks.includes(segment));

  // match carcases with toekicks
  for (let i = 0; i < carcaseSegmentsWithToekicks.length; i++) {
    const current = carcaseSegmentsWithToekicks[i];
    const rest = carcaseSegmentsWithToekicks.slice(i + 1);
    for (let j = 0; j < rest.length; j++) {
      current.tryMatchNeighboursByAxialContinuity(CKind.Front, rest, { match3D: true, matchFootprint: true });
      current.tryMatchSiblings(rest);
    }
  }

  // match rest of countertop contours with the countertop segments on footprints
  // this will be necessary to determine other countertop attributes based on its neighbours
  for (const nonCarcaseSegment of otherSegments) {
    nonCarcaseSegment.tryMatchNeighboursByPartialCoincidence(carcaseSegmentsWithToekicks, { match3D: false, matchFootprint: true });
  }

  const startingSegments = carcaseSegmentsWithToekicks.filter(segment => segment.neighbours.get(CKind.Left)?.other === null);

  const toekickConnectionSequence = this.mod_ToekickConnectionSequence.split('_');
  if (!toekickConnectionSequence || !toekickConnectionSequence.length) {
    logError('Toekick connection sequence is not set. Using default sequence (L).');
    toekickConnectionSequence.push('L');
  }
  let toekickConnectionSequenceIndex = 0;

  let toekickIndex = 1;
  const addToekick = () => {
    const toekick = this.addOD_M_mc_Toekick();
    toekick.mod_ToekickId = `Toekick_${toekickIndex++}`;
    return toekick;
  }

  for (const segmentIndex in startingSegments) {
    const firstSegment = startingSegments[segmentIndex];
    const allSegmentsInThisSection = [];

    let current: LongPartSegmentTypeAlias | null = firstSegment;
    let lastSegment: any = firstSegment;

    while (current) {
      allSegmentsInThisSection.push(current);
      const currentOwnerType = current.getAttributeOrDefault(CONTOUR_ATTRIBUTE_OWNER_TYPE, 'undefined owner type');

      // do stuff, check with corners etc.
      if (currentOwnerType === mr_CornerunitStraight) {
        const sibling: LongPartSegmentTypeAlias = current.siblings.find((s: any) => s.getAttributeOrDefault(CONTOUR_ATTRIBUTE_OWNER_TYPE, 'no corner') === mr_CornerunitStraight)!;
        const currentIsStraightCornerPart = (current.getAttributeOrDefault(CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE, 'not a corner')) === CONTOUR_ATTRIBUTE_CORNER_CONTOUR_TYPE_STRAIGHT;

        const pointOfIntersectionOfFrontSides = current.neighbours.get(CKind.Front)?.edge!.intersection(sibling.neighbours.get(CKind.Front)?.edge!)!;

        const CarcaseDirection = current.getAttributeOrDefault('mod_CarcaseDirection', 'undefined direction');

        // can not use CKind.Front contour, because its direction is not assured.
        const frontSideOriented = new LineSegmentEquation(
          current.getCornerPoint(CKind.Left, CKind.Front)!.toVector3Extended(),
          current.getCornerPoint(CKind.Right, CKind.Front)!.toVector3Extended(),
        );

        // TODO: get the transition type from the attribute and distribute it to the corners
        const toekickConnectionType: string = toekickConnectionSequence[(toekickConnectionSequenceIndex++) % toekickConnectionSequence.length];
        if (toekickConnectionSequenceIndex >= toekickConnectionSequence.length - 1) {
          logInfo(`mod_ToekickConnectionSequence ${toekickConnectionSequence.join('_')} is too short - it has ${toekickConnectionSequence.length}, but ${toekickConnectionSequenceIndex} is requested. Sequence is repeated.`);
        }
        const toekickThk = this.mod_ToekickThk;

        // Based on whether this is a left or right corner and if it is its straight or perpendicular part, adjust lengths and displacements
        // Take into consideration the connection type - which of the two ends is the longer one.
        if (CarcaseDirection === 'Left' && currentIsStraightCornerPart) {
          current.additionalData.sideToekickPossible.Left = false;
          current.additionalData.segmentLength = current.neighbours.get(CKind.Right)?.edge?.perpendicularDistanceOfPoint(pointOfIntersectionOfFrontSides);
          current.additionalData.displacementToekickX_Corner = frontSideOriented.getParameterOfPoint(pointOfIntersectionOfFrontSides);
          if (toekickConnectionType === 'L') {
            current.additionalData.segmentLength -= toekickThk;
            current.additionalData.displacementToekickX_Corner += toekickThk;
          }
          else {
            current.additionalData.segmentLength += this.mod_ToekickConnectionOverhang;
            current.additionalData.displacementToekickX_Corner -= this.mod_ToekickConnectionOverhang;
          }
        }
        else if (CarcaseDirection === 'Left' && !currentIsStraightCornerPart) {
          current.additionalData.sideToekickPossible.Right = false;
          current.additionalData.segmentLength = current.neighbours.get(CKind.Left)?.edge?.perpendicularDistanceOfPoint(pointOfIntersectionOfFrontSides);
          current.additionalData.displacementToekickX_Corner = 0;
          if (toekickConnectionType === 'L') {
            current.additionalData.segmentLength += this.mod_ToekickConnectionOverhang;
          }
          else {
            current.additionalData.segmentLength -= toekickThk;
          }
        }
        else if (CarcaseDirection === 'Right' && currentIsStraightCornerPart) {
          current.additionalData.sideToekickPossible.Right = false;
          current.additionalData.segmentLength = current.neighbours.get(CKind.Left)?.edge?.perpendicularDistanceOfPoint(pointOfIntersectionOfFrontSides);
          current.additionalData.displacementToekickX_Corner = 0;
          if (toekickConnectionType === 'L') {
            current.additionalData.segmentLength += this.mod_ToekickConnectionOverhang;
          }
          else {
            current.additionalData.segmentLength -= toekickThk;
          }
        }
        else if (CarcaseDirection === 'Right' && !currentIsStraightCornerPart) {
          current.additionalData.sideToekickPossible.Left = false;
          current.additionalData.segmentLength = current.neighbours.get(CKind.Right)?.edge?.perpendicularDistanceOfPoint(pointOfIntersectionOfFrontSides);
          current.additionalData.displacementToekickX_Corner = frontSideOriented.getParameterOfPoint(pointOfIntersectionOfFrontSides);
          if (toekickConnectionType === 'L') {
            current.additionalData.segmentLength -= toekickThk;
            current.additionalData.displacementToekickX_Corner += toekickThk;
          }
          else {
            current.additionalData.segmentLength += this.mod_ToekickConnectionOverhang;
            current.additionalData.displacementToekickX_Corner -= this.mod_ToekickConnectionOverhang;
          }
        }
        else {
          logError('CarcaseDirection is not set correctly: ' + CarcaseDirection);
        }
      }

      current = current.neighbours.get(CKind.Right)?.other ?? null;
      if (current) {
        lastSegment = current;
        if (allSegmentsInThisSection.includes(current)) {
          logError('Toekicks form a closed loop. This is not supported.');
          break;
        }
      }
    }



    const addLeftSidePanel = (
      firstSegment.getAttributeOrDefault('mod_PlinthAreaVisLeft', 1) > 0
      && firstSegment.additionalData.sideToekickPossible.Left
    );
    const addRightSidePanel = (
      lastSegment.getAttributeOrDefault('mod_PlinthAreaVisRight', 1) > 0
      && lastSegment.additionalData.sideToekickPossible.Right
    );

    if (addRightSidePanel && frontIsLong) {
      lastSegment.additionalData.segmentLength += this.mod_ToekickThk;
    }

    if (addLeftSidePanel && frontIsLong) {
      firstSegment.additionalData.segmentLength += this.mod_ToekickThk;
      firstSegment.additionalData.displacementToekickX_Corner -= this.mod_ToekickThk;
    }

    // Get the maximum toekick possible length from the boards properties.
    let maximumLength;
    try {
      const boardMapping = GlobalFunc.find_BoardMapping(this.mod_ToekickColor, this.mod_ToekickThk);
      const boardEntry = GlobalFunc.find_BoardLibrary(boardMapping.BoardId!);
      maximumLength = boardEntry!.BoardLength;
    }
    catch (e) {
      maximumLength = 9999;
      //logError(`Error while retrieving maximum toekick length. Using fallback value ${maximumLength}. Error: ${e}`);
    }

    /*
     * Distribute the toekick segments to groups of maximum length, do not split them in the middle of the segments and
     * if possible, make them uniform.
     */
    const segmentLengths = allSegmentsInThisSection.map(segment => segment.additionalData.segmentLength);
    const segmentLengthsReversed = [...segmentLengths].reverse();

    const segmentGroupsLeftToRight = GlobalFunc.process_PanelLengthSplitByMaximum(segmentLengths, maximumLength, 'LeastToAvg');
    const segmentGroupsRightToLeft = GlobalFunc.process_PanelLengthSplitByMaximum(segmentLengthsReversed, maximumLength, 'LeastToAvg');

    const segmentGroups = segmentGroupsRightToLeft.length > segmentGroupsLeftToRight.length ? segmentGroupsLeftToRight : segmentGroupsRightToLeft;
    for (let i = 0; i < segmentGroups.length; i++) {
      const start = segmentGroups[i];
      const end = segmentGroups[i + 1] ?? segmentLengths.length;
      for (let j = start; j < end; j++) {
        allSegmentsInThisSection[start].additionalData.addToekickWithLength += allSegmentsInThisSection[j].additionalData.segmentLength;
      }
    }


    // Finally add the toekick modules.

    current = firstSegment;
    let currentToekick = null;
    let lastToekick = null;

    while (current) {
      if (current.additionalData.addToekickWithLength > 0) {

        // get the front edge as an insertion reference
        const frontLeftCorner = current.getCornerPoint(CKind.Left, CKind.Front)!.toVector3Extended();
        const frontRightCorner = current.getCornerPoint(CKind.Right, CKind.Front)!.toVector3Extended();
        let directionEquation = new LineSegmentEquation(frontLeftCorner, frontRightCorner, true).extend(current.additionalData.displacementToekickX_Corner, 0);

        currentToekick = addToekick();
        currentToekick.mod_ToekickHeight = firstSegment.generationContour.height - (this.mod_ToekickReductionTop ?? 0);
        currentToekick.mod_ToekickLength = current.additionalData.addToekickWithLength;

        const transformation = directionEquation.getTransformationMatrixToStartPoint();
        currentToekick.setOrigin(transformation);

        // for pricing
        this.mod_LengthList.push(current.additionalData.addToekickWithLength);

        lastToekick = currentToekick;
        posLength += currentToekick.mod_ToekickLength ?? 0;
        posHeight ??= currentToekick.mod_ToekickHeight;
      }

      current = current.neighbours.get(CKind.Right)?.other ?? null;
    }



    // check side toekicks
    if (addLeftSidePanel) {
      const leftToekick = addToekick();
      leftToekick.mod_ToekickHeight =
        firstSegment.generationContour.height
        + (this.mod_ToekickSidepanelOverdimensionBtm ?? 0)
        ;

      const leftToekickLineEquation = new LineSegmentEquation(
        firstSegment.getCornerPoint(CKind.Left, CKind.Back)!.toVector3Extended(),
        firstSegment.getCornerPoint(CKind.Left, CKind.Front)!.toVector3Extended(),
        true,
      )
        .translate({ both: new Vector3(0, -(this.mod_ToekickSidepanelOverdimensionBtm ?? 0), 0) })
        .extend(
          0,
          frontIsLong ? -this.mod_ToekickThk : 0,
        )
        ;
      // TODO who wins and is longer - front or side?
      leftToekick.mod_ToekickLength = leftToekickLineEquation.length + this.mod_ToekickThk;
      leftToekick.setOrigin(
        leftToekickLineEquation.getTransformationMatrixToStartPoint()
      );

      // for pricing
      this.mod_LengthList.push(leftToekick.mod_ToekickLength);
      posLength += leftToekick.mod_ToekickLength ?? 0;
      posHeight ??= leftToekick.mod_ToekickHeight;
    }



    if (addRightSidePanel) {
      const rightToekick = addToekick();
      rightToekick.mod_ToekickHeight =
        firstSegment.generationContour.height
        + (this.mod_ToekickSidepanelOverdimensionBtm ?? 0)
        ;

      const rightToekickLineEquation_beforeAlignment = new LineSegmentEquation(
        lastSegment.getCornerPoint(CKind.Right, CKind.Back)!.toVector3Extended(),
        lastSegment.getCornerPoint(CKind.Right, CKind.Front)!.toVector3Extended(),
        true,
      );
      // TODO who wins and is longer - front or side?
      rightToekick.mod_ToekickLength = rightToekickLineEquation_beforeAlignment.length + this.mod_ToekickThk;
      const rightToekickLineEquation = new LineSegmentEquation(
        rightToekickLineEquation_beforeAlignment.getPointAt(rightToekick.mod_ToekickLength),
        rightToekickLineEquation_beforeAlignment.start,
        true,
      ).translate({ both: new Vector3(0, -(this.mod_ToekickSidepanelOverdimensionBtm ?? 0), 0) })
        .extend(frontIsLong ? this.mod_ToekickThk : 0, 0)
        ;
      rightToekick.setOrigin(
        rightToekickLineEquation.getTransformationMatrixToStartPoint()
      );

      // for pricing
      this.mod_LengthList.push(rightToekick.mod_ToekickLength);
      posLength += rightToekick.mod_ToekickLength ?? 0;
      posHeight ??= rightToekick.mod_ToekickHeight;
    }

  }

	//===================================================
	//          Call the UserExit of this module
	//===================================================

	let retInfo = GlobalFunc.ue_Toekick(this, posLength, posHeight);
