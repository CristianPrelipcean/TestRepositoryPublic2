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

    let DrillData = GlobalFunc.find_ProcessingDrillingsCalaculation(
      'DrillVert',
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
      let accumulatedDistance = DrillData.PosOrientation(this) + this.mod_Diameter / 2 + i * this.mod_DrillingDistance;

      if (accumulatedDistance <= DrillData.DrillingLineDistanceMax(this)) {

        // Create and Set the Graphic
        let elemGraphics = this.addpart_ProcessingGraphics(
          DrillData.GraphicPosX(this,i),
          DrillData.GraphicPosY(this,i),
          DrillData.GraphicPosZ(this,i),
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
          let elemDrill = this.addpart_DrillingLine(
            DrillData.PosX(this,i), 
            DrillData.PosY (this,i), 
            DrillData.PosZ(this,i), 
            DrillData.DimX(this), 
            DrillData.DimY(this), 
            DrillData.DimZ(this)
          );

        // Passing Information on part level
          elemDrill.pa_DrillQty = DrillData.Drills(this);
        elemDrill.pa_DrillDepth = this.mod_DrillEntireThk ? this.mod_Thickness : (this.mod_DrillDepth >= this.mod_Thickness ? this.mod_Thickness : this.mod_DrillDepth);
          /*
          elemDrill.pa_Diameter = this.mod_Diameter;
          elemDrill.pa_DrillingDistance = this.mod_DrillingDistance;
          elemDrill.pa_ProcessingBasePoint = this.mod_ProcessingBasePoint;
          elemDrill.pa_ProcessingOrientation = this.mod_ProcessingOrientation;
          */
      }
    }

  } catch (error) {
    console.error("Fehler im Bohrprozess:", error);
    // Optional: weitere Fehlerbehandlung hier ergänzen
  }