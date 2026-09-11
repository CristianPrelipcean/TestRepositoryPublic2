
  //===================================================
  //          Create part for the graphics
  //===================================================

  try {
    
    // Define Variables

    let descriptorPositions: number[] = [];

    if (this.mod_DrillinglineLogic == 'Descriptor') {
      if (this.mod_TypeElement_matrix.PartView == 'ShelfView') {
        if (this.mod_DrillSide == "Front" || this.mod_DrillSide == "Back") {
          descriptorPositions = GlobalFunc.process_Descriptor(this.mod_DrillHorLengthDescriptor, this.mod_Length);
        }
        else {
          descriptorPositions = GlobalFunc.process_Descriptor(this.mod_DrillHorLengthDescriptor, this.mod_Width);
        }
      }
      else if (this.mod_TypeElement_matrix.PartView == 'FrontView') {
        if (this.mod_DrillSide == "Top" || this.mod_DrillSide == "Btm") {
          descriptorPositions = GlobalFunc.process_Descriptor(this.mod_DrillHorLengthDescriptor, this.mod_Length);
        }
        else {
            descriptorPositions = GlobalFunc.process_Descriptor(this.mod_DrillHorLengthDescriptor, this.mod_Width);
        }
      }
      else {
        if (this.mod_DrillSide == "Front" || this.mod_DrillSide == "Back") {
          descriptorPositions = GlobalFunc.process_Descriptor(this.mod_DrillHorLengthDescriptor, this.mod_Length);
        }
        else {
          descriptorPositions = GlobalFunc.process_Descriptor(this.mod_DrillHorLengthDescriptor, this.mod_Width);
        }
      }
    }

  let descriptorWidthPositions: number[] = GlobalFunc.process_Descriptor(this.mod_DrillHorWidthDescriptor, this.mod_Thickness);

  let descriptorWidthLength: number = GlobalFunc.process_Descriptor(this.mod_DrillHorWidthDescriptor, this.mod_Thickness).length;


    let DrillData = GlobalFunc.find_ProcessingDrillHorCalculation(
      this.mod_TypeElement_matrix.PartView,
      this.mod_DrillSide,
      this.mod_ProcessingBasePoint,
      this.mod_DrillinglineLogic,
    );

    if (!DrillData) {
      return;
    }

    // Loop for the drills
    for (let i = 0; i < DrillData.Drills(this); i++) {

      for (let j = 0; j < descriptorWidthLength; j++) {

        //Check Drill Positions
        if (DrillData.PosX(this, i, descriptorPositions[i], descriptorWidthPositions[j]) < DrillData.MinPositionX(this) || DrillData.PosX(this, i, descriptorPositions[i], descriptorWidthPositions[j]) > DrillData.MaxPositionX(this)) {

          let Text = '';
          let ErrorMessage = GlobalFunc.find_ErrorList('Error 21008', 1);
          logError(ErrorMessage.Message(Text));
        }

        if (DrillData.PosY(this, i, descriptorPositions[i], descriptorWidthPositions[j]) < DrillData.MinPositionY(this) || DrillData.PosY(this, i, descriptorPositions[i], descriptorWidthPositions[j]) > DrillData.MaxPositionY(this)) {

          let Text = '';
          let ErrorMessage = GlobalFunc.find_ErrorList('Error 21008', 1);
          logError(ErrorMessage.Message(Text));
        }

        if (DrillData.PosZ(this, i, descriptorPositions[i], descriptorWidthPositions[j]) < DrillData.MinPositionZ(this) || DrillData.PosZ(this, i, descriptorPositions[i], descriptorWidthPositions[j]) > DrillData.MaxPositionZ(this)) {

          let Text = '';
          let ErrorMessage = GlobalFunc.find_ErrorList('Error 21008', 1);
          logError(ErrorMessage.Message(Text));
        }

        // Create and Set the Graphic
        let elemGraphics = this.addpart_ProcessingGraphics(
          DrillData.GraphicPosX(this, i, descriptorPositions[i],descriptorWidthPositions[j]),
          DrillData.GraphicPosY(this, i, descriptorPositions[i],descriptorWidthPositions[j]), 
          DrillData.GraphicPosZ(this, i, descriptorPositions[i],descriptorWidthPositions[j]),
          DrillData.GraphicDimX(this),
          DrillData.GraphicDimY(this),
          DrillData.GraphicDimZ(this)
        );
        // Set svgPath
        let svgPath = '<svg><circle cx="' + DrillData.cx(this) + '" cy="' + DrillData.cy(this) + '" r="' + DrillData.r(this) + '" /></svg>';
        elemGraphics.extrude(svgPath, DrillData.GraphicExtrusion!)

        // Get the processing Color
        GlobalFunc.process_AddMaterial(elemGraphics, 'Processing', 'None', this.g.basic_ProcessingColor);

        // Create Touch part
        let elemDrill = this.addpart_DrillHor(
          DrillData.PosX(this, i, descriptorPositions[i],descriptorWidthPositions[j]),
          DrillData.PosY(this, i, descriptorPositions[i],descriptorWidthPositions[j]),
          DrillData.PosZ(this, i, descriptorPositions[i],descriptorWidthPositions[j]),
          DrillData.DimX(this),
          DrillData.DimY(this),
          DrillData.DimZ(this)
        );

        // Passing Information on part level
        elemDrill.pa_DrillQty = DrillData.Drills(this);
        elemDrill.pa_Diameter = this.mod_Diameter;
        elemDrill.pa_DrillDepth = this.mod_DrillDepth;
        elemDrill.pa_DrillHorWidthDescriptor = GlobalFunc.process_Descriptor(this.mod_DrillHorWidthDescriptor, this.mod_Thickness)[j];

        //} //Disabled because we are not controlling if the drill is outside the part
      }
    }
    
  }
  
  // Log the error and stop execution if any function call fails
  catch (error: any) {

    let ErrorMessage = GlobalFunc.find_ErrorList('Error 22002', 1);
    logError(ErrorMessage.Message(error.message));
    return;
  }