process_AddMaterialCarcase(
  Part: any,
  Module: any,
  Category: string,
  Shape: boolean = false,
  SecondColor: boolean = false,
  InsideDirection: string = 'None',
  DrawerShelfColor: string = 'None',
  DrawerShelfGrainId: string = 'NoGrain'
) {

  // Initialize variables, interfaces and types
  //---------------------------------------------------------------------

  type grain = 'Lengthwise' | 'Crosswise' | 'None';

  interface MaterialIds {
    MainMaterialId: string;
    OutsideMaterialId: string;
    EdgeMaterialId: string;
    FrontEdgeMaterialId: string;
  }

  try {

    // sidepanels
    //---------------------------------------------------------------------

    if (Category == 'sidepanel') {

      // Get the material id's
      let {
        MainMaterialId,
        OutsideMaterialId,
        EdgeMaterialId,
        FrontEdgeMaterialId
      } = getMaterialIds(Module.mod_CarcaseColor, Module.mod_CarcaseOutsideColor, Module.mod_CarcaseColor, Module.mod_CarcaseEdgeFrontColor, true);

      // Logic for the edge colors based on CarcaseVisible
      let realEdgeMaterialId = EdgeMaterialId;               // back/general edge
      let realFrontEdgeMaterialId = FrontEdgeMaterialId;     // front edge
      let realTopEdgeMaterialId = EdgeMaterialId;            // top edge
      let realBottomEdgeMaterialId = EdgeMaterialId;         // bottom edge
      let realOutsideMaterialId = MainMaterialId;            // finished outside color

      // Top / bottom visible => use Outside material
      if (Module.mod_CarcaseVisTop) {
        realTopEdgeMaterialId = OutsideMaterialId;
      }
      if (Module.mod_CarcaseVisBtm) {
        realBottomEdgeMaterialId = OutsideMaterialId;
      }

      // Side visibility rules that override all edges
      if (Module.mod_CarcaseVisLeft && InsideDirection == 'right') {
        realEdgeMaterialId = OutsideMaterialId;
        realFrontEdgeMaterialId = OutsideMaterialId;
        realTopEdgeMaterialId = OutsideMaterialId;
        realBottomEdgeMaterialId = OutsideMaterialId;
        realOutsideMaterialId = OutsideMaterialId;
      }
      if (Module.mod_CarcaseVisRight && InsideDirection == 'left') {
        realEdgeMaterialId = OutsideMaterialId;
        realFrontEdgeMaterialId = OutsideMaterialId;
        realTopEdgeMaterialId = OutsideMaterialId;
        realBottomEdgeMaterialId = OutsideMaterialId;
        realOutsideMaterialId = OutsideMaterialId;
      }

      // Define the rotation of the texture
      const GrainDirection: grain = getGrainDirection(Module.mod_TypeElement, Module.mod_CarcaseProgram_matrix.GrainGroupId, Module.mod_CarcaseColor_matrix.GrainGroupId);
      let InsideRotation = 90;
      let OutsideRotation = 90;
      if (GrainDirection == 'Crosswise') {
        InsideRotation = 0;
      }
      if (SecondColor) {
        const GrainDirectionOutside: grain = getGrainDirection(Module.mod_TypeElement, Module.mod_CarcaseOutsideProgram_matrix.GrainGroupId, Module.mod_CarcaseOutsideColor_matrix.GrainGroupId);
        if (GrainDirectionOutside == 'Crosswise') {
          OutsideRotation = 0;
        }
      }
      else {
        OutsideRotation = InsideRotation;
      }

      if (InsideDirection == 'right') {
        if (Shape) {
          const edgeColor = (MainMaterialId === OutsideMaterialId) ? EdgeMaterialId : realFrontEdgeMaterialId;
          addShapeColors(MainMaterialId, realOutsideMaterialId, edgeColor, Category);
        }
        else {
          addAllColors(realOutsideMaterialId, OutsideRotation, MainMaterialId, InsideRotation, realFrontEdgeMaterialId, 90, realEdgeMaterialId, 90, realTopEdgeMaterialId, 90, realBottomEdgeMaterialId, 90)
        }
      }
      else if (InsideDirection == 'left') {
        if (Shape) {
          const edgeColor = (MainMaterialId === realOutsideMaterialId) ? EdgeMaterialId : realFrontEdgeMaterialId;
          addShapeColors(realOutsideMaterialId, MainMaterialId, edgeColor, Category)
        }
        else {
          addAllColors(MainMaterialId, InsideRotation, realOutsideMaterialId, OutsideRotation, realFrontEdgeMaterialId, 90, realEdgeMaterialId, 90, realTopEdgeMaterialId, 90, realBottomEdgeMaterialId, 90)
        }
      }
      else {
        if (Shape) {
          const edgeColor = (MainMaterialId === realOutsideMaterialId) ? EdgeMaterialId : realFrontEdgeMaterialId;
          addShapeColors(MainMaterialId, MainMaterialId, edgeColor, Category)
        }
        else {
          addAllColors(MainMaterialId, InsideRotation, MainMaterialId, InsideRotation, realFrontEdgeMaterialId, 90, realEdgeMaterialId, 90, realEdgeMaterialId, 90, realEdgeMaterialId, 90)
        }
      }
    }

    // shelves
    //---------------------------------------------------------------------

    else if (Category === "shelf" || Category === "shelfadj" || Category === "shelfdrawer" || Category === "shelfNoFrontEdge") {

      // Manage the baseColor for shelves and adjustable shelves (avoid to duplicate this case)
      let baseColor = 'None';
      let edgeFrontColor = 'None';
      let edgeColor = 'None';
      let grainGroupId = 'None';

      switch (Category) {
      case "shelf":
        baseColor = Module.mod_CarcaseColor;
        edgeFrontColor = Module.mod_CarcaseEdgeFrontColor;
        edgeColor = Module.mod_CarcaseColor;
        grainGroupId = Module.mod_CarcaseColor_matrix.GrainGroupId;
        break;

      case "shelfNoFrontEdge":
        baseColor = Module.mod_CarcaseColor;
        edgeFrontColor = Module.mod_CarcaseColor;
        edgeColor = Module.mod_CarcaseColor;
        grainGroupId = Module.mod_CarcaseColor_matrix.GrainGroupId;
        break;

      case "shelfadj":
        baseColor = Module.mod_ShelfadjColor;
        edgeFrontColor = Module.mod_ShelfadjColor;
        edgeColor = Module.mod_ShelfadjColor;
        grainGroupId = Module.mod_CarcaseColor_matrix.GrainGroupId;
        break;

      case "shelfdrawer":
        baseColor = DrawerShelfColor;
        edgeFrontColor = DrawerShelfColor;
        edgeColor = DrawerShelfColor;
        grainGroupId = DrawerShelfGrainId;
        break;

      default:
        logError(`Unknown Category: ${Category}`);
      }
  
      // Get the material id's
      const {
        MainMaterialId,
        OutsideMaterialId,
        EdgeMaterialId,
        FrontEdgeMaterialId
      } = getMaterialIds(baseColor, Module.mod_CarcaseOutsideColor, edgeColor, edgeFrontColor, SecondColor);

      // Define the rotation of the texture
      const GrainDirection: grain = getGrainDirection(Module.mod_TypeElement, Module.mod_CarcaseProgram_matrix.GrainGroupId, grainGroupId);
      let InsideRotation = 0;
      let OutsideRotation = 0;
      if (GrainDirection == 'Crosswise') {
        InsideRotation = 90;
      }
      if (SecondColor) {
        const GrainDirectionOutside: grain = getGrainDirection(Module.mod_TypeElement, Module.mod_CarcaseOutsideProgram_matrix.GrainGroupId, Module.mod_CarcaseOutsideColor_matrix.GrainGroupId);
        if (GrainDirectionOutside == 'Crosswise') {
          OutsideRotation = 90;
        }
      }
      else {
        OutsideRotation = InsideRotation;
      }

      if (Shape) {
        addDefaultColor(MainMaterialId);
      }
      else if (InsideDirection == 'none') {
        addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, EdgeMaterialId, 0, EdgeMaterialId, 0, MainMaterialId, InsideRotation, MainMaterialId, InsideRotation);
      }
      else if (InsideDirection == 'top') {
        addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, FrontEdgeMaterialId, 0, EdgeMaterialId, 0, MainMaterialId, InsideRotation, OutsideMaterialId, OutsideRotation);
      }
      else if (InsideDirection == 'bottom') {
        addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, FrontEdgeMaterialId, 0, EdgeMaterialId, 0, OutsideMaterialId, OutsideRotation, MainMaterialId, InsideRotation);
      }
      else {
        addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, FrontEdgeMaterialId, 0, EdgeMaterialId, 0, MainMaterialId, InsideRotation, MainMaterialId, InsideRotation);
      }
    }

    // rails
    //---------------------------------------------------------------------

    else if (Category == 'rail') {

      // Get the material id's
      const {
        MainMaterialId,
        OutsideMaterialId,
        EdgeMaterialId,
        FrontEdgeMaterialId
      } = getMaterialIds(Module.mod_CarcaseColor);

      // Define the rotation of the texture
      const GrainDirection: grain = getGrainDirection(Module.mod_TypeElement, Module.mod_CarcaseProgram_matrix.GrainGroupId, Module.mod_CarcaseColor_matrix.GrainGroupId);
      let InsideRotation = 0;
      let OutsideRotation = 0;
      if (GrainDirection == 'Crosswise') {
        InsideRotation = 90;
      }
      if (SecondColor) {
        const GrainDirectionOutside: grain = getGrainDirection(Module.mod_TypeElement, Module.mod_CarcaseOutsideProgram_matrix.GrainGroupId, Module.mod_CarcaseOutsideColor_matrix.GrainGroupId);
        if (GrainDirectionOutside == 'Crosswise') {
          OutsideRotation = 90;
        }
      }
      else {
        OutsideRotation = InsideRotation;
      }

      if (Shape) {
        addDefaultColor(MainMaterialId);
      }
      else if (InsideDirection == 'none') {
        addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, MainMaterialId, InsideRotation, MainMaterialId, InsideRotation, EdgeMaterialId, 0, EdgeMaterialId, 0);
      }
      else if (InsideDirection == 'front') {
        addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, MainMaterialId, InsideRotation, OutsideMaterialId, OutsideRotation, EdgeMaterialId, 0, EdgeMaterialId, 0);
      }
      else if (InsideDirection == 'back') {
        addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, OutsideMaterialId, OutsideRotation, MainMaterialId, InsideRotation, EdgeMaterialId, 0, EdgeMaterialId, 0);
      }
      else {
        addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, MainMaterialId, InsideRotation, MainMaterialId, InsideRotation, EdgeMaterialId, 0, EdgeMaterialId, 0);
      }
    }

    // backwalls
    //---------------------------------------------------------------------

    if (Category == 'backwall' || Category == 'backwalldrawer' || Category == 'panelblind') {

      // Manage the baseColor for shelves and adjustable shelves (avoid to duplicate this case)
      let baseColor = 'None';
      let edgeFrontColor = 'None';
      let edgeColor = 'None';
      let grainGroupId = 'None';
      let programGroupId = 'None';

      switch (Category) {
      case "backwall":
        baseColor = Module.mod_CarcaseBackwallColor;
        edgeFrontColor = Module.mod_CarcaseBackwallColor;
        edgeColor = Module.mod_CarcaseBackwallColor;
        grainGroupId = Module.mod_CarcaseBackwallColor_matrix.GrainGroupId;
        programGroupId = Module.mod_CarcaseBackwallProgram_matrix.GrainGroupId;
        break;

      case "backwalldrawer":
        baseColor = DrawerShelfColor;
        edgeFrontColor = DrawerShelfColor;
        edgeColor = DrawerShelfColor;
        grainGroupId = DrawerShelfGrainId;
        programGroupId = Module.mod_CarcaseProgram_matrix.GrainGroupId;
        break;

	    case "panelblind":
        baseColor = Module.mod_CarcaseColor;
        edgeFrontColor = Module.mod_CarcaseColor;
        edgeColor = Module.mod_CarcaseColor;
        grainGroupId = Module.mod_CarcaseColor_matrix.GrainGroupId;
        programGroupId = Module.mod_CarcaseProgram_matrix.GrainGroupId;
        break;

      default:
        logError(`Unknown Category: ${Category}`);
      }

      // Get the material id's
      const {
        MainMaterialId,
        OutsideMaterialId,
        EdgeMaterialId,
        FrontEdgeMaterialId
      } = getMaterialIds(baseColor, Module.mod_CarcaseOutsideColor, edgeColor, edgeFrontColor, SecondColor);

      // Define the rotation of the texture
      const GrainDirection: grain = getGrainDirection(Module.mod_TypeElement, programGroupId, grainGroupId);
      let InsideRotation = 90;
      let OutsideRotation = 90;
      if (GrainDirection == 'Crosswise') {
        InsideRotation = 0;
      }
      if (SecondColor) {
        const GrainDirectionOutside: grain = getGrainDirection(Module.mod_TypeElement, Module.mod_CarcaseOutsideProgram_matrix.GrainGroupId, Module.mod_CarcaseOutsideColor_matrix.GrainGroupId);
        if (GrainDirectionOutside == 'Crosswise') {
          OutsideRotation = 0;
        }
      }
      else {
        OutsideRotation = InsideRotation;
      }

      if (Shape) {
        addDefaultColor(MainMaterialId);
      }
      else {
        addAllColors(MainMaterialId, 0, MainMaterialId, 0, MainMaterialId, InsideRotation, OutsideMaterialId, OutsideRotation, MainMaterialId, 90, OutsideMaterialId, 90)
      }
    }
  }

  // Error handling
  //---------------------------------------------------------------------
  catch (error: any) {
    logError("Can not create the materials and show it for part: " + Category);
  }

  //=====================================================================
  // Functions to add the materials
  //=====================================================================

  // We got all the colors on each side
  //---------------------------------------------------------------------

  function addAllColors(left: string, rotLeft: number, right: string, rotRight: number, front: string, rotFront: number, back: string, rotBack: number, top: string, rotTop: number, bottom: string, rotBot: number) {
    Part.addFaceMaterial(left, FaceKey.Left, rotLeft, 0, 0, 1, 1);
    Part.addFaceMaterial(right, FaceKey.Right, rotRight, 0, 0, 1, 1);
    Part.addFaceMaterial(front, FaceKey.Front, rotFront, 0, 0, 1, 1);
    Part.addFaceMaterial(back, FaceKey.Back, rotBack, 0, 0, 1, 1);
    Part.addFaceMaterial(top, FaceKey.Top, rotTop, 0, 0, 1, 1);
    Part.addFaceMaterial(bottom, FaceKey.Bottom, rotBot, 0, 0, 1, 1);
  }

  // Add material to shape parts
  //---------------------------------------------------------------------

  function addShapeColors(color1: string, color2: string, side: string, category: string) {
    if (category == 'sidepanel') {
      Part.addFaceMaterial(color1, FaceKey.Top, 90, 0, 0, 1, 1);
      Part.addFaceMaterial(color2, FaceKey.Bottom, 90, 0, 0, 1, 1);
      Part.addFaceMaterial(side, FaceKey.Side, 0, 0, 0, 1, 1);
    }
    else if (category == 'fingergrip') {
      Part.addFaceMaterial(color1, FaceKey.Top, 0, 0, 0, 1, 1);
      Part.addFaceMaterial(color2, FaceKey.Bottom, 0, 0, 0, 1, 1);
      Part.addFaceMaterial(side, FaceKey.Side, 90, 0, 0, 1, 1);
    }
    else if (category == 'frameFrontVert') {
      Part.addFaceMaterial(color1, FaceKey.Top, 90, 0, 0, 1, 1);
      Part.addFaceMaterial(color2, FaceKey.Bottom, 90, 0, 0, 1, 1);
      Part.addFaceMaterial(side, FaceKey.Side, 0, 0, 0, 1, 1);
    }
    else if (category == 'frameFrontHor') {
      Part.addFaceMaterial(side, FaceKey.Top, 0, 0, 0, 1, 1);
      Part.addFaceMaterial(side, FaceKey.Bottom, 0, 0, 0, 1, 1);
      Part.addFaceMaterial(side, FaceKey.Side, 0, 0, 0, 1, 1);
    }
  }

  // Add material default only one color
  //---------------------------------------------------------------------

  function addDefaultColor(color: string) {
    Part.addFaceMaterial(color, FaceKey.Default, 0, 0, 0, 1, 1)
  }

  //=====================================================================
  // Get the grain direction
  //=====================================================================

  // Get the grain direction
  function getGrainDirection(typeElement: string, programGrainGroup: string, colorGrainGroup: string): grain {

    // Get the BomArticleGroup
    const PartSettings = GlobalFunc.find_PartSettings(Part._partId, Part.pa_AdditionalInfo1, false);
    const bomArticleGroup = PartSettings?.BomArticleGroup ?? 'None';

    // BomArticleGroup which is using the table GrainDirectionSettings
    const validGroups = ['Carcase', 'Toekick', 'Countertop'];

    // Get the grain direction candidate
    let GrainDirectionCandidate = 'None';
    if (validGroups.includes(bomArticleGroup)) {
      const GrainDirectionSettings = GlobalFunc.find_GrainDirectionSettings(Part._partId, typeElement, programGrainGroup, colorGrainGroup, Part._width, Part._depth);
      GrainDirectionCandidate = Module.mod_GrainLogic === 'Library' && GrainDirectionSettings.GrainDirection ? GrainDirectionSettings.GrainDirection : 'None';
    }
    else if (bomArticleGroup == 'Fitting') {
      GrainDirectionCandidate = 'None';
    }
    else {
      GrainDirectionCandidate = 'None';
    }

    // Check, we must have a valid grain direction
    if (isValidGrain(GrainDirectionCandidate)) {
      return GrainDirectionCandidate;
    }
    else {
      logError(`Invalid grain direction "${GrainDirectionCandidate}" found for part ${Part._partId}`);
      return 'None';
    }
  }

  // Check if grain direction is valid
  function isValidGrain(value: any): value is grain {
    return ['Lengthwise', 'Crosswise', 'None'].includes(value);
  }

  //=====================================================================
  // Get the material id's
  //=====================================================================

  function getMaterialIds(mainColor: string, outsideColor: string = 'None', mainEdgeColor: string = 'None', frontEdgeColor: string = 'None', secondColor: boolean = false): MaterialIds {

	  const colorIdParent = ct_tab_PartSettings.find(p => p.in_Part == Part._partId)?.ColorIdParent ?? 'All';
    const MainMaterialId = GlobalFunc.find_MaterialMapping(mainColor, colorIdParent)?.MaterialId ?? 'None';

    const EdgeMaterialId = mainEdgeColor !== 'None'
      ? GlobalFunc.find_MaterialMapping(mainEdgeColor, colorIdParent)?.MaterialId ?? 'None'
      : MainMaterialId;

    const FrontEdgeMaterialId = frontEdgeColor !== 'None'
      ? GlobalFunc.find_MaterialMapping(frontEdgeColor, colorIdParent)?.MaterialId ?? 'None'
      : MainMaterialId;

    const OutsideMaterialId = secondColor
      ? GlobalFunc.find_MaterialMapping(outsideColor, colorIdParent)?.MaterialId ?? 'None'
      : MainMaterialId;

    return {
      MainMaterialId,
      OutsideMaterialId,
      EdgeMaterialId,
      FrontEdgeMaterialId
    };
  }


}