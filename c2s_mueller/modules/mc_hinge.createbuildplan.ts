  // Schuler Consulting
  // Create: May 2024
  // By Henning Wiesbrock
  // Purpose: PartLibrary
  //
  // Description:
  // CreateBuildPlan mc_Hinge
  // Find the hinge object
  // Get the information of the drillings 
  // Insert part for the graphics
  // Add drilling part for nc-data
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //         Find the object
  //===================================================

  let tablevalue = GlobalFunc.find_HingeMapping(this.mod_Supplier, this.mod_HingeProgram, this.mod_MountingType);

  if (!tablevalue) {
    logError('Hinge mapping not found for supplier/program/mounting type.');
    return;
  }

  let HingeObjectMapping = tablevalue.HingeObject;

  // Check front thickness
  if (this.mod_Thickness < tablevalue.FrontThkMin || this.mod_Thickness > tablevalue.FrontThkMax) {
    logError('Front thickness is out of range for this hinge! Minimum thickness of the front is: ' + tablevalue.FrontThkMin + ', and maximum thickness of the front is: ' + tablevalue.FrontThkMax);
  }

  // Check hinge drilling distance
  if (this.mod_HingeDrillingDistance < tablevalue.HingeDrillingDistanceMin || this.mod_HingeDrillingDistance > tablevalue.HingeDrillingDistanceMax) {
    logError('Hinge drilling distance is out of range for this hinge! Minimum hinge drilling distance is: ' + tablevalue.HingeDrillingDistanceMin + ', and maximum hinge drilling distance is: ' + tablevalue.HingeDrillingDistanceMax);
  }

  //===================================================
  //          Find the quantity of the Hinges and Position
  //===================================================

  let HingePosLogic = this.mod_HingePosLogic;
  let HingeDescriptor = 'None';
  let Positions: number[] = [];

  if (HingePosLogic == 'Table') {
    let posTableValue = GlobalFunc.find_HingePosition(this.mod_Program, this.mod_Width, this.mod_Length);
    if (!posTableValue) {
      logError('Hinge position mapping not found for program/width/length.');
      return;
    }
    HingeDescriptor = posTableValue.HingeDescriptor!;
    // TODO: Prüfen, ob hier Positions auch befüllt werden muss
  } else if (HingePosLogic == 'AttributeDescriptor') {
    HingeDescriptor = this.mod_HingeDescriptor;
  }

  // In jedem Fall Positions füllen
  Positions = GlobalFunc.process_Descriptor(HingeDescriptor, this.mod_Width);
  if (!Positions || Positions.length === 0) {
    logError('No hinge positions returned from descriptor processing.');
    return;
  }

  //===================================================
  //          Get the information of the drillings 
  //===================================================

  if (!HingeObjectMapping) {
    logError('HingeObjectMapping is undefined or null.');
    return;
  }

  let HingeDrillObject = GlobalFunc.find_ObjectMapping(HingeObjectMapping);
  if (!HingeDrillObject || !HingeDrillObject.ProcessingItem) {
    logError('HingeDrillObject or its ProcessingItem is undefined.');
    return;
  }

  let HingeDrillItem = GlobalFunc.find_ProcessingMapping(HingeDrillObject.ProcessingItem!);
  if (!HingeDrillItem || HingeDrillItem.length === 0) {
    logError('No processing mappings found for hinge drill object.');
    return;
  }

  //===================================================
  //          Calculations for the drills
  //===================================================

  Positions.forEach(Position => {
    HingeDrillItem.forEach(drilltype => {
      if (drilltype.ProcessingLibrary == 'DrillVertical') {
        let hingedrills = GlobalFunc.find_HardwareDrillVertLibrary(drilltype.ProcessingId!, 'Fronts');
        if (!hingedrills || hingedrills.length === 0) {
          logError('No hardware drill vertical library entries found for ProcessingId: ' + drilltype.ProcessingId);
          return;
        }
        hingedrills.forEach(drill => {

          let XCoord = 0;
          if (this.mod_OpeningDirection == 'Left') {
            XCoord = drill.XA! + this.mod_HingeDrillingDistance;
          } else {
            XCoord = this.mod_Length - drill.XA! - this.mod_HingeDrillingDistance;
          }

          let YCoord = Position + drill.YA!;

          // Initialize drill flag
          let Drill = true;

          // Check if the drill in x-direction is on the board
          if (XCoord - drill.DU! / 2 <= 0 || XCoord + drill.DU! / 2 >= this.mod_Length) {
            Drill = false;
          }

          // Check if the drill in y-direction is on the board
          if (YCoord - drill.DU! / 2 <= 0 || YCoord + drill.DU! / 2 >= this.mod_Width) {
            Drill = false;
          }

          if (Drill) {
            // Insert part for the graphics
            let elemGraphics = this.addpart_ProcessingGraphics(XCoord, YCoord, -0.5, drill.DU! / 2, drill.DU! / 2, drill.TI!);
            if (!elemGraphics) {
              logError('Failed to create processing graphics part.');
              return;
            }
            let svgPath = '<svg><circle cx="0" cy="0" r="' + drill.DU! / 2 + '" /></svg>';
            elemGraphics.extrude(svgPath, 'z');

            // Add processing color
            GlobalFunc.process_AddMaterial(elemGraphics, 'Processing', 'None', this.g.basic_ProcessingColor);

            // Add drilling part for nc-data
            let elemDrill = this.addpart_DrillVert(XCoord, YCoord, -1, 1, 1, 1);
            if (!elemDrill) {
              logError('Failed to create drilling part.');
              return;
            }
            elemDrill.pa_ProcessingTableData = drill;
            elemDrill.pa_Diameter = drill.DU;
            elemDrill.pa_DrillDepth = drill.TI;
            elemDrill.pa_DrillQty = Position;

          } else {
            logError('At least one drill is outside of the board and was blocked. X:' + XCoord + ' Y:' + YCoord);
          }
        });
      }
    });
  });