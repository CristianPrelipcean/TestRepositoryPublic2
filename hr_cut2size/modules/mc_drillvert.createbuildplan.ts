 // Schuler Consulting
  // Create: May 2024
  // By Henning Wiesbrock
  // Purpose: PartLibrary
  //
  // Description:
  // CreateBuildPlan mc_Panel
  // part of the panels
  //
  // Revisions:
  //
  //===================================================

  //===================================================
  //          Create part for the graphics
  //===================================================

  try {

    // Define Variables
    
    let descriptorPositions: number[] = [];

    if (this.mod_DrillinglineLogic == 'Descriptor') {

      if (this.mod_ProcessingOrientation == 'Across') {

        descriptorPositions = GlobalFunc.process_Descriptor(this.mod_DrillVertDescriptor, this.mod_Width);
      }

      else {
        descriptorPositions = GlobalFunc.process_Descriptor(this.mod_DrillVertDescriptor, this.mod_Length);;
      }

    }
    
        let DrillData = GlobalFunc.find_ProcessingDrillingsCalculation(
          this.mod_TypeElement_matrix.PartView,
          this.mod_DrillSide,
          this.mod_ProcessingBasePoint,
          this.mod_ProcessingOrientation,
          this.mod_DrillinglineLogic,
          this.mod_DrillEntireThk
        );
    
        if (!DrillData) {
          return;
        }
    
        // Loop for the drills
      for (let i = 0; i < DrillData.Drills(this); i++) {


            // Create and Set the Graphic
            let elemGraphics = this.addpart_ProcessingGraphics(
              DrillData.GraphicPosX(this, i, descriptorPositions[i]),
              DrillData.GraphicPosY(this, i, descriptorPositions[i]),
              DrillData.GraphicPosZ(this, i, descriptorPositions[i]),
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
            let elemDrill = this.addpart_DrillVert(
              DrillData.PosX(this, i, descriptorPositions[i]), 
              DrillData.PosY(this, i, descriptorPositions[i]), 
              DrillData.PosZ(this, i, descriptorPositions[i]), 
              DrillData.DimX(this), 
              DrillData.DimY(this), 
              DrillData.DimZ(this)
              );
    
            // Passing Information on part level
            elemDrill.pa_DrillQty = DrillData.Drills(this);
            elemDrill.pa_Diameter = this.mod_Diameter;
            elemDrill.pa_DrillDepth = this.mod_DrillEntireThk ? this.mod_Thickness : (this.mod_DrillDepth >= this.mod_Thickness ? this.mod_Thickness : this.mod_DrillDepth);
    
          //} //Disabled because we are not controlling if the drill is outside the part
      }
    }
      // Log the error and stop execution if any function call fails
      catch (error:any) {
    
        let ErrorMessage = GlobalFunc.find_ErrorList('Error 22002', 1);
        logError(ErrorMessage.Message(error.message));
        return;
      }