// Schuler Consulting
// Create: June 2024
// By Henning Wiesbrock
// Purpose: PartLibrary
//
// Description:
// CreateBuildPlan mc_Drill
// part of the panels
//
// Revisions:
// Create: 
// by 
//===================================================

//===================================================
//          Create part for the graphics
//===================================================

//Variables
let BasePosX = 0;
let BasePosY = 0;
let BasePosZ = 0;

// Check the PartType for DrillSide
  if (this.mod_PartType == 'Front' || this.mod_PartType == 'Backwall' && this.mod_DrillSide == 'Front' || this.mod_DrillSide == 'Back') {

  // Calculate drill depth 
  let DrillDepth = this.mod_DrillEntireThk ? this.mod_Thickness : this.mod_DrillDepth;
 
  // Select drill side
  BasePosZ = this.mod_DrillSide == 'Front' ? this.mod_Thickness - DrillDepth : 0;

  // Change Processing Base Point
  // DrillSide == Front
  if (this.mod_ProcessingBasePoint == 'LeftBtm' && this.mod_DrillSide == 'Front') {
    BasePosX = this.mod_PositionX;
    BasePosY = this.mod_PositionY;
  }
  else if (this.mod_ProcessingBasePoint == 'RightBtm' && this.mod_DrillSide == 'Front') {
    BasePosX = this.mod_Width - this.mod_PositionX;
    BasePosY = this.mod_PositionY;
  }
  else if (this.mod_ProcessingBasePoint == 'RightTop' && this.mod_DrillSide == 'Front') {
    BasePosX = this.mod_Width - this.mod_PositionX;
    BasePosY = this.mod_Height - this.mod_PositionY;
  }
  else if (this.mod_ProcessingBasePoint == 'LeftTop' && this.mod_DrillSide == 'Front') {
    BasePosX = this.mod_PositionX;
    BasePosY = this.mod_Height - this.mod_PositionY;
  }

  // DrillSide == Back
  if (this.mod_ProcessingBasePoint == 'LeftBtm' && this.mod_DrillSide == 'Back') {
    BasePosX = this.mod_Width - this.mod_PositionX;
    BasePosY = this.mod_PositionY;
  }
  else if (this.mod_ProcessingBasePoint == 'RightBtm' && this.mod_DrillSide == 'Back') {
    BasePosX = this.mod_PositionX;
    BasePosY = this.mod_PositionY;
  }
  else if (this.mod_ProcessingBasePoint == 'RightTop' && this.mod_DrillSide == 'Back') {
    BasePosX = this.mod_PositionX;
    BasePosY = this.mod_Height - this.mod_PositionY;
  }
  else if (this.mod_ProcessingBasePoint == 'LeftTop' && this.mod_DrillSide == 'Back') {
    BasePosX = this.mod_Width - this.mod_PositionX;
    BasePosY = this.mod_Height - this.mod_PositionY;
  }

  //===================================================
  //          Insert part for the graphics
  //===================================================

  // Variables
  let drill = true;

  // Check if the drill in x-direction is on the board, if not block the drilling
  if(BasePosX - this.mod_Diameter/2 <= 0 || BasePosX + this.mod_Diameter/2 >= this.mod_Width){
    drill = false;
  }

  // Check if the drill in y-direction is on the board, if not block the drilling
  if(BasePosY - this.mod_Diameter/2 <= 0 || BasePosY + this.mod_Diameter/2 >= this.mod_Height){
    drill = false;
  }

  let elemGraphics = this.addpart_ProcessingGraphics(BasePosX, BasePosY, BasePosZ, this.mod_Diameter,this.mod_Diameter, DrillDepth);
  let svgPath = '<svg><circle cx="' + 0 + '" cy="' + 0 + '" r="' + this.mod_Diameter / 2 + '" /></svg>';
  elemGraphics.extrude(svgPath, 'z');

  //===================================================
  //          Add drilling part for nc-data
  //===================================================

  // All drills are on the board
  if(drill){

    // BasePosZ for the drill
    BasePosZ = this.mod_DrillSide == 'Front' ? this.mod_Thickness : -1;

    // Add the part (to get the touch for nc-data)
    let elemDrill = this.addpart_DrillVert(BasePosX, BasePosY, BasePosZ, 1, 1, 1);

    // Set attributes of the part
    elemDrill.pa_DrillDepth = DrillDepth;
    elemDrill.pa_Diameter = this.mod_Diameter;
  }

  // One drill is outside of the board, throw an error
  else{
    logError('Single drill is blocked, the drill is outside of the board!')
  }
}
else {
  logError('Single drill is blocked! It is only allowed that drill side is "Front" and "Back"')
}



