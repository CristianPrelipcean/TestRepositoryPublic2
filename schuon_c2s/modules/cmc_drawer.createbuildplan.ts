 // Homag Digital GmbH
  // Create: October 2026
  // By Henning Wiesbrock
  // Purpose: Cut2Size
  //
  // Description:
  // CreateBuildPlan cmc_Drawer
  // Find the drawer object/type
  // Get the information of the drillings
  // Insert part for the graphics
  // Add drilling part for nc-data
  //
  // Define Variables
  let data = GlobalFunc.cfind_DrawerSettings(this.cmod_DrawerBoxType, this.cmod_DrawerBoxDesign, this.cmod_DrawerBoxHeight, this.cmod_DrawerBoxMountingType);

  // Check if we can find any Data
  if (!data) {
    logError('No data in tab_DrawerSettings found for Type: ' + this.cmod_DrawerBoxType + ', Design: ' + this.cmod_DrawerBoxDesign +
      ', Height: ' + this.cmod_DrawerBoxHeight + ', Mounting Type: ' + this.cmod_DrawerBoxMountingType);
    return;
  }

  let descriptorPositions = GlobalFunc.process_Descriptor(data.DrillDescriptorY!, this.mod_Width); 

  let xPos_left = this.cmod_DrawerBoxFrontOverlayLeft + data.DrillDistanceX;
  let xPos_right = this.mod_Length - this.cmod_DrawerBoxFrontOverlayRight - data.DrillDistanceX;
  let yPos_max = descriptorPositions[descriptorPositions.length - 1] + this.cmod_DrawerBoxDrillDistBottom
  let drillDiameter = data.DrillDiameter;
  let drillRadius = data.DrillDiameter / 2;
  let drillDepth = data.DrillDepth;

// check if drillings are outside of the board
  if (xPos_left < drillRadius || xPos_left > this.mod_Length - drillRadius || xPos_right < drillRadius || xPos_right > this.mod_Length - drillRadius) {
    logError('Position of drillings in X-direction is outside the board');
    return;
  }

if (this.cmod_DrawerBoxDrillDistBottom < drillRadius || yPos_max > (this.mod_Width - drillRadius)) {
    logError('Position of drillings in Y-direction is outside the board');
    return;
  }


  // Loop for the drills on the left side
  for (let i = 0; i < descriptorPositions.length; i++) {
    descriptorPositions.forEach(position => {
      position = position + this.cmod_DrawerBoxDrillDistBottom
      // create and set Graphics
      let elemGraphics = this.addpart_ProcessingGraphics(xPos_left, position, -0.5, drillRadius, drillRadius, drillDepth);

      // Set svgPath
      let svgPath = '<svg><circle cx="0" cy="0" r="' + drillRadius + '" /></svg>';
      elemGraphics.extrude(svgPath, 'z');

      //Set processing Color
      GlobalFunc.process_AddMaterial(this, elemGraphics, 'Processing', 'None', this.g.cbasic_ProcessingDrawerDrillColor);

      //Create Touches
      let elemDrill = this.addpart_DrillVert(xPos_left-drillRadius, position-drillRadius, -drillDepth, drillDiameter, drillDiameter, drillDepth)

      elemDrill.pa_DrillQty = descriptorPositions.length;
      elemDrill.pa_Diameter = drillDiameter;    
      elemDrill.pa_DrillDepth = drillDepth;
      
    });
  };


  // // Loop for the drills on the right side

  for (let i = 0; i < descriptorPositions.length; i++) {
    descriptorPositions.forEach(position => {
      //position = position + this.mod_DrawerBoxDrillDistBottom
      position = position + this.cmod_DrawerBoxDrillDistBottom
      // create and set Graphics
      let elemGraphics = this.addpart_ProcessingGraphics(xPos_right, position, -0.5, drillRadius, drillRadius, drillDepth);

      // Set svgPath
      let svgPath = '<svg><circle cx="0" cy="0" r="' + drillRadius + '" /></svg>';
      elemGraphics.extrude(svgPath, 'z');

      //Set processing Color
      GlobalFunc.process_AddMaterial(this, elemGraphics, 'Processing', 'None', this.g.cbasic_ProcessingDrawerDrillColor);

      // Create Touches
      let elemDrill = this.addpart_DrillVert(xPos_right-drillRadius, position-drillRadius, -drillDepth, drillDiameter, drillDiameter, drillDepth)

      elemDrill.pa_DrillQty = descriptorPositions.length;
      elemDrill.pa_Diameter = drillDiameter;    
      elemDrill.pa_DrillDepth = drillDepth;
    });
  };