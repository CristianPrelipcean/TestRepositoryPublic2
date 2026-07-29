  // Schuler Consulting
  // Create: Feb 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mc_Handle01
  // Call the process function for the hardware
  // Provide the data for CreateBuildPlan and the parent
  //
  // Revisions:
  //
  //===================================================

  //===================================================
  // Call the process function
  //===================================================

  const hardwareData = GlobalFunc.process_Handle(this);

  try {
    if (hardwareData) {
      // Push the hardware data from the process function to the HardwareTypeList to get access in CreateBuildPlan
      this.mod_HardwareTypeList.push(JSON.stringify(hardwareData));
      this.mod_HandleWeightCalculations.push(hardwareData.Weight);     
    }

    // Error handling
    else {
      throw new Error('No data for the handle.');
    }
  }

  // Faild to create the hardware data
  catch (error: any) {
    logError(GlobalFunc.find_ErrorList('Error 22033', 1).Message(error.message));
  }