
  // Get the Information of the Carcase Parts Info
  let carcasePartInfo = JSON.parse(this.mod_CarcasePartInfo[0]);

  //===================================================
  //          Calculate FrontOverlay
  //===================================================

  let iFrontOverlay = GlobalFunc.calc_FrontOverlay(
    this, this.mod_Width,
    this.mod_Height,
    this.mod_Originpos[0],
    this.mod_FrontPosStart,
    'FromFront'
  );

  //===================================================
  //          Add module for the hinges
  //===================================================

  // Helper function for the error handling
  function checkHingeData(data: any) {
    for (const prop in data) {
      if (data[prop] === undefined) {
        throw new Error('Incomplete hinge data!');
      }
    }
  }

  // Try to insert the hinges
  try {

    // Process the hinge data
    let hingeData = GlobalFunc.process_Hinge(this, iFrontOverlay);

    // Error handling
    if (hingeData === undefined) {
      throw new Error('Incomplete hinge data!');
    }
    checkHingeData(hingeData);

    // Get Positions of hinges from attributes or from descriptor
    let hingePositions: number[] = [];

    //Manual Positioning
    if (hingeData.Descriptor == 'ManualPosition') {
      hingePositions.push(this.mod_HingePos1, this.mod_HingePos2, this.mod_HingePos3, this.mod_HingePos4, this.mod_HingePos5, this.mod_HingePos6)
    }
    else {
      // Error handling
      if (hingeData.Descriptor === undefined) {
        throw new Error('Positions of the hinges are not defined.');
      }

      // Process the descriptor
      if (this.mod_ModuleName == 'mc_Door01') {
        hingePositions = GlobalFunc.process_Descriptor(hingeData.Descriptor!, this.mod_Height);
      }
      else if (this.mod_ModuleName == 'mc_Fliplift01') {
        hingePositions = GlobalFunc.process_Descriptor(hingeData.Descriptor!, this.mod_Width);
      }
      else { 
        throw new Error('Module name is unknown. Could not define the positioning of the hinges.');
      }

    }

    //Insert the module of the hinges
    for (let i = 0; i <= hingePositions.length - 1; i++) {
      if (hingePositions[i] > 0) {

        // Add the module
        let Hinge = this.addOD_M_mc_Hinge01();

        // Set values to the attributes of the child
        Hinge.mod_FrontType = this.mod_FrontType;
        let partPosition: number = 0;
        let partDepth: number = 0;
        if (this.mod_ModuleName == 'mc_Door01' && this.mod_DoorDirection == 'Left') {
          Hinge.setOrigin(0, (Math.round(hingePositions[i] * 100) / 100), 0);
          partPosition = carcasePartInfo.VerticalPartsPosZ[0];
          partDepth = carcasePartInfo.VerticalPartsDimZ[0];
        }
        else if (this.mod_ModuleName == 'mc_Door01' && this.mod_DoorDirection == 'Right') {
          Hinge.setOrigin(this.mod_Width, (Math.round(hingePositions[i] * 100) / 100), 0);
          partPosition = carcasePartInfo.VerticalPartsPosZ[1];
          partDepth = carcasePartInfo.VerticalPartsDimZ[1];
        }
        else if (this.mod_ModuleName == 'mc_Fliplift01' && this.mod_FrontType == 'FlipliftUp') {
          Hinge.setOrigin((Math.round(hingePositions[i] * 100) / 100), this.mod_Height, 0);
          partPosition = carcasePartInfo.HorizontalPartsPosZ[1];
          partDepth = carcasePartInfo.HorizontalPartsDimZ[1];
        }
        else if (this.mod_ModuleName == 'mc_Fliplift01' && this.mod_FrontType == 'FlipliftDown') {
          Hinge.setOrigin((Math.round(hingePositions[i] * 100) / 100), 0, 0);
          partPosition = carcasePartInfo.HorizontalPartsPosZ[0];
          partDepth = carcasePartInfo.HorizontalPartsDimZ[0];
        }
        else { 
          throw new Error('Module name is unknown. Could not define the positioning of the hinges.');
        }

        // Pass the hinge information to the HingeDetails attribute
        let HingeDetails: any = {
          HingeType: hingeData.HingeType,
          MountingPlateType: hingeData.MountingPlateType,
          MountingPlateHeight: hingeData.MountingPlateHeight,
          FrontOverlay: hingeData.FrontOverlay,
          DrillingDistance: hingeData.DrillingDistance,
          FrontHardwareItem: hingeData.FrontHardwareItem,
          FrontProcessingItem: hingeData.FrontProcessingItem,
          FrontGraphic: hingeData.FrontGraphic,
          CarcaseHardwareItem: hingeData.CarcaseHardwareItem,
          CarcaseProcessingItem: hingeData.CarcaseProcessingItem,
          CarcaseGraphic: hingeData.CarcaseGraphic,
          CarcaseFrontAngle: hingeData.CarcaseFrontAngle,
          HingeGapCarcase: hingeData.HingeGapCarcase,
          //FrontGapCarcase: this.mod_FrontGapCarcase,
          FrontGapCarcase: this.mod_Originpos[2] - (partPosition + partDepth), // New calculation, for the cases in which there's a offset in nthe part that receives the MountingPlate
          OpeningAngle: hingeData.OpeningAngle
        };

        let strJson = JSON.stringify(HingeDetails);
        Hinge.mod_HingeInfo.push(strJson);
        this.mod_HingeInfo.push(strJson);

        let OpeningAngle: any = {
          Angle: hingeData.OpeningAngle
        }
        let strJsonOpeningAngle = JSON.stringify(OpeningAngle);
        this.mod_OpeningAngle.push(strJsonOpeningAngle);

      }
    }
  }
  // Failed to insert the Hinges (throw the exception)
  catch (error: any) {
    logError(GlobalFunc.find_ErrorList('Error 22032', 1).Message(error.message));
  }



