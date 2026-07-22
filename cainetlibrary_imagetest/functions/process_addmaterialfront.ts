process_AddMaterialFront(
  Part: any,
  Module: any,
  Category: string,
  Grain: string,
  EdgeColor: string = 'None',
  FrameMitre: boolean = false,
  FillingColor: string = 'None',
) {

  // Initialize variables, interfaces and types
  //---------------------------------------------------------------------

  type grain = 'Lengthwise' | 'Crosswise' | 'None';
  const grainDirection: grain = validateGrain(Grain, Part._partId);

  interface MaterialIds {
    MainMaterialId: string;
    EdgeMaterialId: string;
  }

  try{

	  // Flatpanels
    //---------------------------------------------------------------------

    if (Category == "FrontPanel01") {

      // Get the material id's
      const {
        MainMaterialId,
        EdgeMaterialId
      } = getMaterialIds(Module.mod_FrontColor, EdgeColor);

      // Define the rotation of the texture
      const Rotation = grainDirection === 'Crosswise' ? 0 : 90;

      // Add the colors
      addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, MainMaterialId, Rotation, MainMaterialId, Rotation, EdgeMaterialId, 0, EdgeMaterialId, 0);
    
    }

    // Flatpanels using OBJ files
    //---------------------------------------------------------------------
    if (Category == "FrontPanelObj01") {

      // Get the material id's
      const {
        MainMaterialId,
        EdgeMaterialId
      } = getMaterialIds(Module.mod_FrontColor, EdgeColor);

      // Define the rotation of the texture
      const Rotation = grainDirection === 'Crosswise' ? 0 : 90;

      // Add the colors
      addDefaultColor(MainMaterialId);
    
    }

    // Segmented front middle part
    //---------------------------------------------------------------------	
    if (Category == "SegmentedFront01"){

      // Get the material id's
      const {
        MainMaterialId,
        EdgeMaterialId
      } = getMaterialIds(Module.mod_FrontSegmentColor, EdgeColor);

      // Define the rotation of the texture
      const Rotation = grainDirection === 'Crosswise' ? 0 : 90;

      // Add the colors
      addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, MainMaterialId, Rotation, MainMaterialId, Rotation, EdgeMaterialId, 0, EdgeMaterialId, 0);

    }

	  // Vertical frame parts
    //---------------------------------------------------------------------

    if (Category == "FrameVertical01") {

      // Get the material id's
      const {
        MainMaterialId,
        EdgeMaterialId
      } = getMaterialIds(Module.mod_FrontColor, EdgeColor);

      // Define the rotation of the texture
      const Rotation = grainDirection === 'Crosswise' ? 0 : 90;

      // Add the colors
	  if(!FrameMitre){
		addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, MainMaterialId, Rotation, MainMaterialId, Rotation, EdgeMaterialId, 0, EdgeMaterialId, 0);
	  }
	  else{
		addShapeColors(MainMaterialId, MainMaterialId, EdgeMaterialId, Rotation);
	  }   
    }

	  // Horizontal frame parts
    //---------------------------------------------------------------------

    if (Category == "FrameHorizontal01") {

      // Get the material id's
      const {
        MainMaterialId,
        EdgeMaterialId
      } = getMaterialIds(Module.mod_FrontColor, EdgeColor);

      // Define the rotation of the texture
      const Rotation = grainDirection === 'Lengthwise' ? 0 : 90;

      // Add the colors
	  if(!FrameMitre){
		addAllColors(EdgeMaterialId, 90, EdgeMaterialId, 90, MainMaterialId, Rotation, MainMaterialId, Rotation, EdgeMaterialId, 0, EdgeMaterialId, 0);
	  }
	  else{
		addShapeColors(MainMaterialId, MainMaterialId, EdgeMaterialId, Rotation);
	  }      
    }

	  // Filling parts
    //---------------------------------------------------------------------

    if (Category == "Filling01") {

      // Get the material id's
      const {
        MainMaterialId,
        EdgeMaterialId
      } = getMaterialIds(FillingColor);

      // Define the rotation of the texture
      const Rotation = grainDirection === 'Crosswise' ? 0 : 90;

      // Add the colors
      addAllColors(MainMaterialId, 90, MainMaterialId, 90, MainMaterialId, Rotation, MainMaterialId, Rotation, MainMaterialId, 0, MainMaterialId, 0);   
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

  function addShapeColors(color1: string, color2: string, side: string, rotation: number) {
	Part.addFaceMaterial(color1, FaceKey.Top, rotation, 0, 0, 1, 1);
	Part.addFaceMaterial(color2, FaceKey.Bottom, rotation, 0, 0, 1, 1);
	Part.addFaceMaterial(side, FaceKey.Side, 0, 0, 0, 1, 1);
  }

  // Add material default only one color
  //---------------------------------------------------------------------

  function addDefaultColor(color: string) {
    Part.addFaceMaterial(color, FaceKey.Default, 0, 0, 0, 1, 1)
  }

  //=====================================================================
  // Get the material id's
  //=====================================================================

  function getMaterialIds(mainColor: string, edgeColor: string = 'None'): MaterialIds {

	  const colorIdParent = ct_tab_PartSettings.find(p => p.in_Part == Part._partId)?.ColorIdParent ?? 'All';
    const MainMaterialId = GlobalFunc.find_MaterialMapping(mainColor, colorIdParent)?.MaterialId ?? 'None';

    const EdgeMaterialId = edgeColor !== 'None'
      ? GlobalFunc.find_MaterialMapping(edgeColor, colorIdParent)?.MaterialId ?? 'None'
      : MainMaterialId;

    return {
      MainMaterialId,
      EdgeMaterialId
    };
  }

  // Check if grain direction is valid
	function isValidGrain(value: any): value is grain {
	  return ['Lengthwise', 'Crosswise', 'None'].includes(value);
	}

	function validateGrain(value: any, partId: string): grain {
	if (isValidGrain(value)) {
		return value;
	}

	logError(`Invalid grain direction "${value}" found for part ${partId}`);
	  return 'None';
	}

}