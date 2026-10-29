  // Schuler Consulting
  // Create: March 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_ApplianceGraphic
  // Add the graphic for the appliances
  //
  // Revisions:
  //
  //===================================================================================

  //===================================================================================
  // Generic insertion of the appliances
  //===================================================================================

  // Get the oven elements from the tables
  let Data = GlobalFunc.find_ApplianceGraphicLibrary(this.mod_GraphicId);

  // Cycle through the found elements of the oven (in the table)
  Data.forEach(elem => {

    // Add the element to graphic
    let GraphicElem = this.addpart_ApplianceGraphic(elem.WidthPos, elem.HeightPos, elem.DepthPos, elem.Width, elem.Height, elem.Depth);

    // Add OBJ and Material if possible
    if (elem.Model3D) {
      GraphicElem.assign3DModel(elem.Model3D);
      addDefaultColor(GraphicElem, elem.MaterialId!);
    }
    else {
      addAllColors(GraphicElem, elem.MaterialId!, elem.MaterialId!);
    }
    
  });

  //===================================================================================
  // Functions to add the materials
  //===================================================================================

  // We got all the colors on each side
  //---------------------------------------------------------------------

  function addAllColors(part: any, color1: string, color2: string,) {
    part.addFaceMaterial(color2, FaceKey.Left, 0, 0, 0, 1, 1);
    part.addFaceMaterial(color2, FaceKey.Right, 0, 0, 0, 1, 1);
    part.addFaceMaterial(color1, FaceKey.Front, 0, 0, 0, 1, 1);
    part.addFaceMaterial(color2, FaceKey.Back, 0, 0, 0, 1, 1);
    part.addFaceMaterial(color2, FaceKey.Top, 0, 0, 0, 1, 1);
    part.addFaceMaterial(color2, FaceKey.Bottom, 0, 0, 0, 1, 1);
  }

  // Add material to shape parts
  //---------------------------------------------------------------------

  function addShapeColors(part: any, color1: string, color2: string, side: string, category: string) {
    if (category == 'Side') {
      part.addFaceMaterial(color1, FaceKey.Front, 90, 0, 0, 1, 1);
      part.addFaceMaterial(color2, FaceKey.Back, 90, 0, 0, 1, 1);
      part.addFaceMaterial(side, FaceKey.Side, 0, 0, 0, 1, 1)
    }
  }

  // Add material default only one color
  //---------------------------------------------------------------------

  function addDefaultColor(part: any, color: string) {
    part.addFaceMaterial(color, FaceKey.Default, 0, 0, 0, 1, 1)
  }