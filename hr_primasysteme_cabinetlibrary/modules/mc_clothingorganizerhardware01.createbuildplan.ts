
  // Create: Feb 2026
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_ClothingOrganizerHardware01
  // Add the graphics for the clothing organizer
  // Add the BOM
  // Add the processings
  //
  // Revisions:
  // 
  //===================================================================================

  //===================================================================================
  // Add the partgroup
  //===================================================================================

  const bomId = 'ClothingOrganizer01';
  const partGroup = this.addpart_ClothingOrganizerUnit(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
  this.createPartGroup(bomId, partGroup);

  partGroup.pa_BomId = bomId;
  partGroup.pa_PartgroupBomId = this.mod_FrontId;

  //===================================================================================
  // Retrieve the data for the clothingOrganizer
  //===================================================================================

  const coInfo = JSON.parse(this.mod_Information);

  // Guard
  if (coInfo) {

    //===================================================================================
    // Add the graphics for the clothing organizer
    //===================================================================================

    // Guard
    if (coInfo?.Hardware?.Graphics?.length) {

      // Iterate over de graphic items
      for (const graphic of coInfo.Hardware.Graphics) {

        // Add the graphical part
        const coGraphic = this.addpart_ClothingOrganizerGraphic(
          graphic.PosX,
          graphic.PosY,
          graphic.PosZ,
          graphic.DimX,
          graphic.DimY,
          graphic.DimZ
        );

        // Assign the 3DModel
        coGraphic.assign3DModel(graphic.Model3D);

        // Add the material
        GlobalFunc.process_AddMaterial(coGraphic, 'hardware', graphic.Color);
      }
    }

    //===================================================================================
    // Add the BOM
    //===================================================================================

    if (coInfo.Hardware.BomId) {
      let BomElem = this.addpart_ClothingOrganizerBOM(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
      this.assignPartGroup(bomId, BomElem);

      // Create an object to store the hardware id's
      let hardwareElements: { values: string[] } = { values: [] };

      // Add the HardwareId
      hardwareElements.values.push(coInfo.Hardware.BomId);

      // Convert the object to a json string
      const jsonString: string = JSON.stringify(hardwareElements);

      // Pass the list of HardwareId's to the part
      BomElem.pa_HardwareId = jsonString;
      BomElem.pa_ParentName = bomId;
    }

    //===================================================================================
    // Add the processings
    //===================================================================================

    // Guard
    if (coInfo?.Processing?.length) {

      // Iterate over the array of processings
      for (const processing of coInfo.Processing) {

        // Processing on left side
        if (processing.Side == 'Left') {
          const procL = this.addpart_ClothingOrganizerDrilling(processing.RefPosX, processing.RefPosY, processing.RefPosZ, 100, 1, 1);
          procL.pa_ProcessingId = processing.ProcessingId;
        }

        // Processing on right side
        if (processing.Side == 'Right') {
          const procR = this.addpart_ClothingOrganizerDrilling(processing.RefPosX - 100, processing.RefPosY, processing.RefPosZ, 100, 1, 1);
          procR.pa_ProcessingId = processing.ProcessingId;
        }
      }
    }
  }
