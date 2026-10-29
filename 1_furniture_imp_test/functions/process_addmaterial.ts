process_AddMaterial(
  part: any,
  category: string = 'None',
  mainColor: string = 'None',
  outsideColor: string = 'None',
  mainEdgeColor: string = 'None',
  frontEdgeColor: string = 'None',
  insideDirection: string = 'None',
  secondColor: boolean = false,
  shape: boolean = false,
  typeElement: string = 'All',
  programGrainGroup: string = 'Neutral',
  colorGrainGroup: string = 'NoGrain'
) {

  // Type definition
  type grain = 'Lengthwise' | 'Crosswise' | 'None';

  try {
    // Get the material ID
    //---------------------------------------------------------------------

	const colorIdParent = ct_tab_PartSettings.find(p => p.in_Part == part._partId)?.ColorIdParent ?? 'All';
    const MainMaterialId = GlobalFunc.find_MaterialMapping(mainColor, colorIdParent)?.MaterialId ?? 'None';
    let OutsideMaterialId = MainMaterialId;
    let EdgeMaterialId = MainMaterialId;
    let FrontEdgeMaterialId = MainMaterialId;

    if (mainEdgeColor != 'None') {
      EdgeMaterialId = GlobalFunc.find_MaterialMapping(mainEdgeColor, colorIdParent)?.MaterialId ?? 'None';
    }
    if (frontEdgeColor != 'None') {
      FrontEdgeMaterialId = GlobalFunc.find_MaterialMapping(frontEdgeColor, colorIdParent)?.MaterialId ?? 'None';
    }
    if (secondColor) {
      OutsideMaterialId = GlobalFunc.find_MaterialMapping(outsideColor, colorIdParent)?.MaterialId ?? 'None';
    }

    // Get the grain direction
    //---------------------------------------------------------------------
       
    const GrainDirection: grain = getGrainDirection(part, typeElement, programGrainGroup, colorGrainGroup);

    // sidepanels
    //---------------------------------------------------------------------

    if (category == 'sidepanel') {

      // Define the rotation of the texture
      let insideRotation = 90;
      if (GrainDirection == 'Crosswise') {
        insideRotation = 0;
      }

      if (insideDirection == 'right') {
        if (shape) {
          const edgeColor = (MainMaterialId === OutsideMaterialId) ? EdgeMaterialId : FrontEdgeMaterialId;
          addShapeColors(MainMaterialId, OutsideMaterialId, edgeColor, category);
        }
        else {
          addAllColors(OutsideMaterialId, 90, MainMaterialId, insideRotation, FrontEdgeMaterialId, 90, EdgeMaterialId, 90, EdgeMaterialId, 90, EdgeMaterialId, 90)
        }
      }
      else if (insideDirection == 'left') {
        if (shape) {
          const edgeColor = (MainMaterialId === OutsideMaterialId) ? EdgeMaterialId : FrontEdgeMaterialId;
          addShapeColors(OutsideMaterialId, MainMaterialId, edgeColor, category)
        }
        else {
          addAllColors(MainMaterialId, insideRotation, OutsideMaterialId, 90, FrontEdgeMaterialId, 90, EdgeMaterialId, 90, EdgeMaterialId, 90, EdgeMaterialId, 90)
        }
      }
      else {
        if (shape) {
          const edgeColor = (MainMaterialId === OutsideMaterialId) ? EdgeMaterialId : FrontEdgeMaterialId;
          addShapeColors(MainMaterialId, MainMaterialId, edgeColor, category)
        }
        else {
          addAllColors(MainMaterialId, 90, MainMaterialId, 90, FrontEdgeMaterialId, 90, EdgeMaterialId, 90, EdgeMaterialId, 90, EdgeMaterialId, 90)
        }
      }
    }

    // shelves
    //---------------------------------------------------------------------

    else if (category == 'shelf') {
      if (shape) {
        addDefaultColor(MainMaterialId);
      }
      else if (insideDirection == 'none') {
        addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, EdgeMaterialId, 0, EdgeMaterialId, 0, MainMaterialId, 0, MainMaterialId, 0);
      }
      else if (insideDirection == 'top') {
        addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, FrontEdgeMaterialId, 0, EdgeMaterialId, 0, MainMaterialId, 0, OutsideMaterialId, 0)
      }
      else if (insideDirection == 'bottom') {
        addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, FrontEdgeMaterialId, 0, EdgeMaterialId, 0, OutsideMaterialId, 0, MainMaterialId, 0)
      }
      else {
        addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, FrontEdgeMaterialId, 0, EdgeMaterialId, 0, MainMaterialId, 0, MainMaterialId, 0)
      }
    }

    // backwalls
    //---------------------------------------------------------------------

    if (category == 'backwall') {
      if (shape) {
        addDefaultColor(MainMaterialId);
      }
      else {
        addAllColors(EdgeMaterialId, 0, EdgeMaterialId, 0, FrontEdgeMaterialId, 90, EdgeMaterialId, 90, MainMaterialId, 0, OutsideMaterialId, 0)
      }
    }

    // countertops
    //---------------------------------------------------------------------

    else if (category == 'countertop') {
      if (shape) {
        addShapeColors(MainMaterialId, MainMaterialId, MainMaterialId, category)
      }
      else {
        addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, FrontEdgeMaterialId, 0, EdgeMaterialId, 0, MainMaterialId, 0, MainMaterialId, 0)
      }
    }

    // front panels
    //---------------------------------------------------------------------

    else if (category == 'front') {
      addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, MainMaterialId, 90, MainMaterialId, 90, EdgeMaterialId, 0, EdgeMaterialId, 0)
    }
    else if (category == 'frameFrontVert') {
      if (shape) {
        addShapeColors(MainMaterialId, MainMaterialId, MainMaterialId, category)
      }
      else {
        addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, MainMaterialId, 90, MainMaterialId, 90, EdgeMaterialId, 0, EdgeMaterialId, 0)
      }
    }
    else if (category == 'frameFrontHor') {
      if (shape) {
        addShapeColors(MainMaterialId, MainMaterialId, MainMaterialId, category)
      }
      else {
        addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, MainMaterialId, 0, MainMaterialId, 0, EdgeMaterialId, 0, EdgeMaterialId, 0)
      }
    }

    // fingergrips
    //---------------------------------------------------------------------

    else if (category == 'fingergrip') {
      addShapeColors(MainMaterialId, MainMaterialId, MainMaterialId, category)
    }

    // All the others
    //---------------------------------------------------------------------

    else {
      addDefaultColor(MainMaterialId);
    }
  }

  // Error handling
  //---------------------------------------------------------------------
  catch (error: any) {
    logError("Can not create the materials and show it for part: " + category);
  }

  //=====================================================================
  // Functions to add the materials
  //=====================================================================

  // We got all the colors on each side
  //---------------------------------------------------------------------

  function addAllColors(left: string, rotLeft: number, right: string, rotRight: number, front: string, rotFront: number, back: string, rotBack: number, top: string, rotTop: number, bottom: string, rotBot: number) {
    part.addFaceMaterial(left, FaceKey.Left, rotLeft, 0, 0, 1, 1);
    part.addFaceMaterial(right, FaceKey.Right, rotRight, 0, 0, 1, 1);
    part.addFaceMaterial(front, FaceKey.Front, rotFront, 0, 0, 1, 1);
    part.addFaceMaterial(back, FaceKey.Back, rotBack, 0, 0, 1, 1);
    part.addFaceMaterial(top, FaceKey.Top, rotTop, 0, 0, 1, 1);
    part.addFaceMaterial(bottom, FaceKey.Bottom, rotBot, 0, 0, 1, 1);
  }

  // Add material to shape parts
  //---------------------------------------------------------------------

  function addShapeColors(color1: string, color2: string, side: string, category: string) {
    if (category == 'sidepanel') {
      part.addFaceMaterial(color1, FaceKey.Top, 90, 0, 0, 1, 1);
      part.addFaceMaterial(color2, FaceKey.Bottom, 90, 0, 0, 1, 1);
      part.addFaceMaterial(side, FaceKey.Side, 0, 0, 0, 1, 1);
    }
    else if (category == 'fingergrip') {
      part.addFaceMaterial(color1, FaceKey.Top, 0, 0, 0, 1, 1);
      part.addFaceMaterial(color2, FaceKey.Bottom, 0, 0, 0, 1, 1);
      part.addFaceMaterial(side, FaceKey.Side, 90, 0, 0, 1, 1);
    }
    else if (category == 'frameFrontVert') {
      part.addFaceMaterial(color1, FaceKey.Top, 90, 0, 0, 1, 1);
      part.addFaceMaterial(color2, FaceKey.Bottom, 90, 0, 0, 1, 1);
      part.addFaceMaterial(side, FaceKey.Side, 0, 0, 0, 1, 1);
    }
    else if (category == 'frameFrontHor') {
      part.addFaceMaterial(side, FaceKey.Top, 0, 0, 0, 1, 1);
      part.addFaceMaterial(side, FaceKey.Bottom, 0, 0, 0, 1, 1);
      part.addFaceMaterial(side, FaceKey.Side, 0, 0, 0, 1, 1);
    }
    else if (category == 'countertop') {
      part.addFaceMaterial(side, FaceKey.Top, 90, 0, 0, 1, 1);
      part.addFaceMaterial(side, FaceKey.Bottom, 90, 0, 0, 1, 1);
      part.addFaceMaterial(side, FaceKey.Side, 90, 0, 0, 1, 1);
    }
  }

  // Add material default only one color
  //---------------------------------------------------------------------

  function addDefaultColor(color: string) {
    part.addFaceMaterial(color, FaceKey.Default, 0, 0, 0, 1, 1)
  }

  //=====================================================================
  // Get the grain direction
  //=====================================================================

  // Get the grain direction
  function getGrainDirection(Part: any, TypeElement: string, ProgramGrainGroup: string, ColorGrainGroup: string): grain {

    // Get the BomArticleGroup
    const PartSettings = GlobalFunc.find_PartSettings(Part._partId, Part.pa_AdditionalInfo1, false);
    const bomArticleGroup = PartSettings?.BomArticleGroup ?? 'None';

    // BomArticleGroup which is using the table GrainDirectionSettings
    const validGroups = ['Carcase', 'Toekick', 'Countertop'];

    // Get the grain direction candidate
    let GrainDirectionCandidate: any = 'None';
    if (validGroups.includes(bomArticleGroup)) {
      const GrainDirectionSettings = GlobalFunc.find_GrainDirectionSettings(Part._partId, TypeElement, ProgramGrainGroup, ColorGrainGroup, Part._width, Part._depth);
      GrainDirectionCandidate = Part.pa_GrainLogic === 'Library' ? GrainDirectionSettings?.GrainDirection : 'None';
    }
    else if (bomArticleGroup == 'Fitting'){
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

  
}  