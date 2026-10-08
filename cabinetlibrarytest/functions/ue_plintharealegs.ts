ue_PlinthAreaLegs(m: any, LegHeight: number = 0) {

  // Interface and Object
	interface PlinthAreaResult {
		Rotation: number[];
		PosX: number[];
		PosZ: number[];
		ProcessingId: string[];
		Model3DGroupName: string[];
		HardwareId: string[];
		LineLeft: number;
		LineRight: number;
		LineFront: number;
		LineBack: number;
	}

	const emptyResult: PlinthAreaResult = {
    Rotation: [],
    PosX: [],
    PosZ: [],
    ProcessingId: [],
    Model3DGroupName: [],
    HardwareId: [],
    LineLeft: 0,
    LineRight: 0,
    LineFront: 0,
    LineBack: 0
  };

	try {
		const retPlinthArea: PlinthAreaResult = { ...emptyResult };
		
		//========================================================================
		// Call user exit for customization
		//========================================================================
			
    //---------------Initialize Variables-------------------

    const ColorRelevant = m.mod_PlinthAreaDesign_matrix.PlinthAreaElementColor === 'Attribute';
    const ExtraItemRelevant = m.mod_PlinthAreaDesign_matrix.PlinthAreaExtraItem === 'Attribute';	
    const carcaseWidth = m.mod_CarcaseWidth ?? 600;
    const carcaseDepth = m.mod_CarcaseDepth ?? 550;
    const weight = m.mod_Weight;
    const legHeight = LegHeight > 0 ? LegHeight : m.mod_PlinthAreaHeight;

    //---------------Find offsets from tab_PlinthAreaSettings-------------

    const retSetting = GlobalFunc.find_PlinthAreaSettings(m.mod_TypeElement, m.mod_PlinthAreaDesign, m.mod_PlinthAreaPosLeftMatrix, m.mod_PlinthAreaPosRightMatrix, m.mod_PlinthAreaPosBackMatrix, m.mod_PlinthAreaPosFrontMatrix, carcaseWidth, carcaseDepth, weight);

    // Cycle for all the legs we found in the table PlinthAreaSettings
    retSetting.forEach(leg => {

      // Save the Offsets for inserting the contour of the plinth panels
      const PosXOffset = leg.PosXOffset(m);
      const PosYOffset = leg.PosYOffset(m);	

      if (leg.MatrixPositionType == 11) {
        retPlinthArea.LineBack = PosYOffset;
        retPlinthArea.LineLeft = PosXOffset;
      }
      else if (leg.MatrixPositionType == 33) {
        retPlinthArea.LineFront = PosYOffset;
        retPlinthArea.LineRight = PosXOffset;
      }	

      // Return the rotation
      retPlinthArea.Rotation.push(leg.HardwareRotation);

      //---------------Find legs from tab_PlinthAreaMapping-------------

      const retMapping = GlobalFunc.find_PlinthAreaMapping(leg.MatrixPositionType, m.mod_PlinthAreaDesign, m.mod_PlinthAreaElementColor, m.mod_PlinthAreaExtraItem, legHeight, m.mod_ShelfbtmThk, ColorRelevant, ExtraItemRelevant);

      //---------------Find data from tab_ObjectMapping (HardwareProcess)-----------

      const retObjectMapping = GlobalFunc.find_ObjectMapping(retMapping.Object!);
      retPlinthArea.ProcessingId.push(retObjectMapping.ProcessingItem!);
      retPlinthArea.HardwareId.push(retObjectMapping.HardwareItem!);

      //---------------Find data from tab_GraphicLibraryMapping-------------

      const retGraphicMapping = GlobalFunc.find_GraphicLibraryMapping(retObjectMapping.GraphicItem!);

      //---------------Find data from tab_GraphicLibrary--------------------

      let retGraphicLib: any;
      let Model3DGroupName = "";

      if (retGraphicMapping.length > 0) {
        const item = retGraphicMapping[0];
        Model3DGroupName = item.Model3DGroupName!;
        retGraphicLib = GlobalFunc.find_GraphicLibrary(Model3DGroupName);
      }

      retPlinthArea.Model3DGroupName.push(Model3DGroupName);	
    
      //---------------Find positions from tab_PlinthAreaConstruction-------

      const retConstruction = GlobalFunc.find_PlinthAreaConstruction(leg.BasePoint!,leg.MatrixPositionType!,leg.HardwareRotation!);
      const DimX = retGraphicLib.DimensionX;
      const DimZ = retGraphicLib.DimensionZ;
      const PosX = retConstruction.PosX(m,PosXOffset,DimX,DimZ);
      const PosZ = retConstruction.PosY(m, PosYOffset, DimX, DimZ);
      retPlinthArea.PosX.push(PosX);
      retPlinthArea.PosZ.push(PosZ);

    });	

    // Return statement for the process function
    return retPlinthArea;
  }

	//========================================================================
	// Catch the errors and return an empty object
	//========================================================================

	catch (err: any) {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 30002',1)
    logError(ErrorMessage.Message(err?.message ?? err));
    
    return emptyResult;
  }
}