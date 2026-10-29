process_PanelWoodFrameBom(Elem: any, part: any, parentId: string){

  try {

    //====================================================================
    // Main Section
    //====================================================================

    //---------------Get data from tabble BoardMapping-----------------
    const BoardMappingTop = GlobalFunc.find_BoardMapping(part.pa_TopColor!, part._dimz)!;
    const BoardMappingBtm = GlobalFunc.find_BoardMapping(part.pa_BtmColor!, part._dimz)!;

    //---------------Get data from table BoardLibrary-----------------
    const BoardLibraryTop = GlobalFunc.find_BoardLibrary(BoardMappingTop.BoardId!)!;
    const BoardLibraryBtm = GlobalFunc.find_BoardLibrary(BoardMappingBtm.BoardId!)!;
    let BoardLibraryFilling: any;

    if (part.pa_FrameFillingMaterial != 'Glass') {
      const BoardMappingFilling = GlobalFunc.find_BoardMapping(part.pa_FrameFillingColor, part.pa_FrameFillingThk)!;
      BoardLibraryFilling = GlobalFunc.find_BoardLibrary(BoardMappingFilling.BoardId!)!;
    }

    //---------------Get data from table GrainDirection-----------------
    const grainInfo = JSON.parse(part.pa_GrainDirection);
    const GrainVert = grainInfo.frameVertGrain;
    const GrainHor = grainInfo.frameHorGrain;
    const GrainFilling = grainInfo.frameFillingGrain;

    //---------------Parts length calculation------------------------
    let lenHgt = part._dimy;
    let lenWdt = part._dimx;

    if (part.pa_PanelWoodFrameType == "HeightCoveredWidth") {
      lenWdt = part._dimx - (2 * part.pa_FramePartsWidthVert);
    }
    else if (part.pa_PanelWoodFrameType == "WidthCoveredHeight") {
      lenHgt = part._dimy - (2 * part.pa_FramePartsWidthHor);
    }

    //---------------vertical Parts----------------------------------
    addBomBoard(
      "part_PanelWoodFrameLeft",
      lenHgt,
      2 * part.pa_FramePartsWidthVert + part.g.basic_DoubleCutDimension,
      part._dimz,
      part.pa_PanelWoodFrameType,
      part.pa_FramePartsWidthVert,
      BoardLibraryTop,
      GrainVert
    );

    //---------------horizontal Parts--------------------------------
    addBomBoard(
      "part_PanelWoodFrameTop",
      lenWdt,
      2 * part.pa_FramePartsWidthHor + part.g.basic_DoubleCutDimension,
      part._dimz,
      part.pa_PanelWoodFrameType,
      part.pa_FramePartsWidthVert,
      BoardLibraryTop,
      GrainHor
    );

    //---------------Filling-----------------------------------------
    if (part.pa_FrameFillingMaterial != 'Glass') {
      addBomBoard(
        "part_PanelWoodFrameFilling",
        part._dimy - 2 * part.pa_FramePartsWidthHor + 2 * (part.g.basic_FramePanelGrooveDepth - part.g.basic_FillingGrooveGap),
        part._dimx - 2 * part.pa_FramePartsWidthVert + 2 * (part.g.basic_FramePanelGrooveDepth - part.g.basic_FillingGrooveGap),
        part._dimz,
        part.pa_PanelWoodFrameType,
        part.pa_FramePartsWidthVert,
        BoardLibraryFilling,
        GrainFilling
      );
    }

    else {
      addHardware("part_PanelWoodFrameFilling");
    }

    //====================================================================
    // Function to insert the panels
    //====================================================================

    function addBomBoard(partName: string, dimX: number, dimY: number, thk: number, frameType: string, frameWidth: string, BoardLibrary: any, Grain: string) {

      const FramePartsVert = Elem.addbomout_Board();

      //---------------Get data from table PartSettings-----------------
      const PartSettings = GlobalFunc.find_PartSettings(partName, part.pa_AdditionalInfo1);

      //---------------Get data from table EdgeFrameSettingsSettings-----------------
      const EdgeFrameSettings = GlobalFunc.find_EdgeFrameSettings(PartSettings.PartGroup!, part.pa_Program, part.pa_TopColor, 'All');

      //---------------Get data from Edges-----------------
      const EdgeData = GlobalFunc.process_EdgeInfo(part._partId, part._dimz, part.pa_EdgeFrontColor, part.pa_EdgeFrontColor, part.pa_EdgeFrontColor, part.pa_EdgeFrontColor, EdgeFrameSettings.EdgeFrontType!, EdgeFrameSettings.EdgeLeftType!,
        EdgeFrameSettings.EdgeBackType!, EdgeFrameSettings.EdgeRightType!, EdgeFrameSettings.EdgeJointType!, part.pa_AdditionalInfo1)!;

      // Get EdgeThickness
      const EdgeFrontThk = EdgeData.EdgeFrontData ? EdgeData.EdgeFrontData.Thickness || 0 : 0;
      const EdgeBackThk = EdgeData.EdgeBackData ? EdgeData.EdgeBackData.Thickness || 0 : 0;
      const EdgeLeftThk = EdgeData.EdgeLeftData ? EdgeData.EdgeLeftData.Thickness || 0 : 0;
      const EdgeRightThk = EdgeData.EdgeRightData ? EdgeData.EdgeRightData.Thickness || 0 : 0;

      FramePartsVert.bom_Type = part._partId;
      FramePartsVert.bom_Name = PartSettings.BomPartDescription;
      FramePartsVert.bom_Material = BoardLibrary.MaterialCode!;
      FramePartsVert.bom_PartId = part._id;
      FramePartsVert.bom_ArticleGroup = PartSettings.BomArticleGroup;
      FramePartsVert.bom_Route = "FrameConstruction";
      FramePartsVert.bom_ElementCategory = "";
      FramePartsVert.bom_ElementType = "Board";

      FramePartsVert.bom_Length = dimX;
      FramePartsVert.bom_Width = dimY;
      FramePartsVert.bom_Finalthk = thk;
      FramePartsVert.bom_GrainOrientation = Grain;
      FramePartsVert.bom_CutDimLength1 = dimX - EdgeLeftThk + EdgeData.OverdimensionFront - EdgeRightThk + EdgeData.OverdimensionBack;;
      FramePartsVert.bom_CutDimWidth1 = dimY - EdgeFrontThk + EdgeData.OverdimensionFront - EdgeBackThk + EdgeData.OverdimensionBack;;
      FramePartsVert.bom_CutDimLength2 = 0;
      FramePartsVert.bom_CutDimWidth2 = 0;

      FramePartsVert.bom_EdgeFront = EdgeData.EdgeFrontCode;
      FramePartsVert.bom_EdgeLeft = EdgeData.EdgeLeftCode;
      FramePartsVert.bom_EdgeBack = EdgeData.EdgeBackCode;
      FramePartsVert.bom_EdgeRight = EdgeData.EdgeRightCode;
      FramePartsVert.bom_EdgeJointFrontLeft = EdgeData.EdgeJointFrontLeft;
      FramePartsVert.bom_EdgeJointLeftBack = EdgeData.EdgeJointLeftBack;
      FramePartsVert.bom_EdgeJointBackRight = EdgeData.EdgeJointBackRight;
      FramePartsVert.bom_EdgeJointRightFront = EdgeData.EdgeJointRightFront;
      FramePartsVert.bom_EdgeShape = EdgeData.EdgeShape;
      FramePartsVert.bom_EdgeTransition = EdgeData.EdgeTransition;

      FramePartsVert.bom_BoardType = BoardLibrary.BoardType!;
      FramePartsVert.bom_ExtraInfo1 = "FrameType: " + '  ' + frameType;
      FramePartsVert.bom_ExtraInfo2 = "FrameWidth: " + '  ' + frameWidth;
      FramePartsVert.bom_ExtraInfo3
      FramePartsVert.bom_ElementId = part._id;
      FramePartsVert.bom_ParentId = parentId;
    }

    //====================================================================
    // Function to insert hardware (Glasselements)
    //====================================================================

    function addHardware(partName: string) {

      //---------------Get data from table PartSettings-----------------
      let PartSettings = GlobalFunc.find_PartSettings(partName, part.pa_AdditionalInfo1);

      let FrameFilling = Elem.addbomout_Hardware();

      FrameFilling.bom_Type = part._partId;
      FrameFilling.bom_Name = PartSettings.BomPartDescription;
      FrameFilling.bom_PartId = part._id;
      //FrameFilling.bom_Route = "FrameConstruction";
      FrameFilling.bom_ElementCategory = "";
      FrameFilling.bom_ElementType = "Hardware";

      FrameFilling.bom_Length = part._dimx - 2 * part.pa_FramePartsWidthVert + 2 * (part.g.basic_FramePanelGrooveDepth - part.g.basic_FillingGrooveGap);
      FrameFilling.bom_Width = part._dimy - 2 * part.pa_FramePartsWidthHor + 2 * (part.g.basic_FramePanelGrooveDepth - part.g.basic_FillingGrooveGap);
      FrameFilling.bom_Thk = part.pa_FrameFillingThk;
      FrameFilling.bom_Description1 = part.pa_FrameFillingMaterial;
      FrameFilling.bom_Description2 = part.pa_FrameFillingColor;

      FrameFilling.bom_ExtraInfo1
      FrameFilling.bom_ExtraInfo2
      FrameFilling.bom_ExtraInfo3
      FrameFilling.bom_ElementId = part._id;
      FrameFilling.bom_ParentId = parentId;
    }
  }

  //====================================================================
  // Handle the errors
  //====================================================================

  catch (error: any) {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 40003', 1);
    logError(ErrorMessage.Message(error.message));
  }
}