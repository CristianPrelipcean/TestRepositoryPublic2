process_BoardBom(Elem: any, Part: any, ElementType: string, ElementCategory: string, ParentId: string) {

    try {

        //====================================================================
        // MANUAL STUFF (TO BE DEVELOPED)
        //====================================================================

        const route = 'ProductionRoute';
        const extraInfo1 = 'ExtraInfo1';
        const extraInfo2 = 'ExtraInfo2';
        const extraInfo3 = 'ExtraInfo3';

        //====================================================================
        // Get data from tables
        //====================================================================

        // Get part data
        const PartSettings = GlobalFunc.find_PartSettings(Part._partId, Part.pa_AdditionalInfo1);
        const bomName = PartSettings ? PartSettings.BomPartDescription : Part._partId;
        const bomArticleGroup = PartSettings?.BomArticleGroup ?? 'None';
        
        // Get grain direction
        let GrainDirection = 'None';
        const validGroups = ['Carcase', 'Toekick', 'Countertop','AdditionalParts'];  // , 'AdditionalParts'

        if (validGroups.includes(bomArticleGroup)) {
            const GrainDirectionSettings = GlobalFunc.find_GrainDirectionSettings(Part._partId, Part.pa_TypeElement, Part.pa_ProgramGrainGroup, Part.pa_ColorGrainGroup, Part._width, Part._depth);
            GrainDirection = GrainDirectionSettings?.GrainDirection ?? 'None';
        }
        else {
            GrainDirection = Part.pa_GrainDirection;
        }

        // Get board data
        const BoardMappingTop = GlobalFunc.find_BoardMapping(Part.pa_TopColor, Part._thickness)!;
        const board = GlobalFunc.find_BoardLibrary(BoardMappingTop.BoardId!);
        const material = board?.MaterialCode ?? '';
        const boardType = board?.BoardType ?? '';
        const boardGrain = board?.Grain ?? 'N';

        // Check grain direction valid for board grain
        const isBoardGrainLC = ['L', 'C'].includes(boardGrain);
        const isGrainDirValid = ['Lengthwise', 'Crosswise'].includes(GrainDirection);

        if (isBoardGrainLC && !isGrainDirValid) {
            const errorList = GlobalFunc.find_ErrorList('Error 40007', 1);
            let messageText = errorList.Message("");

            // Define the place holders
            const values = {
                part: Part._partId,
                grainColor: Part.pa_ColorGrainGroup,
                grainProgram: Part.pa_ProgramGrainGroup
            };

            // Replace the place holders in the text
            messageText = messageText.replace(/@(\w+)/g, (_, key) => {
                return values[key as keyof typeof values] ?? '';
            });

            // Throw the error
            logError(messageText);
        }

        // Get edge data
        const EdgeData = GlobalFunc.process_EdgeInfo(Part._partId, Part._thickness, Part.pa_EdgeFrontColor, Part.pa_EdgeLeftColor, Part.pa_EdgeBackColor, Part.pa_EdgeRightColor, Part.pa_EdgeFrontType, Part.pa_EdgeLeftType, Part.pa_EdgeBackType, Part.pa_EdgeRightType, Part.pa_EdgeJointType, Part.pa_AdditionalInfo1)!;
        const EdgeFrontThk = EdgeData.EdgeFrontData ? EdgeData.EdgeFrontData.Thickness || 0 : 0;
        const EdgeLeftThk = EdgeData.EdgeLeftData ? EdgeData.EdgeLeftData.Thickness || 0 : 0;
        const EdgeBackThk = EdgeData.EdgeBackData ? EdgeData.EdgeBackData.Thickness || 0 : 0;
        const EdgeRightThk = EdgeData.EdgeRightData ? EdgeData.EdgeRightData.Thickness || 0 : 0;

        //====================================================================
        // Define Output
        //====================================================================

        // Helper function for rounding
        function round2(value: number): number {
            return Math.round(value * 100) / 100;
        }

        // Part data
        Elem.bom_Type = Part._partId;
        Elem.bom_Name = bomName;
        Elem.bom_ArticleGroup = bomArticleGroup;
        Elem.bom_PartId = Part._id;
        Elem.bom_ElementCategory = ElementCategory;
        Elem.bom_ElementId = Part._id;
        Elem.bom_ParentId = ParentId;
        Elem.bom_ElementType = ElementType;

        // Dimensions
        Elem.bom_Length = round2(Part._width);
        Elem.bom_Width = round2(Part._depth);
        Elem.bom_Finalthk = round2(Part._thickness);
        Elem.bom_CutDimLength1 = round2(Part._width - EdgeLeftThk + EdgeData.OverdimensionLeft - EdgeRightThk + EdgeData.OverdimensionRight);
        Elem.bom_CutDimWidth1 = round2(Part._depth - EdgeFrontThk + EdgeData.OverdimensionFront - EdgeBackThk + EdgeData.OverdimensionBack);

        // No need for the cutting dimension 2 at the moment
        // Elem.bom_CutDimLength2 = round2(Part._width - EdgeLeftThk - EdgeRightThk);
        // Elem.bom_CutDimWidth2  = round2(Part._depth - EdgeFrontThk - EdgeBackThk);

        // Material data
        Elem.bom_Material = material;
        Elem.bom_BoardType = boardType;
        Elem.bom_GrainOrientation = Part.pa_GrainDirection;
        Elem.bom_GrainOrientation = GrainDirection;
        Elem.bom_Weight = round2(Part.pa_Weight ?? 0);

        // Edge data
        Elem.bom_EdgeFront = EdgeData.EdgeFrontCode;
        Elem.bom_EdgeLeft = EdgeData.EdgeLeftCode;
        Elem.bom_EdgeBack = EdgeData.EdgeBackCode;
        Elem.bom_EdgeRight = EdgeData.EdgeRightCode;
        Elem.bom_EdgeJointFrontLeft = EdgeData.EdgeJointFrontLeft;
        Elem.bom_EdgeJointLeftBack = EdgeData.EdgeJointLeftBack;
        Elem.bom_EdgeJointBackRight = EdgeData.EdgeJointBackRight;
        Elem.bom_EdgeJointRightFront = EdgeData.EdgeJointRightFront;
        Elem.bom_EdgeTransition = EdgeData.EdgeTransition;
        Elem.bom_EdgeShape = EdgeData.EdgeShape;
        Elem.bom_Program = Part.pa_Program ?? "";

        // Additional data
        Elem.bom_ExtraInfo1 = extraInfo1;
        Elem.bom_ExtraInfo2 = extraInfo2;
        Elem.bom_ExtraInfo3 = extraInfo3;
        Elem.bom_Route = route;
    }

    //====================================================================
    // Handle the errors
    //====================================================================

    catch (error: any) {
        let ErrorMessage = GlobalFunc.find_ErrorList('Error 40003', 1);
        logError(ErrorMessage.Message(error.message));
    }
}