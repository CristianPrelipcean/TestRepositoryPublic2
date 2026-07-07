process_BondingBoards(input: {
  targetThickness: number;
  finalDims: { length: number; width: number };
  bondingOversize: { length: number; width: number };
  bonding: boolean;

  topCandidates: Array<{
    materialCode: string;
    thickness: number;
    minThk?: number;
    maxThk?: number;
    density?: number;
    grain?: string;
    length?: number;
    width?: number;
  }>;

  bottomCandidates?: Array<{
    materialCode: string;
    thickness: number;
    minThk?: number;
    maxThk?: number;
    density?: number;
    grain?: string;
    length?: number;
    width?: number;
  }>;
}): Array<{
  materialCode: string;
  thickness: number;
  isMaster: boolean;
  cutLength: number;
  cutWidth: number;
}> {

    //======================================================================
    // Bonding required
    //======================================================================
    if (input.bonding) {

    const target = input.targetThickness;
    const oversizeL = input.bondingOversize.length;
    const oversizeW = input.bondingOversize.width;

    const top = input.topCandidates;
    const bottom = input.bottomCandidates ?? [];

    if (top.length === 0 || bottom.length === 0) {
        return [];
    }

    // Helper: find plate covering thickness via range
    const findByRange = (candidates: typeof top, thk: number) =>
        candidates.find(c =>
        c.minThk !== undefined &&
        c.maxThk !== undefined &&
        c.minThk <= thk &&
        c.maxThk >= thk
    );

    // -------------------------------------------------------------
    // 1) Try perfect 2-layer solution (target / 2)
    // -------------------------------------------------------------

    const half = target / 2;
    const topHalf = findByRange(top, half);
    const bottomHalf = findByRange(bottom, half);

    if (topHalf && bottomHalf) {
        return [
        {
            materialCode: topHalf.materialCode,
            thickness: topHalf.thickness,
            isMaster: true,
            cutLength: input.finalDims.length + oversizeL,
            cutWidth: input.finalDims.width + oversizeW,
        },
        {
            materialCode: bottomHalf.materialCode,
            thickness: bottomHalf.thickness,
            isMaster: false,
            cutLength: input.finalDims.length + oversizeL,
            cutWidth: input.finalDims.width + oversizeW,
        }
        ];
    }

    // -------------------------------------------------------------
    // 2) Try 3-layer symmetric solution (target / 3)
    // Master = 1x Top
    // Bottom = 2x Bottom
    // -------------------------------------------------------------

    const third = target / 3;
    const topThird = findByRange(top, third);
    const bottomThird = findByRange(bottom, third);

    if (topThird && bottomThird) {
        return [
        {
            materialCode: topThird.materialCode,
            thickness: topThird.thickness,
            isMaster: true,
            cutLength: input.finalDims.length + oversizeL,
            cutWidth: input.finalDims.width + oversizeW,
        },
        {
            materialCode: bottomThird.materialCode,
            thickness: bottomThird.thickness,
            isMaster: false,
            cutLength: input.finalDims.length + oversizeL,
            cutWidth: input.finalDims.width + oversizeW,
        },
        {
            materialCode: bottomThird.materialCode,
            thickness: bottomThird.thickness,
            isMaster: false,
            cutLength: input.finalDims.length + oversizeL,
            cutWidth: input.finalDims.width + oversizeW,
        }
        ];
    }

    // -------------------------------------------------------------
    // 3) Fallback strategy
    // -------------------------------------------------------------

    // Step 1: Take thinnest possible Top board
    const master = top[0];

    const rest = target - master.thickness;
    if (rest <= 0) {
      const ErrorMessage = GlobalFunc.find_ErrorList("Error 40005", 1);
      logError(ErrorMessage.Message(""));
    }

    // Try single bottom for rest
    const bottomRest = findByRange(bottom, rest);
    if (bottomRest) {
        return [
        {
            materialCode: master.materialCode,
            thickness: master.thickness,
            isMaster: true,
            cutLength: input.finalDims.length + oversizeL,
            cutWidth: input.finalDims.width + oversizeW,
        },
        {
            materialCode: bottomRest.materialCode,
            thickness: bottomRest.thickness,
            isMaster: false,
            cutLength: input.finalDims.length + oversizeL,
            cutWidth: input.finalDims.width + oversizeW,
        }
        ];
    }

    // Try 2 bottom layers: thin + middle
    const thinBottom = bottom[0];

    const restAfterThin = rest - thinBottom.thickness;
    if (restAfterThin > 0) {
        const middle = findByRange(bottom, restAfterThin);
        if (middle) {
        return [
            {
            materialCode: master.materialCode,
            thickness: master.thickness,
            isMaster: true,
            cutLength: input.finalDims.length + oversizeL,
            cutWidth: input.finalDims.width + oversizeW,
            },
            {
            materialCode: thinBottom.materialCode,
            thickness: thinBottom.thickness,
            isMaster: false,
            cutLength: input.finalDims.length + oversizeL,
            cutWidth: input.finalDims.width + oversizeW,
            },
            {
            materialCode: middle.materialCode,
            thickness: middle.thickness,
            isMaster: false,
            cutLength: input.finalDims.length + oversizeL,
            cutWidth: input.finalDims.width + oversizeW,
            }
        ];
        }
    }

      // If everything fails
      const ErrorMessage = GlobalFunc.find_ErrorList("Error 40006", 1);
      logError(ErrorMessage.Message(""));
    }

  //======================================================================
  // Single board -> no bonding required
  //======================================================================

  const target = input.targetThickness;

  // Only: range hit
  const matches = input.topCandidates.filter(c =>
    c.minThk !== undefined &&
    c.maxThk !== undefined &&
    c.minThk <= target &&
    c.maxThk >= target
  );

  // Guard -> if we didn't find a board (should never happen)
  if (matches.length === 0) {
      let Text = '${target}'
      const ErrorMessage = GlobalFunc.find_ErrorList("Error 40007", 1);
      logError(ErrorMessage.Message(Text));
  }

  // If there are more than one -> we take the first based on the thickness
  const selected = matches.reduce((prev, curr) => curr.thickness < prev.thickness ? curr : prev);

  return [{
    materialCode: selected.materialCode,
    thickness: selected.thickness,
    isMaster: true,
    cutLength: input.finalDims.length,
    cutWidth: input.finalDims.width,
  }];
}