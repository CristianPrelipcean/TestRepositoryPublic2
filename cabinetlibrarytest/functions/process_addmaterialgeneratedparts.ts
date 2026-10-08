process_AddMaterialGeneratedParts(
  part: any,
  category: string = 'None',
  mainColor: string = 'None',
  outsideColor: string = 'None',
  mainEdgeColor: string = 'None',
  frontEdgeColor: string = 'None',
  secondColor: boolean = false,
  shape: boolean = false
): void {

  //=====================================================================
  // Functions to add the materials
  //=====================================================================

  // Add individual materials to all six faces of a rectangular part
  //---------------------------------------------------------------------

  const addAllColors = (
    left: string,
    rotationLeft: number,
    right: string,
    rotationRight: number,
    front: string,
    rotationFront: number,
    back: string,
    rotationBack: number,
    top: string,
    rotationTop: number,
    bottom: string,
    rotationBottom: number
  ): void => {
    part.addFaceMaterial(left, FaceKey.Left, rotationLeft, 0, 0, 1, 1);
    part.addFaceMaterial(right, FaceKey.Right, rotationRight, 0, 0, 1, 1);
    part.addFaceMaterial(front, FaceKey.Front, rotationFront, 0, 0, 1, 1);
    part.addFaceMaterial(back, FaceKey.Back, rotationBack, 0, 0, 1, 1);
    part.addFaceMaterial(top, FaceKey.Top, rotationTop, 0, 0, 1, 1);
    part.addFaceMaterial(bottom, FaceKey.Bottom, rotationBottom, 0, 0, 1, 1);
  };

  // Add individual materials to the faces of a shape part
  //---------------------------------------------------------------------

  const addShapeColors = (top: string, rotationTop: number, bottom: string, rotationBottom: number, side: string, rotationSide: number): void => {
    part.addFaceMaterial(top, FaceKey.Top, rotationTop, 0, 0, 1, 1);
    part.addFaceMaterial(bottom, FaceKey.Bottom, rotationBottom, 0, 0, 1, 1);
    part.addFaceMaterial(side, FaceKey.Side, rotationSide, 0, 0, 1, 1);
  };

  // Add one default material to a complex 3D model
  //---------------------------------------------------------------------

  const addDefaultColor = (materialId: string, rotation: number = 0): void => {
    part.addFaceMaterial(materialId, FaceKey.Default, rotation, 0, 0, 1, 1);
  };

  try {

    //=====================================================================
    // Determine the material IDs
    //=====================================================================

    const colorIdParent = ct_tab_PartSettings.find(setting => setting.in_Part === part._partId)?.ColorIdParent ?? 'All';
    const mainMaterialId = GlobalFunc.find_MaterialMapping(mainColor, colorIdParent)?.MaterialId ?? 'None';
    const outsideMaterialId = secondColor ? GlobalFunc.find_MaterialMapping(outsideColor, colorIdParent)?.MaterialId ?? 'None' : mainMaterialId;
    const edgeMaterialId = mainEdgeColor !== 'None' ? GlobalFunc.find_MaterialMapping(mainEdgeColor, colorIdParent)?.MaterialId ?? 'None' : mainMaterialId;
    const frontEdgeMaterialId = frontEdgeColor !== 'None' ? GlobalFunc.find_MaterialMapping(frontEdgeColor, colorIdParent)?.MaterialId ?? 'None' : mainMaterialId;

    //=====================================================================
    // Add materials according to the generated part category
    //=====================================================================

    // Countertop
    //---------------------------------------------------------------------

    if (category === 'countertop') {
      if (shape) {
        addShapeColors(mainMaterialId, 0, outsideMaterialId, 0, edgeMaterialId, 0);
      }
      else {
        addAllColors(edgeMaterialId, 90, edgeMaterialId, 90, frontEdgeMaterialId, 0, edgeMaterialId, 0, mainMaterialId, 0, outsideMaterialId, 0);
      }

      return;
    }

    // Horizontal panels
    //---------------------------------------------------------------------

    if (category === 'horizontalPanel') {
      if (shape) {
        addShapeColors(mainMaterialId, 0, outsideMaterialId, 0, edgeMaterialId, 0);
      }
      else {
        addAllColors(edgeMaterialId, 0, edgeMaterialId, 0, frontEdgeMaterialId, 0, edgeMaterialId, 0, mainMaterialId, 0, outsideMaterialId, 0);
      }

      return;
    }

    // Vertical panels (toekick / backsplash / ceiling filler)
    //---------------------------------------------------------------------

    if (category === 'verticalPanel') {
      if (shape) {
        addShapeColors(mainMaterialId, 0, outsideMaterialId, 0, edgeMaterialId, 0);
      }
      else {
        addAllColors(edgeMaterialId, 90, edgeMaterialId, 90, edgeMaterialId, 0, edgeMaterialId, 0, mainMaterialId, 0,  mainMaterialId, 0);
      }

      return;
    }

    // Finger grip
    //---------------------------------------------------------------------

    if (category === 'fingergrip') {
      addShapeColors(mainMaterialId, 0, mainMaterialId, 0, mainMaterialId, 0);

      return;
    }

    // All other generated parts use the material of the complex 3D model
    //---------------------------------------------------------------------

    addDefaultColor(mainMaterialId);
  }

  //=====================================================================
  // Error handling
  //=====================================================================

  catch (error: any) {
    logError("Can not add materials to generated part. Category: " + category);
  }
}