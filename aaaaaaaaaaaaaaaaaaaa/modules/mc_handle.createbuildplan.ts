// // Schuler Consulting
// // Create: May 2024
// // By Henning Wiesbrock
// // Purpose: PartLibrary
// //
// // Description:
// // CreateBuildPlan mc_Panel
// // Calculations for first drill
// // Insert part for the graphics
// // Add drilling part for nc-data
// //

  try {

  let DrillQty = this.mod_DrillQty;

// Calculate HandleDrillDepth
  let HandleDrillDepth = this.mod_DrillEntireThk ? this.mod_Thickness : this.mod_DrillDepth;

// // Calculate the HandleLength
  let HandleLength = (this.mod_DrillQty - 1) * this.mod_DrillingDistance;


  const openingDirection = this.mod_OpeningDirection  
  let horizontalPosition = ""

  // set position of Drills for Handle depending on opending Direction of the Door

  if (openingDirection == "Left") {
    horizontalPosition = "Right"
  } else if (openingDirection == "Right") {
    horizontalPosition = "Left"
  } else {
    horizontalPosition = "Center"
  }

  // let openingDirection = this.mod_OpeningDirection
  let handleVerticalPosition = this.mod_HandlePosMatrix
  let handleOrientation = this.mod_HandleOrientation
  let basePoint = ""
  let orientation = ""


  // Set basepoint for tab_ProcessingDrillVertCalculation depending on 
  // openingDirection and handle position on vertical axis

  if (openingDirection == "Left" && handleVerticalPosition == "Top") {
    basePoint = "RightTop";
  } else if (openingDirection == "Left" && handleVerticalPosition == "Bottom") {
    basePoint = "RightBtm";
  } else if (openingDirection == "Right" && handleVerticalPosition == "Top") {
    basePoint = "LeftTop";
  } else if (openingDirection == "Right" && handleVerticalPosition == "Bottom")
    basePoint = "LeftBtm";
  else {
    basePoint = "LeftBtm";
    }

    //translate orientation of the drills from horizontal or vertical 
    // to along and across for later use in tab_ProcessingDrillVertCalculation
  if (handleOrientation == "Hor") {
    orientation = "Along"
  } else {
    orientation = "Across"
  }

  let DrillData = GlobalFunc.find_ProcessingDrillVertCalculation(
    "FrontView",
    this.mod_DrillSide,
    basePoint,
    orientation,
    this.mod_DrillinglineLogic,
    this.mod_DrillEntireThk
  );

  if (!DrillData) {
    return;
  }
    

      // Loop for the drills

  for (let i = 0; i < DrillQty; i++) {
        //     Check Drill Positions
        if (DrillData.PosX(this, i, 0) < DrillData.MinPositionX(this) || DrillData.PosX(this, i, 0) > DrillData.MaxPositionX(this)) {

          let Text = '';
          let ErrorMessage = GlobalFunc.find_ErrorList('Error 21004', 1);
          logError(ErrorMessage.Message(Text));
          
        }

        if (DrillData.PosY(this, i, 0) < DrillData.MinPositionY(this) || DrillData.PosY(this, i, 0) > DrillData.MaxPositionY(this)) {

          let Text = '';
          let ErrorMessage = GlobalFunc.find_ErrorList('Error 21004', 1);
          logError(ErrorMessage.Message(Text));
          
        }

        if (DrillData.PosZ(this, i, 0) < DrillData.MinPositionZ(this) || DrillData.PosZ(this, i, 0) > DrillData.MaxPositionZ(this)) {

          let Text = '';
          let ErrorMessage = GlobalFunc.find_ErrorList('Error 21004', 1);
          logError(ErrorMessage.Message(Text));
          
        }

    // Create and Set the Graphic
    let elemGraphics;
    let elemDrill
    let xCoord: number = 0;
    let yCoord: number = 0;
        

    if (horizontalPosition == "Left") {
      if (this.mod_HandleOrientation == 'Vert' && this.mod_HandlePosMatrix == 'Center') {
        xCoord = this.mod_PositionX - this.mod_Diameter /2;
        yCoord = this.mod_Width / 2 - HandleLength / 2 - this.mod_Diameter / 2 + this.mod_DrillingDistance * i ;
      } else if (this.mod_HandleOrientation == 'Hor' && this.mod_HandlePosMatrix == 'Center') {
        xCoord = this.mod_PositionX - this.mod_Diameter / 2 + this.mod_DrillingDistance * i;
        yCoord = this.mod_Width / 2 - this.mod_Diameter;
      };

    } else if (horizontalPosition == "Right"){
      if (this.mod_HandleOrientation == 'Vert' && this.mod_HandlePosMatrix == 'Center') {
        xCoord = this.mod_Length - this.mod_PositionX - this.mod_Diameter /2;
        yCoord = ((this.mod_Width / 2) + HandleLength / 2) - this.mod_Diameter / 2 - this.mod_DrillingDistance * i;
      } else if (this.mod_HandleOrientation == 'Hor' && this.mod_HandlePosMatrix == 'Center') {
        xCoord = this.mod_Length - this.mod_PositionX - this.mod_Diameter / 2 - this.mod_DrillingDistance * i;
        yCoord = this.mod_Width / 2 - this.mod_Diameter / 2;
      }
      
    } else {
        if (this.mod_HandleOrientation == 'Vert' && this.mod_HandlePosMatrix == 'Top') {
            xCoord = this.mod_Length / 2 - this.mod_Diameter / 2;
            yCoord = this.mod_Width - this.mod_PositionY - this.mod_Diameter / 2 - this.mod_DrillingDistance * i ;
        } else if (this.mod_HandleOrientation == 'Hor' && this.mod_HandlePosMatrix == 'Top') {
            xCoord = this.mod_Length / 2 - HandleLength / 2 - this.mod_Diameter / 2 + this.mod_DrillingDistance * i ;
            yCoord = this.mod_Width - this.mod_PositionY - this.mod_Diameter/2;
        } else if (this.mod_HandleOrientation == 'Vert' && this.mod_HandlePosMatrix == 'Bottom') {
            xCoord = this.mod_Length / 2 - this.mod_Diameter / 2;
            yCoord = this.mod_PositionY - this.mod_Diameter / 2 + this.mod_DrillingDistance * i ;
        } else if (this.mod_HandleOrientation == 'Hor' && this.mod_HandlePosMatrix == 'Bottom') {
            xCoord = this.mod_Length / 2 - HandleLength / 2 - this.mod_Diameter / 2 + this.mod_DrillingDistance * i;
            yCoord = this.mod_PositionY - this.mod_Diameter /2;
        } else if (this.mod_HandleOrientation == 'Vert' && this.mod_HandlePosMatrix == 'Center') {
            xCoord = this.mod_Length / 2 - this.mod_Diameter / 2;
            yCoord = this.mod_Width / 2 - HandleLength / 2 - this.mod_Diameter / 2 + this.mod_DrillingDistance * i;
        } else if (this.mod_HandleOrientation == 'Hor' && this.mod_HandlePosMatrix == 'Center') {
            xCoord = this.mod_Length / 2 - HandleLength / 2 - this.mod_Diameter / 2 + this.mod_DrillingDistance * i;
            yCoord = this.mod_Width / 2 - this.mod_Diameter / 2;
        }
      };  
    
    if (this.mod_HandlePosMatrix == "Center" || this.mod_OpeningDirection == "Front") {
      elemGraphics = this.addpart_ProcessingGraphics(
        xCoord,
        yCoord,
        DrillData.GraphicPosZ(this, i, 0),
        DrillData.GraphicDimX(this),
        DrillData.GraphicDimY(this),
        DrillData.GraphicDimZ(this)
      );
    } else {
      elemGraphics = this.addpart_ProcessingGraphics(
        DrillData.GraphicPosX(this, i, 0),
        DrillData.GraphicPosY(this, i, 0),
        DrillData.GraphicPosZ(this, i, 0),
        DrillData.GraphicDimX(this),
        DrillData.GraphicDimY(this),
        DrillData.GraphicDimZ(this)
      );
    }

                 
  // Set svgPath
    let svgPath = '<svg><circle cx="' + DrillData.cx(this) + '" cy="' + DrillData.cy(this) + '" r="' + DrillData.r(this) + '" /></svg>';
    elemGraphics.extrude(svgPath, DrillData.GraphicExtrusion!)
    
  // Get the processing Color
    GlobalFunc.process_AddMaterial(elemGraphics, 'Processing', 'None', this.g.basic_ProcessingHandleDrillColor)


      // //===================================================
      // //          Add drilling part for nc-data
      // //===================================================
  
    if (this.mod_HandlePosMatrix == "Center" || this.mod_OpeningDirection == "Front") {
      elemDrill = this.addpart_DrillVert(
        xCoord,
        yCoord,
        DrillData.PosZ(this, i, 0),
        DrillData.DimX(this),
        DrillData.DimY(this),
        DrillData.DimZ(this)
      );
    } else {
      elemDrill = this.addpart_DrillVert(
        DrillData.PosX(this, i, 0),
        DrillData.PosY(this, i, 0),
        DrillData.PosZ(this, i, 0),
        DrillData.DimX(this),
        DrillData.DimY(this),
        DrillData.DimZ(this)
      );
    } 
      // Passing Information on part level
      elemDrill.pa_DrillQty = DrillQty;
      elemDrill.pa_Diameter = this.mod_Diameter;
      elemDrill.pa_DrillDepth = this.mod_DrillEntireThk ? this.mod_Thickness : (this.mod_DrillDepth >= this.mod_Thickness ? this.mod_Thickness : this.mod_DrillDepth);  
    } 
  }
      // Log the error and stop execution if any function call fails
  catch (error:any) {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 21011', 1);
    logError(ErrorMessage.Message(error.message));
    return;
}