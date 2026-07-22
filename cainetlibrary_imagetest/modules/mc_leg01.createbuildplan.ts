  // Schuler Consulting
  // Create: May 2024
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_Leg01
  // Call the functions
  // Add the leg graphically
  // Add the drilling part
  //
  //===================================================

  try {
    //===================================================
    // Call the functions
    //===================================================

    // Retrieve data from GraphicLibrary
    const [LegInfo, GrapicInfo] = GlobalFunc.process_GraphicLibraryData(this.mod_Model3DGroupName);

    // Process Graphic Insertion Helper
    const RetLegPos = GlobalFunc.process_GraphicInsertionHelper('121', this.mod_Model3DGroupName, 0, 0, 0);

    if (!LegInfo || !GrapicInfo || !RetLegPos) {
      const ErrorMessage = GlobalFunc.find_ErrorList('Error 21007', 1);
      logError(ErrorMessage.Message(""));
      return;
    }

    //===================================================
    // Add the leg graphically
    //===================================================

    const rot = this.mod_Rotation ?? 0;
    // Use the plinth area height to define the leg height if the leg height is not set
    const legReferenceHeight = this.mod_Height > 0 ? this.mod_Height : (this.mod_PlinthAreaHeight ?? 0);

    const PosX = (rot === 90 || rot === 180)
      ? RetLegPos.InsertionPointX
      : RetLegPos.InsertionPointX + (RetLegPos.OffsetX ?? 0);

    const PosY = 0;

    const PosZ = (rot === 180 || rot === 270)
      ? RetLegPos.InsertionPointZ - (RetLegPos.OversizeZ ?? 0)
      : RetLegPos.InsertionPointZ + (RetLegPos.OffsetZ ?? 0);

    const Width = (RetLegPos.DimensionX ?? 0) + (RetLegPos.OversizeX ?? 0);
    const Height = legReferenceHeight + (RetLegPos.OversizeY ?? 0);
    const Depth = (RetLegPos.DimensionZ ?? 0) + (RetLegPos.OversizeZ ?? 0);

    // Check the dimensions
    if (Width <= 0 || Height <= 0 || Depth <= 0) {
      const ErrorMessage = GlobalFunc.find_ErrorList('Error 21007', 1);
      logError(ErrorMessage.Message(""));
      return;
    }

    // Insert the leg
    const Leg = this.addpart_Leg(PosX, PosY, PosZ, Width, Height, Depth);
    this.assignPartGroup(this.mod_CarcaseId, Leg);

    if (GrapicInfo.Model3D) {
      Leg.assign3DModel(GrapicInfo.Model3D);
    }
    GlobalFunc.process_AddMaterial(Leg, 'leg', LegInfo.ColorId ?? "");

    // Rotation of the leg
    const partMatrix = PartHelper.rotateY(Leg, rot, new Vector3(Width / 2, 0, Depth / 2));
    Leg.setMatrix(partMatrix);

    //===================================================
    // Add the drilling part
    //===================================================

    this.addpart_LegDrill(0, 0, 0, 1, legReferenceHeight, 1);
  }

  //===================================================
  // Error handling
  //===================================================

  catch (err: any) {
      const ErrorMessage = GlobalFunc.find_ErrorList('Error 21007', 1);
      logError(ErrorMessage.Message(""));
  }