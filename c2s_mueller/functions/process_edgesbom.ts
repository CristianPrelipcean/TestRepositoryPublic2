process_EdgesBom(input: {
  program: string;
  typeElement: string;

  finalThickness: number;
  dims: { length: number; width: number };

  edges: {
    front: { klass: string; color: string };
    left: { klass: string; color: string };
    back: { klass: string; color: string };
    right: { klass: string; color: string };
  };

  joint: {
    selectable: boolean;
    selectedId?: string;
  };

  enableProcessing: boolean;
}): {

  // --------------------------------------------------
  // Basic edge data
  // --------------------------------------------------
  edgeCodes: {
    front: string;
    left: string;
    back: string;
    right: string;
  };

  // --------------------------------------------------
  // Joint data
  // --------------------------------------------------
  joint: {
    jointTypeId: string;
    frontLeft: string;
    leftBack: string;
    backRight: string;
    rightFront: string;
    shape: string;
    transition: string;
  };

  // --------------------------------------------------
  // Optional processings
  // --------------------------------------------------
  processing?: {
    cornerFrontLeft: string;
    cornerLeftBack: string;
    cornerBackRight: string;
    cornerRightFront: string;

    edgeFront: string;
    edgeLeft: string;
    edgeBack: string;
    edgeRight: string;
  };

  // --------------------------------------------------
  // Cutting overdimensions
  // --------------------------------------------------
  overmeasure: {
    length: number;
    width: number;
  };
} {

  // --------------------------------------------------
  // Helper: Resolve one edge
  // --------------------------------------------------
  const resolveEdge = (side: { klass: string; color: string }) => {

    if (side.klass === "NoEdge" || side.color === "NoEdge") {
      return {
        code: "NoEdgeband",
        thickness: 0,
        over: 0,
        banded: false
      };
    }

    const mapping = GlobalFunc.find_EdgeMapping(
      input.program,
      side.klass,
      side.color,
      input.finalThickness
    );

    const code = mapping.EdgeObject!;
    const lib = GlobalFunc.find_EdgeLibrary(code);
    const thickness = lib.Thickness!;

    const over = thickness > 0
      ? GlobalFunc.find_PartOverdimension(thickness).Overdimension
      : 0;

    return {
      code,
      thickness,
      over,
      banded: thickness !== 0
    };
  };

  // --------------------------------------------------
  // Resolve all sides
  // --------------------------------------------------
  const front = resolveEdge(input.edges.front);
  const left  = resolveEdge(input.edges.left);
  const back  = resolveEdge(input.edges.back);
  const right = resolveEdge(input.edges.right);

  // --------------------------------------------------
  // Determine Joint Type
  // --------------------------------------------------
  const dimensionRelation = input.dims.length >= input.dims.width ? "True" : "False";

  const jointTypeId = input.joint.selectable
    ? input.joint.selectedId!
    : GlobalFunc.find_EdgeJointTypeMapping(
        input.typeElement,
        front.banded,
        left.banded,
        back.banded,
        right.banded,
        dimensionRelation
      ).EdgeJointType!;

  // --------------------------------------------------
  // Joint Construction
  // --------------------------------------------------
  const jointCon = GlobalFunc.find_EdgeJointTypeConstruction(jointTypeId);

  // --------------------------------------------------
  // Processing (optional)
  // --------------------------------------------------
  let processing:
    | {
        cornerFrontLeft: string;
        cornerLeftBack: string;
        cornerBackRight: string;
        cornerRightFront: string;

        edgeFront: string;
        edgeLeft: string;
        edgeBack: string;
        edgeRight: string;
      }
    | undefined = undefined;

  if (input.enableProcessing) {

    const fl = GlobalFunc.find_EdgeProcessingSettings(
      input.typeElement,
      jointCon.EdgeJointFrontLeft!,
      front.thickness,
      left.thickness
    );

    const lb = GlobalFunc.find_EdgeProcessingSettings(
      input.typeElement,
      jointCon.EdgeJointLeftBack!,
      left.thickness,
      back.thickness
    );

    const br = GlobalFunc.find_EdgeProcessingSettings(
      input.typeElement,
      jointCon.EdgeJointBackRight!,
      back.thickness,
      right.thickness
    );

    const rf = GlobalFunc.find_EdgeProcessingSettings(
      input.typeElement,
      jointCon.EdgeJointRightFront!,
      right.thickness,
      front.thickness
    );

    processing = {
      cornerFrontLeft: fl.CornerProcessingTop + fl.CornerProcessingBtm,
      cornerLeftBack: lb.CornerProcessingTop + lb.CornerProcessingBtm,
      cornerBackRight: br.CornerProcessingTop + br.CornerProcessingBtm,
      cornerRightFront: rf.CornerProcessingTop + rf.CornerProcessingBtm,

      edgeFront: fl.EdgeProcessingTop + fl.EdgeProcessingBtm,
      edgeLeft: lb.EdgeProcessingTop + lb.EdgeProcessingBtm,
      edgeBack: br.EdgeProcessingTop + br.EdgeProcessingBtm,
      edgeRight: rf.EdgeProcessingTop + rf.EdgeProcessingBtm,
    };
  }

  // --------------------------------------------------
  // Overmeasure calculation (pure geometry delta)
  // --------------------------------------------------
  const overmeasureLength = left.over + right.over - left.thickness - right.thickness;
  const overmeasureWidth = front.over + back.over - front.thickness - back.thickness;

  // --------------------------------------------------
  // Final Return
  // --------------------------------------------------
  return {
    edgeCodes: {
      front: front.code,
      left: left.code,
      back: back.code,
      right: right.code,
    },

    joint: {
      jointTypeId,
      frontLeft: jointCon.EdgeJointFrontLeft!,
      leftBack: jointCon.EdgeJointLeftBack!,
      backRight: jointCon.EdgeJointBackRight!,
      rightFront: jointCon.EdgeJointRightFront!,
      shape: jointCon.EdgeShape!,
      transition: jointCon.EdgeTransition!,
    },

    processing,

    overmeasure: {
      length: overmeasureLength,
      width: overmeasureWidth,
    },
  };
}