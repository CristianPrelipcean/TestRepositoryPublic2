
  // Schuler Consulting
  // Create: May 2024
  // By Ludwig Weber
  // CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_Handle_01
  // Call the process functions
  // Add the handle graphically
  // Add the drilling part
  //
  // Revisions:
  //
  //===================================================

  try {

    //===================================================
    //          Interface for the handle data
    //===================================================

    interface HandleData {
      Model3D?: any;
      Model3DGroupName: string;
      ColorId: string;
      Length: number;
      Depth: number;
      Thickness: number;
      Weight: number;
      Rotation: number;
      PosVertical: number;
      PosHorizontal: number;
      ProcessingId: string;
      HardwareId: string;
    }

    //===================================================
    //          Call the process functions
    //===================================================

    // Parse handle data
    const handleJson = this.mod_HardwareTypeList?.[0];
    if (!handleJson) throw new Error("mod_HardwareTypeList[0] is undefined or empty");

    const retHandle: HandleData = JSON.parse(handleJson);
    if (!retHandle.Model3DGroupName) throw new Error("Model3DGroupName is missing in retHandle");

    // Get position data
    const retHandlePos = GlobalFunc.process_GraphicInsertionHelper(
      '110',
      retHandle.Model3DGroupName,
      retHandle.Length,
      retHandle.Thickness,
      retHandle.Depth
    );

    //===================================================
    //          Add the handle graphically
    //===================================================

    const PosX = retHandle.PosVertical + retHandlePos.InsertionPointX + retHandlePos.OffsetX;
    const PosY = retHandle.PosHorizontal + retHandlePos.InsertionPointY + retHandlePos.OffsetY;
    const PosZ = this.mod_Depth + retHandlePos.InsertionPointZ + retHandlePos.OffsetZ;
    const Width = retHandlePos.DimensionX;
    const Height = retHandlePos.DimensionY;
    const Depth = retHandlePos.DimensionZ;

    const Handle = this.addpart_Handle(PosX, PosY, PosZ, Width, Height, Depth);
    Handle.assign3DModel(retHandle.Model3D);
    this.assignPartGroup(this.mod_FrontId, Handle);
    this.assignOpenGroup(this.mod_FrontId, Handle);
    GlobalFunc.process_AddMaterial(Handle, 'handle', retHandle.ColorId);

    const partMatrix = PartHelper.rotateZ(Handle, retHandle.Rotation, new Vector3(Width / 2, Height / 2, 0));
    Handle.setMatrix(partMatrix);
    Handle.pa_HardwareId = retHandle.HardwareId;

    //===================================================
    //          Add the drilling part
    //===================================================

    if (this.mod_HandleDrill) {
      const handleDrill = this.addpart_HandleDrill(
        retHandle.PosVertical,
        retHandle.PosHorizontal,
        this.mod_Depth,
        1,
        1,
        retHandlePos.DimensionZ
      );

      handleDrill.pa_Model3DGroupName = retHandle.Model3DGroupName;
      handleDrill.pa_ProcessingId = retHandle.ProcessingId;
      handleDrill.pa_Rotation = retHandle.Rotation;
      handleDrill.pa_Length = retHandlePos.DimensionX;
    }
  }
  catch (error) {
    logDebug("Error while adding handle: " + (error as Error).message);
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 22040', 1);
    logError(ErrorMessage.Message(''));
  }


