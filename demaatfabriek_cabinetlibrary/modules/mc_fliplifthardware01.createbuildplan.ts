
  // Schuler Consulting
  // Create: Feb 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_FlipliftHardware01
  // Get the data from the parent module
  // Add the fittings and drills for the fliplift
  //
  // Revisions:
  //
  //=============================================================

  //=============================================================
  // Get the data from the parent module
  //=============================================================

  try {
    let hardwareData = this.mod_HardwareTypeList[4] ? JSON.parse(this.mod_HardwareTypeList[4]) : null;
    let frontOverlay = this.mod_FrontOverlayInfo ? JSON.parse(this.mod_FrontOverlayInfo) : null;

    let connectorPosX = 0;
    let connectorPosY = 0;

    // Create an object to store the hardware id's
    let hardwareElements: { values: string[] } = { values: [] };

    //=============================================================
    // Fliplift FHF
    //=============================================================

    if (this.mod_FlipliftType == "FHF") {

      // First front (insert the front connectors)
      //-----------------------------------------------------------

      if (this.mod_FlipliftFrontNumber == 0) {

        // Cycle through the hardware elements to insert
        for (let i = 0; i < hardwareData.FrontElements.length; i++) {

          // Identify the hardware element to insert
          let thisElement = hardwareData.FrontElements[i].Data;

          // Insert only the front connectors
          if (thisElement.Identifier == "FrontConnector") {

            // Positioning in X-Direction
            let gposX = thisElement.ConstructionPosX - thisElement.PosX - thisElement.DimX / 2;
            let dposX = thisElement.ConstructionPosX;
            connectorPosX = thisElement.ConstructionPosX;
            if (hardwareData.FrontElements[i].Direction == "R") {
              gposX = this.mod_Width - gposX - thisElement.DimX;
              dposX = this.mod_Width - dposX;
            }

            // Positioning in Z-Direction
            let gposZ = thisElement.PosZ - thisElement.DimZ;
            let dposZ = -1;

            // Positioning in Y-Direction
            let gposY = this.mod_FrontHeight - thisElement.DimY - thisElement.ConstructionPosY - thisElement.PosY;
            let dposY = this.mod_FrontHeight - thisElement.ConstructionPosY;
            connectorPosY = thisElement.ConstructionPosY;

            // Insertion of the graphic
            let graphic = this.addpart_FlipliftHardwareGraphic(gposX, gposY, gposZ, thisElement.DimX, thisElement.DimY, thisElement.DimZ);
            graphic.assign3DModel(thisElement.Model3D);
            this.assignPartGroup(this.mod_FrontId, graphic);
            this.assignOpenGroup(this.mod_FrontId, graphic);

            // Add the material in the graphic
            GlobalFunc.process_AddMaterial(graphic, 'fliplift', thisElement.Color);

            // Insertion of the drills
            let drill = this.addpart_FlipliftHardwareFrontpanelDrilling(dposX, dposY, dposZ, 1, 1, 1);
            drill.pa_ProcessingId = thisElement.ProcessingId;
            this.assignPartGroup(this.mod_FrontId, drill);

            // Add the bom id
            hardwareElements.values.push(thisElement.HardwareId);
          }
        }

        // First front (insert the mechanism)
        //-----------------------------------------------------------

        // Cycle through the hardware elements to insert
        for (let i = 0; i < hardwareData.MechanismElements.length; i++) {

          // Identify the hardware element to insert
          let thisElement = hardwareData.MechanismElements[i].Data;

          if (thisElement.Identifier == "Mechanism") {

            // Positioning in X-Direction
            let posX = connectorPosX - thisElement.PosX - thisElement.DimX / 2 - thisElement.ConstructionPosX;
            if (hardwareData.MechanismElements[i].Direction == "R") {
              posX = this.mod_Width - posX - thisElement.ConstructionPosX - thisElement.DimX;
            }

            // Positioning in Z-Direction
            let posZ = thisElement.PosZ - thisElement.DimZ - thisElement.ConstructionPosZ;

            // Positioning in Y-Direction
            let posY = this.mod_FrontHeight - connectorPosY - thisElement.ConstructionPosY - thisElement.PosY;

            // Dimension DimY
            let dimY = thisElement.DimY; // this.mod_Height - thisElement.ConstructionDimY - posY;  ==> As long as we can't really stretch the 3D-Models

            // Insertion of the graphic
            let graphic = this.addpart_FlipliftHardwareGraphic(posX, posY, posZ, thisElement.DimX, dimY, thisElement.DimZ);
            graphic.assign3DModel(thisElement.Model3D, true);
            this.assignPartGroup(this.mod_FrontId, graphic);

            // Add the material in the graphic
            GlobalFunc.process_AddMaterial(graphic, 'fliplift', thisElement.Color);

            // Add the bom id
            hardwareElements.values.push(thisElement.HardwareId);
          }
        }
      }

      // Second front (insert the powerstorage)
      //-----------------------------------------------------------

      else if (this.mod_FlipliftFrontNumber == 1) {

        // Cycle through the hardware elements to insert
        for (let i = 0; i < hardwareData.CarcaseElements.length; i++) {

          // Identify the hardware element to insert
          let thisElement = hardwareData.CarcaseElements[i].Data;

          // Insert only the powerstorage
          if (thisElement.Identifier == "CarcaseLeft" || thisElement.Identifier == "CarcaseRight") {

            // Positioning in X-Direction
            let gposX = -thisElement.PosX;
            let dposX = 0;
            if (hardwareData.CarcaseElements[i].Direction == "R") {
              gposX = this.mod_Width + thisElement.PosX - thisElement.DimX;
              dposX = this.mod_Width - 1;
            }

            // Positioning in Z-Direction
            let gposZ = -thisElement.DimZ - this.mod_FrontGapCarcase - thisElement.ConstructionPosZ + thisElement.PosZ;
            let dposZ = - this.mod_FrontGapCarcase - thisElement.ConstructionPosZ;

            // Positioning in Y-Direction
            let gposY = this.mod_FrontHeight - frontOverlay.Top - thisElement.DimY - thisElement.ConstructionPosY + thisElement.PosY;
            let dposY = this.mod_FrontHeight - frontOverlay.Top - thisElement.ConstructionPosY

            // Insertion of the graphic
            let graphic = this.addpart_FlipliftHardwareGraphic(gposX, gposY, gposZ, thisElement.DimX, thisElement.DimY, thisElement.DimZ);
            graphic.assign3DModel(thisElement.Model3D);
            this.assignPartGroup(this.mod_FrontId, graphic);

            // Add the material in the graphic
            GlobalFunc.process_AddMaterial(graphic, 'fliplift', thisElement.Color);

            // Insertion of the drills
            let drill = this.addpart_FlipliftHardwareSidepanelDrilling(dposX, dposY, dposZ, 1, 1, 1);
            drill.pa_ProcessingId = thisElement.ProcessingId;
            this.assignPartGroup(this.mod_FrontId, drill);

            // Add the bom id
            hardwareElements.values.push(thisElement.HardwareId);
          }
        }
      }
    }

    //=============================================================
    // Fliplift (all the other versions)
    //=============================================================

    else {

      // Front connectors
      //-----------------------------------------------------------

      // Cycle through the hardware elements to insert
      for (let i = 0; i < hardwareData.FrontElements.length; i++) {

        // Identify the hardware element to insert
        let thisElement = hardwareData.FrontElements[i].Data;

        // Insert only the front connectors
        if (thisElement.Identifier == "FrontConnector") {

          // Positioning in X-Direction
          let gposX = thisElement.ConstructionPosX - thisElement.PosX - thisElement.DimX / 2;
          let dposX = thisElement.ConstructionPosX;
          connectorPosX = thisElement.ConstructionPosX;
          if (hardwareData.FrontElements[i].Direction == "R") {
            gposX = this.mod_Width - gposX - thisElement.DimX;
            dposX = this.mod_Width - dposX;
          }

          // Positioning in Z-Direction
          let gposZ = thisElement.PosZ - thisElement.DimZ;
          let dposZ = -1;

          // Positioning in Y-Direction
          let gposY = this.mod_FrontHeight - frontOverlay.Top - thisElement.DimY - thisElement.ConstructionPosY - thisElement.PosY;
          let dposY = this.mod_FrontHeight - frontOverlay.Top - thisElement.ConstructionPosY;
          connectorPosY = thisElement.ConstructionPosY;

          // Insertion of the graphic
          let graphic = this.addpart_FlipliftHardwareGraphic(gposX, gposY, gposZ, thisElement.DimX, thisElement.DimY, thisElement.DimZ);
          graphic.assign3DModel(thisElement.Model3D);
          this.assignPartGroup(this.mod_FrontId, graphic);
          this.assignOpenGroup(this.mod_FrontId, graphic);

          // Add the material in the graphic
          GlobalFunc.process_AddMaterial(graphic, 'fliplift', thisElement.Color);

          // Insertion of the drills
          let drill = this.addpart_FlipliftHardwareFrontpanelDrilling(dposX, dposY, dposZ, 1, 1, 1);
          drill.pa_ProcessingId = thisElement.ProcessingId;
          this.assignPartGroup(this.mod_FrontId, drill);

          // Add the bom id
          hardwareElements.values.push(thisElement.HardwareId);
        }
      }

      // Mechanism
      //-----------------------------------------------------------

      // Cycle through the hardware elements to insert
      for (let i = 0; i < hardwareData.MechanismElements.length; i++) {

        // Identify the hardware element to insert
        let thisElement = hardwareData.MechanismElements[i].Data;

        if (thisElement.Identifier == "Mechanism") {

          // Positioning in X-Direction
          let posX = connectorPosX - thisElement.PosX - thisElement.DimX / 2 - thisElement.ConstructionPosX;
          if (hardwareData.MechanismElements[i].Direction == "R") {
            posX = this.mod_Width - posX - thisElement.ConstructionPosX - thisElement.DimX;
          }

          // Positioning in Z-Direction
          let posZ = thisElement.PosZ - thisElement.DimZ - thisElement.ConstructionPosZ;

          // Positioning in Y-Direction
          let posY = this.mod_FrontHeight - frontOverlay.Top - connectorPosY - thisElement.ConstructionPosY - thisElement.PosY;

          // Dimension DimY
          let dimY = thisElement.DimY
          if (thisElement.ConstructionDimY > 0) {
            dimY = this.mod_Height - thisElement.ConstructionDimY - posY;
          }

          // Insertion of the graphic
          let graphic = this.addpart_FlipliftHardwareGraphic(posX, posY, posZ, thisElement.DimX, dimY, thisElement.DimZ);
          graphic.assign3DModel(thisElement.Model3D, true);
          this.assignPartGroup(this.mod_FrontId, graphic);

          // Add the material in the graphic
          GlobalFunc.process_AddMaterial(graphic, 'fliplift', thisElement.Color);

          // Add the bom id
          hardwareElements.values.push(thisElement.HardwareId);
        }
      }

      // Carcase Element (powerstorage)
      //-----------------------------------------------------------

      // Cycle through the hardware elements to insert
      for (let i = 0; i < hardwareData.CarcaseElements.length; i++) {

        // Identify the hardware element to insert
        let thisElement = hardwareData.CarcaseElements[i].Data;

        // Insert only the powerstorage
        if (thisElement.Identifier == "CarcaseLeft" || thisElement.Identifier == "CarcaseRight") {

          // Positioning in X-Direction
          let gposX = -thisElement.PosX;
          let dposX = 0;
          if (hardwareData.CarcaseElements[i].Direction == "R") {
            gposX = this.mod_Width + thisElement.PosX - thisElement.DimX;
            dposX = this.mod_Width - 1;
          }

          // Positioning in Z-Direction
          let gposZ = -thisElement.DimZ - thisElement.ConstructionPosZ + thisElement.PosZ;
          let dposZ = -thisElement.ConstructionPosZ;

          // Positioning in Y-Direction
          let gposY = this.mod_FrontHeight - frontOverlay.Top - thisElement.DimY - thisElement.ConstructionPosY + thisElement.PosY;
          let dposY = this.mod_FrontHeight - frontOverlay.Top - thisElement.ConstructionPosY

          // Insertion of the graphic
          let graphic = this.addpart_FlipliftHardwareGraphic(gposX, gposY, gposZ, thisElement.DimX, thisElement.DimY, thisElement.DimZ);
          graphic.assign3DModel(thisElement.Model3D);
          this.assignPartGroup(this.mod_FrontId, graphic);

          // Add the material in the graphic
          GlobalFunc.process_AddMaterial(graphic, 'fliplift', thisElement.Color);

          // Insertion of the drills
          if (thisElement.ConstructionPart == "Top") {

            // Overwrite positions if the connection is related to the top part
            dposX = thisElement.DrillPosX;
            if (hardwareData.CarcaseElements[i].Direction == "R") {
              dposX = this.mod_Width - thisElement.DrillPosX;
            }
            dposY = this.mod_FrontHeight - frontOverlay.Top - 1;
          }
          let drill = this.addpart_FlipliftHardwareSidepanelDrilling(dposX, dposY, dposZ, 1, 1, 1);
          drill.pa_ProcessingId = thisElement.ProcessingId;
          this.assignPartGroup(this.mod_FrontId, drill);

          // Add the bom id
          hardwareElements.values.push(thisElement.HardwareId);
        }
      }
    }

    //=============================================================
    // Insert the BOM part
    //=============================================================

    // Convert the object to a json string
    const jsonString: string = JSON.stringify(hardwareElements);

    // Add the bom part and set the attribute
    let bomPart = this.addpart_FlipliftHardwareBom(0, 0, 0, 1, 1, 1);
    this.assignPartGroup(this.mod_FrontId, bomPart);
    bomPart.pa_BomId = jsonString;

  }

  //=============================================================
  // Handle the errors
  //=============================================================
  catch (error: any) {
    logError("Hardware for fliplift cannot be inserted. Incomplete data: " + error.Message);
  }