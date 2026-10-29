ue_PlinthAreaSingleLeg(m: any, input: any, leg: ICT_tab_PlinthAreaSettings, LegHeight: number = 0) {

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

  // Receive the object from the process function
  let retPlinthArea: PlinthAreaResult = input;

  // Initialize variables
  const ColorRelevant = m.mod_PlinthAreaDesign_matrix.PlinthAreaElementColor === 'Attribute';
  const ExtraItemRelevant = m.mod_PlinthAreaDesign_matrix.PlinthAreaExtraItem === 'Attribute';
  const legHeight = LegHeight > 0 ? LegHeight : m.mod_PlinthAreaHeight;

  //========================================================================
  // Try to calculate the leg data and add to the object
  //========================================================================

  try {

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

    const retConstruction = GlobalFunc.find_PlinthAreaConstruction(leg.BasePoint!, leg.MatrixPositionType!, leg.HardwareRotation!);
    const DimX = retGraphicLib.DimensionX;
    const DimZ = retGraphicLib.DimensionZ;
    const PosX = retConstruction.PosX(m, PosXOffset, DimX, DimZ);
    const PosZ = retConstruction.PosY(m, PosYOffset, DimX, DimZ);
    retPlinthArea.PosX.push(PosX);
    retPlinthArea.PosZ.push(PosZ);
  }

  //========================================================================
  // Catch the errors and return the initial object
  //========================================================================

  catch (err: any) {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 30003',1)
		logError(ErrorMessage.Message(err?.message ?? err));
  }
}