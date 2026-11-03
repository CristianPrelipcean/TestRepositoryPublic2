cprocess_BoardBom(Elem: any, part: any) {

  try {

    //====================================================================
    // 0) Collect the inputs
    //====================================================================

    const topColor: string = part.pa_TopColor;
    const bottomColor: string = part.pa_BtmColor //?? part.pa_TopColor;
    const targetThickness: number = part._thickness;
    const PartSettings = GlobalFunc.find_PartSettings(part._partId, part.pa_TypeElement);
    const finalDims = { length: part._width, width: part._depth };

    //------------------------------------
    // Saw-Min (machine based rule) -> because there is actually no other way to make sure we are not sending too small parts
    //------------------------------------
    const sawMin = {
      length: part.g.basic_SawCuttingDimensionLengthMin,
      width: part.g.basic_SawCuttingDimensionWidthMin,
    };

    //------------------------------------
    // Lot group
    //------------------------------------
    //const lotGroup = GlobalFunc.cfind_LotGroupMapping(part.pa_TypeElement, part.pa_Program);

    //------------------------------------
    // Edge inputs
    //------------------------------------

    const edgeInput = {
      front: { klass: part.pa_EdgeFrontClass, color: part.pa_EdgeFrontColor },
      left: { klass: part.pa_EdgeLeftClass, color: part.pa_EdgeLeftColor },
      back: { klass: part.pa_EdgeBackClass, color: part.pa_EdgeBackColor },
      right: { klass: part.pa_EdgeRightClass, color: part.pa_EdgeRightColor },
    };

    //====================================================================
    // 1) Collect edge data 
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
    // 2) Create boardPlan
    //====================================================================

    interface iBoardPlan {
      BoardId: string;
      Thickness: number;
      IsMaster: boolean;
      Property: ICT_tab_BoardLibrary[];
    };
    let boardPlan: iBoardPlan[] = [];

    //------------------------------------
    // Programm with 1 material and one color
    //------------------------------------

    if (part.cpa_ProgramGroup.Custom_Group === "OneColor") {

      const board = GlobalFunc.find_BoardMapping(topColor, targetThickness);

      const BoardsProperties = GlobalFunc.find_BoardLibrary(board.BoardId!);

      if (board && board.BoardId) {

        boardPlan.push({

          BoardId: board.BoardId,

          Thickness: targetThickness,

          IsMaster: true,

          Property: BoardsProperties

        });
      }
    }

    //------------------------------------
    // Programm with 1 material and two colors
    //------------------------------------

    else if (part.cpa_ProgramGroup.Custom_Group === "TwoColors") {

      const board = GlobalFunc.cfind_2ColorBoardMapping(topColor, bottomColor, targetThickness);

      const BoardsProperties = GlobalFunc.find_BoardLibrary(board.BoardId!);

      if (board && board.BoardId) {

        boardPlan.push({

          BoardId: board.BoardId,

          Thickness: targetThickness,

          IsMaster: true,

          Property: BoardsProperties

        });
      }
    }

    //------------------------------------
    // Programm with 1 or 2 materials and/or different color on top and bottom
    //------------------------------------

    else {

      const bottomBoards = GlobalFunc.find_BoardMapping(bottomColor, part.g.cbasic_MasterBoardThk);

      const bottomBoardsProperties = GlobalFunc.find_BoardLibrary(bottomBoards.BoardId!);

      const bottomBoardsThk = bottomBoardsProperties[0].Thickness

      const topBoards = GlobalFunc.find_BoardMapping(topColor, targetThickness - part.g.cbasic_MasterBoardThk -1);

      const topBoardsProperties = GlobalFunc.find_BoardLibrary(topBoards.BoardId!);

      const topBoardsThk = topBoardsProperties[0].Thickness;

      //Top material

      if (topBoards && topBoards.BoardId) {

        boardPlan.push({

          BoardId: topBoards.BoardId,

          Thickness: topBoardsThk,

          IsMaster: false,

          Property: topBoardsProperties

        });
      }

      // Bottom material

      if (bottomBoards && bottomBoards.BoardId) {

        boardPlan.push({

          BoardId: bottomBoards.BoardId,

          Thickness: bottomBoardsThk,

          IsMaster: true,

          Property: bottomBoardsProperties
        })

      }
    }
    //====================================================================
    // 3) Validation
    //====================================================================

    if (boardPlan.length === 0) {
      const ErrorMessage =
        GlobalFunc.find_ErrorList("Error 40004", 1);
      logError(ErrorMessage.Message(""));

      return;
    }

    //====================================================================
    // 4) Create BOM output
    //====================================================================

    for (const plan of boardPlan) {

      const Board = Elem.addbomout_Board();

      const isMaster = plan.IsMaster;

      // ---------------- Basic ----------------
      const bomName = PartSettings ? PartSettings.BomPartDescription : part._partId;
      const bomArticleGroup = PartSettings?.PartGroup ?? 'None';
      const lotGroup = //GlobalFunc.cfind_LotGroupMapping(part.pa_TypeElement, part.pa_Program);

        Board.bom_Type = part._partId;
      Board.bom_Name = bomName;
      Board.bom_PartId = part._id;
      Board.bom_ArticleGroup = bomArticleGroup;
      Board.bom_Route = "";
      Board.bom_ElementCategory = "";
      Board.bom_ElementType = "Board";
      Board.bom_ElementId = part._id;
      Board.bom_ParentId = part.pa_BomId;
      Board.bom_ArticleGroup = "" //lotGroup.LotGroup;
      //Board.bom_Route = '';

      // ---------------- Dimensions ----------------
      Board.bom_Length = part._width;
      Board.bom_Width = part._depth;

      // final thickness only on master (needs to be checked!)
      Board.bom_Finalthk = plan.Thickness;

      // ---------------- Material ----------------
      Board.bom_Material = plan.BoardId!;
      Board.bom_GrainOrientation = plan.Property[0].Grain == "None" ? "None" : part.pa_PartGrain;

      // ---------------- Cut dims ----------------

      // Overmeasure only relevant on master
      //const overL = isMaster ? edges.overmeasure.length : 0;
      //const overW = isMaster ? edges.overmeasure.width : 0;

      Board.bom_CutDimLength1 = finalDims.length + (part.cpa_ProgramGroup.Custom_Group === "TwoMaterials" ? (isMaster ? 0.5 : 3.0) : 0);
      Board.bom_CutDimWidth1 = finalDims.width + (part.cpa_ProgramGroup.Custom_Group === "TwoMaterials" ? (isMaster ? 0.5 : 3.0) : 0);

      Board.bom_CutDimLength2 = 0;
      Board.bom_CutDimWidth2 = 0;

      // ---------------- Edge data (only master) ----------------
      if (isMaster) {
        if (edges.edgeCodes.front != "NoEdgeband") {
          Board.bom_EdgeFront = edges.edgeCodes.front;
        }

        if (edges.edgeCodes.left != "NoEdgeband") {
          Board.bom_EdgeLeft = edges.edgeCodes.left;
        }

        if (edges.edgeCodes.back != "NoEdgeband") {
          Board.bom_EdgeBack = edges.edgeCodes.back;
        }

        if (edges.edgeCodes.right != "NoEdgeband") {
          Board.bom_EdgeRight = edges.edgeCodes.right;
        }

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