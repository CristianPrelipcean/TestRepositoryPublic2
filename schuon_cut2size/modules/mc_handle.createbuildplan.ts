// Schuler Consulting
// Create: May 2024
// By Henning Wiesbrock
// Purpose: PartLibrary
//
// Description:
// CreateBuildPlan mc_Panel
// Calculations for first drill
// Insert part for the graphics
// Add drilling part for nc-data
//
// Revisions:
// 
//===================================================

//===================================================
//          Calculations for first drill
//===================================================

//Variables
let DrillQty = this.mod_DrillQty;

// Calculate HandleDrillDepth
let HandleDrillDepth = this.mod_DrillEntireThk ? this.mod_Thickness : this.mod_DrillDepth;

// Calculate the HandleLength
let HandleLength = (this.mod_DrillQty - 1) * this.mod_DrillingDistance;

//Find information in tab_HandlePosConstruction
let retHandleConstr = GlobalFunc.find_HandlePosConstruction(this.mod_HandlePosMatrix, this.mod_HandlePosMatrix_matrix.PosHorizontal!, this.mod_HandlePosMatrix_matrix.PosVertical!, this.mod_HandleOrientation);

let BasePosX: number = retHandleConstr.PosX(this,HandleLength);
let BasePosY: number = retHandleConstr.PosY (this, HandleLength);

//===================================================
//          Insert part for the graphics
//===================================================

// Variables
let drill = true;

// Cycle for the quantity of drills for the handle
for (let i = 0; i < DrillQty; i++){

  // Calculate the position of each drill
  let xCoord = this.mod_HandleOrientation == 'Vert' ? BasePosX : BasePosX - (HandleLength/2) + this.mod_DrillingDistance * i;
  let yCoord = this.mod_HandleOrientation == 'Vert' ? BasePosY - (HandleLength/2) + this.mod_DrillingDistance * i : BasePosY

  // Check if the drill in x-direction is on the board, if not block the drilling
  if(xCoord <= 0 || xCoord >= this.mod_Length){
    drill = false;
  }

  // Check if the drill in y-direction is on the board, if not block the drilling
  if(yCoord <= 0 || yCoord >= this.mod_Width){
    drill = false;
  }

  // Add the graphical part (only to show the drill)
  let elemGraphics = this.addpart_ProcessingGraphics(xCoord, yCoord, this.mod_Thickness - HandleDrillDepth, this.mod_Diameter,this.mod_Diameter, HandleDrillDepth);
  let svgPath = '<svg><circle cx="' + this.mod_Diameter / 2 + '" cy="' + this.mod_Diameter / 2 + '" r="' + this.mod_Diameter / 2 + '" /></svg>';
  elemGraphics.extrude(svgPath, 'z');
}

//===================================================
//          Add drilling part for nc-data
//===================================================

// All drills are on the board
if(drill){
  // Add the part (to get the touch for nc-data)
  let elemDrill = this.addpart_HandleDrill(BasePosX, BasePosY, this.mod_Thickness, 1, 1, 1);

  // Set attributes of the part
  elemDrill.pa_DrillQty = DrillQty;
  elemDrill.pa_DrillingDistance = this.mod_DrillingDistance;
  elemDrill.pa_DrillDepth = HandleDrillDepth;
}

// One drill is outside of the board, throw an error
else{
  //logError('Drills for handle are blocked, minimum one drill is outside of the board!')
  let Text = '';
  let ErrorMessage = GlobalFunc.find_ErrorList('Error 21004', 1);
	logInfo(ErrorMessage.Message(Text));
}
