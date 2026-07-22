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

// Call table tab_HingeObjectMapping
let tablevalue = GlobalFunc.find_HingeMapping(this.mod_Supplier, this.mod_HingeProgram, this.mod_MountingType);
let HingeObjectMapping = tablevalue.HingeObject;

// Check front thickness
if (this.mod_Thickness < tablevalue.FrontThkMin || this.mod_Thickness > tablevalue.FrontThkMax){
  logError('Front thickness is out of range for this hinge! Minimum thickness of the front is: ' + tablevalue.FrontThkMin + ', and maximum thickness of the front is: ' + tablevalue.FrontThkMax);
}
// Check hinge drilling distance
if (this.mod_HingeDrillingDistance < tablevalue.HingeDrillingDistanceMin || this.mod_HingeDrillingDistance > tablevalue.HingeDrillingDistanceMax){
  logError('Hinge drilling distance is out of range for this hinge! Minimum hinge drilling distance is: ' + tablevalue.HingeDrillingDistanceMin + ', and maximum hinge drilling distance is: ' + tablevalue.HingeDrillingDistanceMax);
}

//===================================================
//          Find the quantity of the Hinges and Position
//===================================================

//Variables
let HingePosLogic = this.mod_HingePosLogic;
let HingeDescriptor = 'None';
let Positions: number []=[];

// Call table tab_HingeObjectMapping
if(HingePosLogic == 'Table') {
  let tablevalue = GlobalFunc.find_HingePosition(this.mod_Program, this.mod_PartDesign, this.mod_Height, this.mod_Width);
  HingeDescriptor = tablevalue.HingeDescriptor!;
  }

//Get the data from the Attribute
else if (HingePosLogic == 'AttributeDescriptor') {
  HingeDescriptor = this.mod_HingeDescriptor;
}

//Get the Positions of the hinges in a vector
if (HingeDescriptor == 'None'){
  if(this.mod_HingePos1 > 0){
    Positions.push(this.mod_HingePos1);
  }
  if(this.mod_HingePos2 > 0){
    Positions.push(this.mod_HingePos2);
  }
  if(this.mod_HingePos3 > 0){
    Positions.push(this.mod_HingePos3);
  }
  if(this.mod_HingePos4 > 0){
    Positions.push(this.mod_HingePos4);
  }
  if(this.mod_HingePos5 > 0){
    Positions.push(this.mod_HingePos5);
  }
  if(this.mod_HingePos6 > 0){
    Positions.push(this.mod_HingePos6);
  }
}
else{
  Positions = GlobalFunc.process_Descriptor(HingeDescriptor,this.mod_Height);
}

//===================================================
//          Get the information of the drillings 
//===================================================

//Retrieve the ProcessingId
let HingeDrillObject = GlobalFunc.find_ObjectMapping(HingeObjectMapping!);
let HingeDrillItem = GlobalFunc.find_ProcessingMapping(HingeDrillObject.ProcessingItem!);

//===================================================
//          Calculations for the drills
//===================================================

//Variables
let XCoord = 0;
let YCoord = 0;

Positions.forEach(Position=> {
  HingeDrillItem.forEach(drilltype => {
    if(drilltype.ProcessingLibrary == 'DrillVertical')
      {
        let hingedrills = GlobalFunc.find_HardwareDrillVertLibrary(drilltype.ProcessingId!,'Fronts')
        hingedrills.forEach(drill=> {

          XCoord = this.mod_FrontType == 'DoorLeft' ? drill.XA! + this.mod_HingeDrillingDistance : this.mod_Width - drill.XA! - this.mod_HingeDrillingDistance;
          YCoord = Position + drill.YA;

          // Initialize drill
          let Drill = true;

          // Check if the drill in x-direction is on the board, if not block the drilling
          if(XCoord - drill.DU/2 <= 0 || XCoord + drill.DU/2 >= this.mod_Width){
            Drill = false;
          }

          // Check if the drill in y-direction is on the board, if not block the drilling
          if(YCoord - drill.DU/2 <= 0 || YCoord + drill.DU/2 >= this.mod_Height){
            Drill = false;
          }
       
          // If all drills are on the board
          if(Drill){

            //===================================================
            //          Insert part for the graphics
            //===================================================
            let elemGraphics = this.addpart_ProcessingGraphics(XCoord, YCoord, 0, drill.DU!/2, drill.DU!/2, drill.TI!);
            let svgPath = '<svg><circle cx="' + 0 + '" cy="' + 0 + '" r="' + drill.DU!/2 + '" /></svg>';
            elemGraphics.extrude(svgPath, 'z');

            //===================================================
            //          Add drilling part for nc-data
            //===================================================
         
            // Add the part (to get the touch for nc-data)
            let elemDrill = this.addpart_DrillVert(XCoord!, YCoord, -1, 1, 1, 1);
            elemDrill.pa_ProcessingTableData! = drill;
            elemDrill.pa_Diameter = 0;
            elemDrill.pa_DrillDepth = 0;
          } 
          else{
            logError('There is minimum one drill outside of the board! Drill is blocked!') 
          }
        })
      }
   })
})