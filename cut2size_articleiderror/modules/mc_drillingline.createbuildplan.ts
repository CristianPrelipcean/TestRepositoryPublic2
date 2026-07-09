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

//Variables
let accumulatedDistance: number = 0;
let maxDistance: number = 0;
let PosOrientation: number = 0;
let Drills: number = 0;
let BasePosX: number = 0;
let BasePosY: number = 0;

// Change Processing Base Point
if (this.mod_ProcessingBasePoint == 'LeftBack') {
  BasePosX = this.mod_PositionX
  BasePosY = this.mod_PositionY
}
else if(this.mod_ProcessingBasePoint == 'LeftFront') {
  BasePosX = this.mod_PositionX
  BasePosY = this.mod_Width - this.mod_PositionY
}
else if (this.mod_ProcessingBasePoint == 'RightFront') {
  BasePosX = this.mod_Length-this.mod_PositionX
  BasePosY = this.mod_Width-this.mod_PositionY
}
else if (this.mod_ProcessingBasePoint == 'RightBack') {
  BasePosX = this.mod_Length-this.mod_PositionX
  BasePosY = this.mod_PositionY
}

// Drill orientation
if (this.mod_ProcessingOrientation == 'Across') {
  maxDistance = this.mod_Width;
  PosOrientation = this.mod_PositionY;
} else if (this.mod_ProcessingOrientation == 'Along') {
  maxDistance = this.mod_Length;
  PosOrientation = this.mod_PositionX;
}

// System of the drilling line
if (this.mod_DrillinglineLogic == 'DrillQty') {
    Drills = this.mod_DrillQty;
}

else if (this.mod_DrillinglineLogic == 'DrillingLength') {
    Drills = (Math.floor(this.mod_DrillinglineLength/this.mod_DrillingDistance) + 1);
}

// Loop for the drills

for (let i = 0; i < Drills; i++) {
  accumulatedDistance = PosOrientation + this.mod_Diameter / 2 + i * this.mod_DrillingDistance;

  if (accumulatedDistance <= maxDistance) {
    let xCoord = 0;
    let yCoord = 0;

    if (this.mod_ProcessingBasePoint == 'LeftBack' && this.mod_ProcessingOrientation == 'Across') {
      xCoord = -this.mod_Diameter / 2 + BasePosX;
      yCoord = -this.mod_Diameter / 2 + BasePosY + i * this.mod_DrillingDistance;
    }
    else if (this.mod_ProcessingBasePoint == 'LeftBack' && this.mod_ProcessingOrientation == 'Along') {
      xCoord = -this.mod_Diameter / 2 + BasePosX + i * this.mod_DrillingDistance;
      yCoord = -this.mod_Diameter / 2 + BasePosY;
    }
    else if (this.mod_ProcessingBasePoint == 'LeftFront' && this.mod_ProcessingOrientation == 'Across') {
      xCoord = -this.mod_Diameter / 2 + BasePosX;
      yCoord = -this.mod_Diameter / 2 + BasePosY - i * this.mod_DrillingDistance;
    }
    else if (this.mod_ProcessingBasePoint == 'LeftFront' && this.mod_ProcessingOrientation == 'Along') {
      xCoord = -this.mod_Diameter / 2 + BasePosX + i * this.mod_DrillingDistance;
      yCoord = -this.mod_Diameter / 2 + BasePosY;
    }
    else if (this.mod_ProcessingBasePoint == 'RightFront' && this.mod_ProcessingOrientation == 'Across') {
      xCoord = -this.mod_Diameter / 2 + BasePosX;
      yCoord = -this.mod_Diameter / 2 + BasePosY - i * this.mod_DrillingDistance;
    }
    else if (this.mod_ProcessingBasePoint == 'RightFront' && this.mod_ProcessingOrientation == 'Along') {
      xCoord = -this.mod_Diameter / 2 + BasePosX - i * this.mod_DrillingDistance;
      yCoord = -this.mod_Diameter / 2 + BasePosY;
    }
    else if (this.mod_ProcessingBasePoint == 'RightBack' && this.mod_ProcessingOrientation == 'Across') {
      xCoord = -this.mod_Diameter / 2 + BasePosX;
      yCoord = -this.mod_Diameter / 2 + BasePosY + i * this.mod_DrillingDistance;
    }
    else if (this.mod_ProcessingBasePoint == 'RightBack' && this.mod_ProcessingOrientation == 'Along') {
      xCoord = -this.mod_Diameter / 2 + BasePosX - i * this.mod_DrillingDistance;
      yCoord = -this.mod_Diameter / 2 + BasePosY;
    }

    // DrillSide Top

    if (this.mod_DrillSide == 'Top') {

      // Create and Set the Graphic
      let elemGraphics = this.addpart_ProcessingGraphics(xCoord, 0, yCoord, this.mod_Diameter, -this.mod_DrillDepth, this.mod_Diameter);
      let svgPath = '<svg><circle cx="' + this.mod_Diameter / 2 + '" cy="' + this.mod_Diameter / 2 + '" r="' + this.mod_Diameter / 2 + '" /></svg>';
      elemGraphics.extrude(svgPath, 'y');

      // Create Output
      if (i == 0) {
        let elemDrill = this.addpart_DrillingLine(xCoord + (this.mod_Diameter / 2), 0, yCoord + (this.mod_Diameter / 2), this.mod_Diameter, this.mod_DrillDepth, this.mod_Diameter);
        elemDrill.pa_DrillQty = Drills;
      }
    }
  

  // DrillSide Bottom

    if (this.mod_DrillSide == 'Btm') {

      // Create and Set the Graphic
      let elemGraphics = this.addpart_ProcessingGraphics(xCoord, -this.mod_Thickness, yCoord, this.mod_Diameter, this.mod_DrillDepth, this.mod_Diameter);
      let svgPath = '<svg><circle cx="' + this.mod_Diameter / 2 + '" cy="' + this.mod_Diameter / 2 + '" r="' + this.mod_Diameter / 2 + '" /></svg>';
      elemGraphics.extrude(svgPath, 'y');

      // Create Output
      if (i == 0) {
        let elemDrill = this.addpart_DrillingLine(xCoord + (this.mod_Diameter / 2), this.mod_Thickness, yCoord + (this.mod_Diameter / 2), this.mod_Diameter, this.mod_DrillDepth, this.mod_Diameter);
        elemDrill.pa_DrillQty = Drills;
      }
    }
  }
}