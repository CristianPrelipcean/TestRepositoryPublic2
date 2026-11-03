
  try {
    //===================================================
    //          Variables
    //===================================================

    let PanelFront: any;
    let PanelLeft: any;
    let PanelRight: any;
    let SVGPathPanelFront: string = "";
    let SVGPathPanelLeft: string = "";
    let SVGPathPanelRight: string = "";
    const ShapePartFrontDistance = (this.mod_Length - this.mod_Thickness);
    const ShapePartLeftDistance = (this.cmod_EndPanelLegLength - this.mod_Thickness);
    const ShapePartRightDistance = (this.cmod_EndPanelLegLength - this.mod_Thickness);
    const GrainDirection = this.mod_PartGrain == "Lengthwise" || this.mod_PartGrain == "None" ? 0 : 90;

    //===================================================
    //          Board Data
    //===================================================

    const customGroup = this.mod_Program_matrix?.Custom_Group;
    const mappingData = customGroup === "TwoColors" ? GlobalFunc.cfind_2ColorBoardMapping(this.mod_Color, this.mod_BtmColor, this.mod_Thickness) : customGroup === "TwoMaterials" ? GlobalFunc.find_BoardMapping(this.mod_BtmColor, 16) : GlobalFunc.find_BoardMapping(this.mod_Color, this.mod_Thickness);

    //const boardId = mappingData?.BoardId;
    const boardData = GlobalFunc.find_BoardLibrary(mappingData?.BoardId!);
    const boardCategory = GlobalFunc.find_MaterialMapping(boardData[0].Category!)
    const baseMaterialId = boardCategory?.MaterialId;

    // ==================================================
    // Material IDs 
    // ==================================================

    const MainMaterialId = GlobalFunc.find_MaterialMapping(this.mod_Color)?.MaterialId;
    const BottomMaterialId = GlobalFunc.find_MaterialMapping(this.mod_BtmColor)?.MaterialId;
    const EdgeFrontMaterialId = this.mod_EdgeFrontColor == "NoEdge" ? baseMaterialId : GlobalFunc.find_MaterialMapping(this.mod_EdgeFrontColor)?.MaterialId;
    const EdgeBackMaterialId = this.mod_EdgeBackColor == "NoEdge" ? baseMaterialId : GlobalFunc.find_MaterialMapping(this.mod_EdgeBackColor)?.MaterialId;
    const EdgeLeftMaterialId = this.mod_EdgeLeftColor == "NoEdge" ? baseMaterialId : GlobalFunc.find_MaterialMapping(this.mod_EdgeLeftColor)?.MaterialId;
    const EdgeRightMaterialId = this.mod_EdgeRightColor == "NoEdge" ? baseMaterialId : GlobalFunc.find_MaterialMapping(this.mod_EdgeRightColor)?.MaterialId;

    //===================================================
    //          Add the UShape
    //===================================================

    // End panel with 3 parts
    if (this.cmod_EndPanelType == 'UShape') {

    // ==================================================
    // PanelFront
    // ==================================================

    PanelFront = this.addcpart_EndPanelPartFront(0, 0, this.cmod_EndPanelLegLength - this.mod_Thickness, this.mod_Length, this.mod_Width, this.mod_Thickness);
    PanelFront.pa_BomId = "Root";

    SVGPathPanelFront = `M${this.mod_Thickness},0 ${ShapePartFrontDistance},0 ` + `${this.mod_Length},${this.mod_Thickness} ` + `0,${this.mod_Thickness} Z`;

    PanelFront.extrude(`<svg><path d="${SVGPathPanelFront}"></path></svg>`, 'y');

    // ==================================================
    // Surfaces
    // ==================================================

    // Basic surface (Bootom and top edge color)

    PanelFront.addFaceMaterial(EdgeFrontMaterialId, FaceKey.Top);
    PanelFront.addFaceMaterial(EdgeBackMaterialId, FaceKey.Bottom);
    
    // SVG surfaces

    PanelFront.addFaceMaterial(
        BottomMaterialId,
        FaceKey.Side,
        GrainDirection, 0, 0, 1, 1,
        0
    );

    PanelFront.addFaceMaterial(
        "NoEdge",
        FaceKey.Side,
        0, 0, 0, 1, 1,
        1
    );

    PanelFront.addFaceMaterial(
        MainMaterialId,
        FaceKey.Side,
        GrainDirection, 0, 0, 1, 1,
        2
    );

    PanelFront.addFaceMaterial(
        "NoEdge",
        FaceKey.Side,
        0, 0, 0, 1, 1,
        3
    );


    // ==================================================
    // PanelLeft
    // ==================================================

    PanelLeft = this.addcpart_EndPanelPartLeft(0, 0, 0, this.mod_Thickness, this.mod_Width, this.cmod_EndPanelLegLength);
    PanelLeft.pa_BomId = "Root";

    SVGPathPanelLeft =`M 0,0 ` + `0,${this.cmod_EndPanelLegLength} ` + `${this.mod_Thickness},${ShapePartLeftDistance} ` + `${this.mod_Thickness},0 Z`;

    PanelLeft.extrude(`<svg><path d="${SVGPathPanelLeft}"></path></svg>`, 'y');

    // ==================================================
    // Surfaces
    // ==================================================

    // Basic surface (Bootom and top edge color)
    PanelLeft.addFaceMaterial(EdgeFrontMaterialId, FaceKey.Top);
    PanelLeft.addFaceMaterial(EdgeBackMaterialId, FaceKey.Bottom);

    // SVG surfaces

    PanelLeft.addFaceMaterial(
        EdgeLeftMaterialId,
        FaceKey.Side,
        0, 0, 0, 1, 1,
        0
    );

    PanelLeft.addFaceMaterial(
        MainMaterialId,
        FaceKey.Side,
        GrainDirection, 0, 0, 1, 1,
        1
    );

    PanelLeft.addFaceMaterial(
        "NoEdge",
        FaceKey.Side,
        0, 0, 0, 1, 1,
        2
    );

    PanelLeft.addFaceMaterial(
        BottomMaterialId,
        FaceKey.Side,
        GrainDirection, 0, 0, 1, 1,
        3
    );

    // ==================================================
    // PanelRight
    // ==================================================

    PanelRight = this.addcpart_EndPanelPartRight(this.mod_Length - this.mod_Thickness, 0, 0, this.mod_Thickness, this.mod_Width, this.cmod_EndPanelLegLength);
    PanelRight.pa_BomId = "Root";

    SVGPathPanelRight =`M 0,0 ` + `0,${ShapePartRightDistance} ` + `${this.mod_Thickness},${this.cmod_EndPanelLegLength} ` + `${this.mod_Thickness},0 Z`;

    PanelRight.extrude(`<svg><path d="${SVGPathPanelRight}"></path></svg>`, 'y');

    // ==================================================
    // Surfaces
    // ==================================================

    // Basic surface (Bootom and top edge color)
    
    PanelRight.addFaceMaterial(EdgeFrontMaterialId, FaceKey.Top);
    PanelRight.addFaceMaterial(EdgeBackMaterialId, FaceKey.Bottom);

    // SVG surfaces

    PanelRight.addFaceMaterial(
        EdgeRightMaterialId,
        FaceKey.Side,
        0, 0, 0, 1, 1,
        0
    );

    PanelRight.addFaceMaterial(
        BottomMaterialId,
        FaceKey.Side,
        GrainDirection, 0, 0, 1, 1,
        1
    );

    PanelRight.addFaceMaterial(
        "NoEdge",
        FaceKey.Side,
        0, 0, 0, 1, 1,
        2
    );

    PanelRight.addFaceMaterial(
        MainMaterialId,
        FaceKey.Side,
        GrainDirection, 0, 0, 1, 1,
        3
    );
   }

    //===================================================
    //          Add the L-shape (left)
    //===================================================

    // End panel with 3 parts
    if (this.cmod_EndPanelType == 'LShapeLeft') {

        // ==================================================
        // PanelFront
        // ==================================================

        PanelFront = this.addcpart_EndPanelPartFront(0, 0, this.cmod_EndPanelLegLength - this.mod_Thickness, this.mod_Length, this.mod_Width, this.mod_Thickness);
        PanelFront.pa_BomId = "Root";

        SVGPathPanelFront = `M${this.mod_Thickness},0 ${this.mod_Length},0 ${this.mod_Length},${this.mod_Thickness} 0,${this.mod_Thickness} Z`;

        PanelFront.extrude(`<svg><path d="${SVGPathPanelFront}"></path></svg>`, 'y');

        // ==================================================
        // Surfaces
        // ==================================================

        // Basic surface (Bootom and top edge color)

        PanelFront.addFaceMaterial(EdgeFrontMaterialId, FaceKey.Top);
        PanelFront.addFaceMaterial(EdgeBackMaterialId, FaceKey.Bottom);

        // SVG surfaces

        PanelFront.addFaceMaterial(
            BottomMaterialId,
            FaceKey.Side,
            GrainDirection, 0, 0, 1, 1,
            0
        );

        PanelFront.addFaceMaterial(
            EdgeRightMaterialId,
            FaceKey.Side,
            0, 0, 0, 1, 1,
            1
        );

        PanelFront.addFaceMaterial(
            MainMaterialId,
            FaceKey.Side,
            GrainDirection, 0, 0, 1, 1,
            2
        );

        PanelFront.addFaceMaterial(
            "NoEdge",
            FaceKey.Side,
            0, 0, 0, 1, 1,
            3
        );


        // ==================================================
        // PanelLeft
        // ==================================================

        PanelLeft = this.addcpart_EndPanelPartLeft(0, 0, 0, this.mod_Thickness, this.mod_Width, this.cmod_EndPanelLegLength);
        PanelLeft.pa_BomId = "Root";

        SVGPathPanelLeft = `M 0,0 ` + `0,${this.cmod_EndPanelLegLength} ` + `${this.mod_Thickness},${ShapePartLeftDistance} ` + `${this.mod_Thickness},0 Z`;

        PanelLeft.extrude(`<svg><path d="${SVGPathPanelLeft}"></path></svg>`, 'y');

        // ==================================================
        // Surfaces
        // ==================================================

        // Basic surface (Bootom and top edge color)
        PanelLeft.addFaceMaterial(EdgeFrontMaterialId, FaceKey.Top);
        PanelLeft.addFaceMaterial(EdgeBackMaterialId, FaceKey.Bottom);

        // SVG surfaces

        PanelLeft.addFaceMaterial(
            EdgeLeftMaterialId,
            FaceKey.Side,
            0, 0, 0, 1, 1,
            0
        );

        PanelLeft.addFaceMaterial(
            MainMaterialId,
            FaceKey.Side,
            GrainDirection, 0, 0, 1, 1,
            1
        );

        PanelLeft.addFaceMaterial(
            "NoEdge",
            FaceKey.Side,
            0, 0, 0, 1, 1,
            2
        );

        PanelLeft.addFaceMaterial(
            BottomMaterialId,
            FaceKey.Side,
            GrainDirection, 0, 0, 1, 1,
            3
        );
    }
    //===================================================
    //          Add the L-shape (right)
    //===================================================

    // End panel with 3 parts
    if (this.cmod_EndPanelType == 'LShapeRight') {

        // ==================================================
        // PanelFront
        // ==================================================

        PanelFront = this.addcpart_EndPanelPartFront(0, 0, this.cmod_EndPanelLegLength - this.mod_Thickness, this.mod_Length, this.mod_Width, this.mod_Thickness);
        PanelFront.pa_BomId = "Root";

        SVGPathPanelFront = `M0,0 ${ShapePartFrontDistance},0 ${this.mod_Length},${this.mod_Thickness} 0,${this.mod_Thickness} Z`;

        PanelFront.extrude(`<svg><path d="${SVGPathPanelFront}"></path></svg>`, 'y');

        // ==================================================
        // Surfaces
        // ==================================================

        // Basic surface (Bootom and top edge color)

        PanelFront.addFaceMaterial(EdgeFrontMaterialId, FaceKey.Top);
        PanelFront.addFaceMaterial(EdgeBackMaterialId, FaceKey.Bottom);

        // SVG surfaces

        PanelFront.addFaceMaterial(
            BottomMaterialId,
            FaceKey.Side,
            GrainDirection, 0, 0, 1, 1,
            0
        );

        PanelFront.addFaceMaterial(
            "NoEdge",
            FaceKey.Side,
            0, 0, 0, 1, 1,
            1
        );

        PanelFront.addFaceMaterial(
            MainMaterialId,
            FaceKey.Side,
            GrainDirection, 0, 0, 1, 1,
            2
        );

        PanelFront.addFaceMaterial(
            EdgeLeftMaterialId,
            FaceKey.Side,
            0, 0, 0, 1, 1,
            3
        );


        // ==================================================
        // PanelRight
        // ==================================================

        PanelRight = this.addcpart_EndPanelPartRight(this.mod_Length - this.mod_Thickness, 0, 0, this.mod_Thickness, this.mod_Width, this.cmod_EndPanelLegLength);
        PanelRight.pa_BomId = "Root";

        SVGPathPanelRight =`M 0,0 ` + `0,${ShapePartRightDistance} ` + `${this.mod_Thickness},${this.cmod_EndPanelLegLength} ` + `${this.mod_Thickness},0 Z`;

        PanelRight.extrude(`<svg><path d="${SVGPathPanelRight}"></path></svg>`, 'y');

        // ==================================================
        // Surfaces
        // ==================================================

        // Basic surface (Bootom and top edge color)
        
        PanelRight.addFaceMaterial(EdgeFrontMaterialId, FaceKey.Top);
        PanelRight.addFaceMaterial(EdgeBackMaterialId, FaceKey.Bottom);

        // SVG surfaces

        PanelRight.addFaceMaterial(
            EdgeRightMaterialId,
            FaceKey.Side,
            0, 0, 0, 1, 1,
            0
        );

        PanelRight.addFaceMaterial(
            BottomMaterialId,
            FaceKey.Side,
            GrainDirection, 0, 0, 1, 1,
            1
        );

        PanelRight.addFaceMaterial(
            "NoEdge",
            FaceKey.Side,
            0, 0, 0, 1, 1,
            2
        );

        PanelRight.addFaceMaterial(
            MainMaterialId,
            FaceKey.Side,
            GrainDirection, 0, 0, 1, 1,
            3
        );
    }
}
  
catch (error: any) {

        console.error(
            "[EndPanel] createBuildPlan failed",
            {
                EndPanelType: this.cmod_EndPanelType,
                Color: this.mod_Color,
                BtmColor: this.mod_BtmColor,
                Thickness: this.mod_Thickness,
                Length: this.mod_Length,
                Width: this.mod_Width,
                LegLength: this.cmod_EndPanelLegLength,
                Error: error?.message ?? error
            }
        );

        throw error;
    }