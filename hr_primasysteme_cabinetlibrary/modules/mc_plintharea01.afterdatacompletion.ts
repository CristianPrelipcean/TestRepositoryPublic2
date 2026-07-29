  // Schuler Consulting
  // Create: Dez 2023
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mc_PlinthArea01
  // Add module for the legs
  // Call function for logic of the legs
  //
  //===================================================

  if (this.mod_PlinthAreaDesign_matrix.PlinthAreaType === 'Leg' && this.mod_LegInsertion) {

    //===================================================
    //          Add module for the Leg
    //===================================================

    // Call for the process function
    const retInfo = GlobalFunc.process_PlinthAreaLegs(this);

    // Check array lengths to ensure data consistency
    const arrays = [
      retInfo.PosX,
      retInfo.PosZ,
      retInfo.Rotation,
      retInfo.Model3DGroupName,
      retInfo.ProcessingId,
      retInfo.HardwareId
    ];

    const expectedLength = retInfo.Model3DGroupName.length;
    const allSameLength = arrays.every(arr => arr.length === expectedLength);

    if (!allSameLength) {
      let ErrorMessage = GlobalFunc.find_ErrorList('Error 22042',1)
      logError(ErrorMessage.Message(""));
      return;
    }

    // Provide the position of the legs for creation of the contour
    const legPositions = {
      LineLeft: retInfo.LineLeft,
      LineRight: retInfo.LineRight,
      LineFront: retInfo.LineFront,
      LineBack: retInfo.LineBack
    };
    this.mod_PlinthAreaPositionInfo.push(JSON.stringify(legPositions));

    // Insert legs
    for (let i = 0; i < expectedLength; i++) {
      const Leg = this.addOD_M_mc_Leg01();
      Leg.setOrigin(retInfo.PosX[i], 0, retInfo.PosZ[i]);

      Leg.mod_Rotation = retInfo.Rotation[i];
      Leg.mod_Model3DGroupName = retInfo.Model3DGroupName[i];
      Leg.mod_ProcessingId = retInfo.ProcessingId[i];
      Leg.mod_HardwareId = retInfo.HardwareId[i];
    }
  }