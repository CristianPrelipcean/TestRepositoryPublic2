process_BoardBom(Elem: any, Part: any, ElementType: string, ElementCategory: string, ParentId: string) {

    try {

        //========================================================
        // Guards
        //========================================================
        if (!Elem || !Part) {
            return;
        }

        if (!Part._id || !Part._partId) {
            return;
        }

        //========================================================
        // Constants / manual defaults
        //========================================================
        const route = 'ProductionRoute';
        const extraInfo1 = 'ExtraInfo1';
        const extraInfo2 = 'ExtraInfo2';
        const extraInfo3 = 'ExtraInfo3';

        //========================================================
        // Helper
        //========================================================
        const round2 = (value: number): number => Math.round(value * 100) / 100;

        //========================================================
        // Part settings
        //========================================================
        const partSettings = GlobalFunc.find_PartSettings(Part._partId, Part.pa_AdditionalInfo1);
        const bomName = partSettings?.BomPartDescription ?? Part._partId;
        const bomArticleGroup = partSettings?.BomArticleGroup ?? 'None';

        //========================================================
        // Grain direction
        //========================================================
        let grainDirection = 'None';
        const grainRelevantGroups = ['Carcase', 'Toekick', 'Countertop', 'AdditionalParts'];

        if (grainRelevantGroups.includes(bomArticleGroup)) {
            const grainDirectionSettings = GlobalFunc.find_GrainDirectionSettings(
                Part._partId,
                Part.pa_TypeElement,
                Part.pa_ProgramGrainGroup,
                Part.pa_ColorGrainGroup,
                Part._width,
                Part._depth
            );

            grainDirection = grainDirectionSettings?.GrainDirection ?? 'None';
        } else {
            grainDirection = Part.pa_GrainDirection ?? 'None';
        }

        //========================================================
        // Board data
        //========================================================
        const boardMapping = GlobalFunc.find_BoardMapping(Part.pa_TopColor, Part._thickness);
        if (!boardMapping?.BoardId) {
            return;
        }

        const board = GlobalFunc.find_BoardLibrary(boardMapping.BoardId);
        const material = board?.MaterialCode ?? '';
        const boardType = board?.BoardType ?? '';
        const boardGrain = board?.Grain ?? 'N';


        //========================================================
        // Validate grain direction
        //========================================================
        const boardHasDirectionalGrain = ['L', 'C'].includes(boardGrain);
        const grainDirectionIsValid = ['Lengthwise', 'Crosswise'].includes(grainDirection);

        if (boardHasDirectionalGrain && !grainDirectionIsValid) {
            const errorList = GlobalFunc.find_ErrorList('Error 40007', 1);
            let messageText = errorList.Message('');

            const values = {
                part: Part._partId,
                grainColor: Part.pa_ColorGrainGroup,
                grainProgram: Part.pa_ProgramGrainGroup
            };

            messageText = messageText.replace(/@(\w+)/g, (_, key) => {
                return values[key as keyof typeof values] ?? '';
            });

            logError(messageText);
            return;
        }

        //========================================================
        // Edge data
        //========================================================
        const edgeData = GlobalFunc.process_EdgeInfo(
            Part._partId,
            Part._thickness,
            Part.pa_EdgeFrontColor,
            Part.pa_EdgeLeftColor,
            Part.pa_EdgeBackColor,
            Part.pa_EdgeRightColor,
            Part.pa_EdgeFrontType,
            Part.pa_EdgeLeftType,
            Part.pa_EdgeBackType,
            Part.pa_EdgeRightType,
            Part.pa_EdgeJointType,
            Part.pa_AdditionalInfo1
        );

        if (!edgeData) {
            return;
        }

        const edgeFrontThk = edgeData.EdgeFrontData?.Thickness ?? 0;
        const edgeLeftThk = edgeData.EdgeLeftData?.Thickness ?? 0;
        const edgeBackThk = edgeData.EdgeBackData?.Thickness ?? 0;
        const edgeRightThk = edgeData.EdgeRightData?.Thickness ?? 0;

        //========================================================
        // Create output
        //========================================================
        const Board = Elem.addbomout_Board();

        // Part data
        Board.bom_Type = Part._partId;
        Board.bom_Name = bomName;
        Board.bom_ArticleGroup = bomArticleGroup;
        Board.bom_PartId = Part._id;
        Board.bom_ElementCategory = ElementCategory;
        Board.bom_ElementId = Part._id;
        Board.bom_ParentId = ParentId;
        Board.bom_ElementType = ElementType;

        // Dimensions
        Board.bom_Length = round2(Part._width ?? 0);
        Board.bom_Width = round2(Part._depth ?? 0);
        Board.bom_Finalthk = round2(Part._thickness ?? 0);
        Board.bom_CutDimLength1 = round2(
            (Part._width ?? 0)
            - edgeLeftThk
            + (edgeData.OverdimensionLeft ?? 0)
            - edgeRightThk
            + (edgeData.OverdimensionRight ?? 0)
        );
        Board.bom_CutDimWidth1 = round2(
            (Part._depth ?? 0)
            - edgeFrontThk
            + (edgeData.OverdimensionFront ?? 0)
            - edgeBackThk
            + (edgeData.OverdimensionBack ?? 0)
        );

        // Material data
        Board.bom_Material = material;
        Board.bom_BoardType = boardType;
        Board.bom_GrainOrientation = grainDirection;
        Board.bom_Weight = round2(Part.pa_Weight ?? 0);

        // Edge data
        Board.bom_EdgeFront = edgeData.EdgeFrontCode ?? '';
        Board.bom_EdgeLeft = edgeData.EdgeLeftCode ?? '';
        Board.bom_EdgeBack = edgeData.EdgeBackCode ?? '';
        Board.bom_EdgeRight = edgeData.EdgeRightCode ?? '';
        Board.bom_EdgeJointFrontLeft = edgeData.EdgeJointFrontLeft ?? '';
        Board.bom_EdgeJointLeftBack = edgeData.EdgeJointLeftBack ?? '';
        Board.bom_EdgeJointBackRight = edgeData.EdgeJointBackRight ?? '';
        Board.bom_EdgeJointRightFront = edgeData.EdgeJointRightFront ?? '';
        Board.bom_EdgeTransition = edgeData.EdgeTransition ?? '';
        Board.bom_EdgeShape = edgeData.EdgeShape ?? '';
        Board.bom_Program = Part.pa_Program ?? '';

        // Additional data
        Board.bom_ExtraInfo1 = extraInfo1;
        Board.bom_ExtraInfo2 = extraInfo2;
        Board.bom_ExtraInfo3 = extraInfo3;
        Board.bom_Route = route;
    }
    catch (error: any) {
        const errorMessage = GlobalFunc.find_ErrorList('Error 40003', 1);
        logError(errorMessage.Message(error.message));
    }
}