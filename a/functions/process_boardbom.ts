process_BoardBom(Elem: any, part: any ) {

  try {

    //====================================================================
    // 0) Collect the inputs
    //====================================================================

    const topColor: string = part.pa_TopColor;
    const bottomColor: string = part.pa_BtmColor ?? part.pa_TopColor;
    const targetThickness: number = part._thickness;
    const PartSettings = GlobalFunc.find_PartSettings(part._partId, part.pa_TypeElement);
    const finalDims = { length: part._width, width: part._depth };

    // Oversize for bonding -> ToDo create basic setting
    const bondingOversize = {
      length: part.g.basic_BondingOversizeLength,
      width: part.g.basic_BondingOversizeWidth,
    };

    // Saw-Min (machine based rule) -> because there is actually no other way to make sure we are not sending too small parts
    const sawMin = {
      length: part.g.basic_SawCuttingDimensionLengthMin,
      width: part.g.basic_SawCuttingDimensionWidthMin,
    };

    // Edge inputs
    const edgeInput = {
      front: { klass: part.pa_EdgeFrontClass, color: part.pa_EdgeFrontColor },
      left: { klass: part.pa_EdgeLeftClass, color: part.pa_EdgeLeftColor },
      back: { klass: part.pa_EdgeBackClass, color: part.pa_EdgeBackColor },
      right: { klass: part.pa_EdgeRightClass, color: part.pa_EdgeRightColor },
    };

    //====================================================================
    // 1) Decition for bonding
    //====================================================================

    const bonding = GlobalFunc.process_BondingDecider(topColor, bottomColor, targetThickness);

    //====================================================================
    // 2) Load board candidates (bottom only if bonding = true)
    //====================================================================

    const topBoards = GlobalFunc.find_Boards(topColor).map(b => ({
      materialCode: b.materialCode,
      thickness: b.thickness,
      minThk: b.minThickness,
      maxThk: b.maxThickness,
      density: b.density,
      grain: b.grain,
      length: b.length,
      width: b.width,
    }));

    const bottomBoards = bonding
      ? GlobalFunc.find_Boards(bottomColor).map(b => ({
          materialCode: b.materialCode,
          thickness: b.thickness,
          minThk: b.minThickness,
          maxThk: b.maxThickness,
          density: b.density,
          grain: b.grain,
          length: b.length,
          width: b.width,
        }))
      : [];

    //====================================================================
    // 3) Create an array of boards (master + layers if needed)
    //====================================================================

    const boardPlan = GlobalFunc.process_BondingBoards({
      targetThickness,
      finalDims,
      bondingOversize,
      bonding,
      topCandidates: topBoards,
      bottomCandidates: bottomBoards,
    });

    if (boardPlan.length === 0) {
      const ErrorMessage = GlobalFunc.find_ErrorList("Error 40004", 1);
      logError(ErrorMessage.Message(""));
    }

    //====================================================================
    // 4) Collect edge data for the target thickness
    //====================================================================

    const edges = GlobalFunc.process_EdgesBom({
      program: part.pa_Program,
      typeElement: part.pa_TypeElement,
      finalThickness: targetThickness,
      dims: finalDims,
      edges: edgeInput,
      joint: {
        selectable: part.g.basic_EdgeJointTypeSelectable === true,
        selectedId: part.pa_EdgeJointType,
      },
      enableProcessing: part.g.basic_EdgeProcessingSettings === true,
    });
    
    //====================================================================
    // 5) Output the BOM
    //    - Master gets edges + joints + processings
    //    - Bottom layers without edging
    //====================================================================

    for (const p of boardPlan) {
      const Board = Elem.addbomout_Board();
      const isMaster = p.isMaster === true;

      // ---------------- Basic ----------------
      const bomName = PartSettings ? PartSettings.BomPartDescription : part._partId;
      const bomArticleGroup = PartSettings?.PartGroup ?? 'None';

      Board.bom_Type = part._partId;
      Board.bom_Name = bomName;
      Board.bom_PartId = part._id;
      Board.bom_ArticleGroup = bomArticleGroup;
      Board.bom_Route = "";
      Board.bom_ElementCategory = "";
      Board.bom_ElementType = "Board";
      Board.bom_ElementId = part._id;
      Board.bom_ParentId = part.pa_BomId;

      // ---------------- Dimensions ----------------
      Board.bom_Length = part._width;
      Board.bom_Width = part._depth;

      // final thickness only on master (needs to be checked!)
      Board.bom_Finalthk = isMaster ? targetThickness : p.thickness;

      // ---------------- Material ----------------
      Board.bom_Material = p.materialCode;
      Board.bom_GrainOrientation = part.pa_PartGrain;

      // ---------------- Cut dims ----------------

      // Overmeasure only relevant on master
      const overL = isMaster ? edges.overmeasure.length : 0;
      const overW = isMaster ? edges.overmeasure.width : 0;

      if (!bonding) {
        // SINGLE: CutDim1 = final cut incl. edge overmeasure, CutDim2 unused
        const rawCutLength1 = p.cutLength + overL;
        const rawCutWidth1  = p.cutWidth + overW;

        Board.bom_CutDimLength1 = rawCutLength1 < sawMin.length ? sawMin.length : rawCutLength1;
        Board.bom_CutDimWidth1  = rawCutWidth1  < sawMin.width  ? sawMin.width  : rawCutWidth1;

        Board.bom_CutDimLength2 = 0;
        Board.bom_CutDimWidth2  = 0;

      }
      else {
        // BONDING: CutDim1 = bonding cut (NO edge overmeasure)
        const rawCutLength1 = p.cutLength;
        const rawCutWidth1  = p.cutWidth;

        Board.bom_CutDimLength1 = rawCutLength1 < sawMin.length ? sawMin.length : rawCutLength1;
        Board.bom_CutDimWidth1  = rawCutWidth1  < sawMin.width  ? sawMin.width  : rawCutWidth1;

        if (isMaster) {
          // BONDING: CutDim2 = trim / final cut WITH edge overmeasure only on master
          Board.bom_CutDimLength2 = part._width + overL;
          Board.bom_CutDimWidth2  = part._depth + overW;
        }
        else {
          Board.bom_CutDimLength2 = 0;
          Board.bom_CutDimWidth2  = 0;
        }
      }

      // ---------------- Edge data (only master) ----------------
      if (isMaster) {
        Board.bom_EdgeFront = edges.edgeCodes.front;
        Board.bom_EdgeLeft = edges.edgeCodes.left;
        Board.bom_EdgeBack = edges.edgeCodes.back;
        Board.bom_EdgeRight = edges.edgeCodes.right;

        Board.bom_EdgeJointFrontLeft = edges.joint.frontLeft;
        Board.bom_EdgeJointLeftBack = edges.joint.leftBack;
        Board.bom_EdgeJointBackRight = edges.joint.backRight;
        Board.bom_EdgeJointRightFront = edges.joint.rightFront;
        Board.bom_EdgeShape = edges.joint.shape;
        Board.bom_EdgeTransition = edges.joint.transition;

        if (edges.processing) {
          Board.bom_CornerProcessingFrontLeft = edges.processing.cornerFrontLeft;
          Board.bom_CornerProcessingLeftBack = edges.processing.cornerLeftBack;
          Board.bom_CornerProcessingBackRight = edges.processing.cornerBackRight;
          Board.bom_CornerProcessingRightFront = edges.processing.cornerRightFront;

          Board.bom_EdgeFrontProcessing = edges.processing.edgeFront;
          Board.bom_EdgeLeftProcessing = edges.processing.edgeLeft;
          Board.bom_EdgeBackProcessing = edges.processing.edgeBack;
          Board.bom_EdgeRightProcessing = edges.processing.edgeRight;
        }
      } 
      else {
        // Bottom layers -> no edging
        Board.bom_EdgeFront = "NoEdgeband";
        Board.bom_EdgeLeft = "NoEdgeband";
        Board.bom_EdgeBack = "NoEdgeband";
        Board.bom_EdgeRight = "NoEdgeband";
      }

      // ---------------- Additional ----------------
      Board.bom_ExtraInfo1 = "";
      Board.bom_ExtraInfo2 = "";
      Board.bom_ExtraInfo3 = "";
    }
  } 
  catch (error: any) {
    const ErrorMessage = GlobalFunc.find_ErrorList("Error 40003", 1);
    logError(ErrorMessage.Message(error.message));
  }
  
}