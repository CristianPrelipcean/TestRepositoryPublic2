
  // Schuler Consulting
  // Create: November 2025
  // By Maximilian Mertens
  // Purpose: CabinetLibrary
  //
  // Description:
  // Add part for hardware
  // Provide data for BOM
  //
  // Revisions: 
  //===================================================

  //===================================================
  //          Call the process function
  //===================================================

  let retInfo = GlobalFunc.process_Pullout(this);

  //===================================================
  //          Try to add the part
  //===================================================

  if (retInfo) {

    // Add the part
    let rack = this.addpart_PulloutHardware(retInfo.Basket.PosX, retInfo.Basket.PosY, retInfo.Basket.PosZ, retInfo.Basket.DimX, retInfo.Basket.DimY, retInfo.Basket.DimZ);

    // Create an object to store the hardware id's
    let hardwareElements: { values: string[] } = { values: [] };
    // Add the HardwareId
    hardwareElements.values.push(retInfo.HardwareId);
    hardwareElements.values.push(retInfo.HardwareId2);
    hardwareElements.values.push(retInfo.HardwareId3);
    hardwareElements.values.push(retInfo.HardwareId4);
    // Convert the object to a json string
    const jsonString: string = JSON.stringify(hardwareElements);
    // Pass the list of HardwareId's to the part
    rack.pa_HardwareId = jsonString;

    // Assign the 3D Model, Opengroup and Material
    rack.assign3DModel(retInfo.Basket.Model3D);
    this.assignOpenGroup(this.mod_FrontId, rack);
    GlobalFunc.process_AddMaterial(rack, 'hardware', retInfo.Basket.Color);

       // Add the Slide part
    let slide = this.addpart_PulloutHardware(retInfo.Slide.PosX, retInfo.Slide.PosY, retInfo.Slide.PosZ, retInfo.Slide.DimX, retInfo.Slide.DimY, retInfo.Slide.DimZ);

    slide.assign3DModel(retInfo.Slide.Model3D);
    GlobalFunc.process_AddMaterial(slide, 'hardware', retInfo.Slide.Color);

    // Create an object to store the hardware id's
    let hardwareElementsSlide: { values: string[] } = { values: [] };
    // Add the HardwareId
    hardwareElementsSlide.values.push(retInfo.HardwareId);
    hardwareElementsSlide.values.push(retInfo.HardwareId2);
    hardwareElementsSlide.values.push(retInfo.HardwareId3);
    hardwareElementsSlide.values.push(retInfo.HardwareId4);
    // Convert the object to a json string
    const jsonStringslide: string = JSON.stringify(hardwareElementsSlide);
    // Pass the list of HardwareId's to the part
    slide.pa_HardwareId = jsonStringslide;

    // Add the Drillings part
    let drillings = this.addpart_PulloutHardwareDrillings(retInfo.Basket.PosX, retInfo.Basket.PosY, retInfo.Basket.PosZ, retInfo.Basket.DimX, retInfo.Basket.DimY, retInfo.Basket.DimZ);
    drillings.pa_ProcessingId = retInfo.ProcessingId;

    //NOT Correct, figure out where ProcessingId2 comes from
    drillings.pa_ProcessingId2 = retInfo.ProcessingId;
  }
  
  //===================================================
  //          Error handling
  //===================================================

  else{
      let Text = "";
      let ErrorMessage = GlobalFunc.find_ErrorList('Error 21008',1)
      logError(ErrorMessage.Message(Text));
  }