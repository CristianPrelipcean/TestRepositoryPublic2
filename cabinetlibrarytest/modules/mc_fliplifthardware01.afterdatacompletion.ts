  // Schuler Consulting
  // Create: Feb 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mc_FlipliftHardware01
  // Call the process function for the hardware
  // Provide the data for CreateBuildPlan and the parent
  //
  // Revisions:
  //
  //===================================================

  //===================================================
  // Call the process function
  //===================================================

  let hardwareData = GlobalFunc.process_Fliplift(this);

  try {
    if (hardwareData) {

      // Return the OpeningAngle
      let OpeningAngle: any = {
        Angle: hardwareData.AddOnData.OpeningAngle
      }
      let strJsonOpeningAngle = JSON.stringify(OpeningAngle);
      this.mod_OpeningAngle.push(strJsonOpeningAngle);

      // Return AddOnData
      this.mod_HardwareTypeList.push(hardwareData.AddOnData.PushToOpen.toString());
      this.mod_HardwareTypeList.push(hardwareData.AddOnData.Hinges.toString());
      this.mod_HardwareTypeList.push(hardwareData.AddOnData.HingeClass);
      this.mod_HardwareTypeList.push(hardwareData.AddOnData.FlipliftHardwareType);
      this.mod_OpeningAngle.push(hardwareData.AddOnData.OpeningAngle.toString());

      // Push the hardware data from the process function to the HardwareTypeList to get access in CreateBuildPlan
      this.mod_HardwareTypeList.push(JSON.stringify(hardwareData));     
    }

    // Error handling
    else {
      throw new Error('No data for the fliplift hardware.');
    }
  }

  // Faild to create the hardware data
  catch (error: any) {
    logError(GlobalFunc.find_ErrorList('Error 22033', 1).Message(error.message));
  }
        