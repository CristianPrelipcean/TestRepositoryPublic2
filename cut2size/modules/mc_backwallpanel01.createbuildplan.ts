// Schuler Consulting
// Create: June 2024
// By Henning Wiesbrock
// Purpose: PartLibrary
//
// Description:
// CreateBuildPlan mc_BackwallPanel01
// Get data for the board
// Get data for the edges
// Add the front panels
// Show the edges
//
// Revisions:
// 
//===================================================

//===================================================
//          Get data for the board
//===================================================

// Mapping of the Board
let BoardObjectMapping = GlobalFunc.find_BoardObjectMapping(this.mod_Program, this.mod_TypeElement, this.mod_PartDesign, this.mod_Thickness, this.mod_Color, this.mod_BtmColor);

//===================================================
//         Get data for the edges
//===================================================

// Define BoardThk
let BoardThk = this.mod_Thickness;

// Define EdgesNames
let EdgeTop: string;
let EdgeLeft: string;
let EdgeBtm: string;
let EdgeRight: string;

// Define EdgeClass
let EdgeTopClass = this.mod_EdgeTopClass == 'Automatic' ? BoardObjectMapping.EdgeFrontClass! : this.mod_EdgeTopClass;
let EdgeLeftClass = this.mod_EdgeLeftClass == 'Automatic' ? BoardObjectMapping.EdgeLeftClass! : this.mod_EdgeLeftClass;
let EdgeBtmClass = this.mod_EdgeBtmClass == 'Automatic' ? BoardObjectMapping.EdgeBackClass! : this.mod_EdgeBtmClass;
let EdgeRightClass = this.mod_EdgeRightClass == 'Automatic' ? BoardObjectMapping.EdgeRightClass! : this.mod_EdgeRightClass;

// Define Edge EdgeTechnology
let EdgeTechnology = this.mod_EdgeTechnology == 'Automatic' ? BoardObjectMapping.EdgeTechnology! : this.mod_EdgeTechnology;

// Define EdgeColor
let EdgeTopColor = this.mod_EdgeTopColor == 'Automatic' ? BoardObjectMapping.in_Color : this.mod_EdgeTopColor;
let EdgeLeftColor = this.mod_EdgeLeftColor == 'Automatic' ? BoardObjectMapping.in_Color : this.mod_EdgeLeftColor;
let EdgeBtmColor = this.mod_EdgeBtmColor == 'Automatic' ? BoardObjectMapping.in_Color : this.mod_EdgeBtmColor;
let EdgeRightColor = this.mod_EdgeRightColor == 'Automatic' ? BoardObjectMapping.in_Color : this.mod_EdgeRightColor;

// Define EdgeId
let EdgeTopId: string;
let EdgeLeftId: string;
let EdgeBtmId: string;
let EdgeRightId: string;

// EdgeMapping
EdgeTop = GlobalFunc.find_EdgeMapping(EdgeTopClass, EdgeTechnology, EdgeTopColor, BoardThk);
EdgeLeft = GlobalFunc.find_EdgeMapping(EdgeLeftClass, EdgeTechnology, EdgeLeftColor, BoardThk);
EdgeBtm = GlobalFunc.find_EdgeMapping(EdgeBtmClass, EdgeTechnology, EdgeBtmColor, BoardThk);
EdgeRight = GlobalFunc.find_EdgeMapping(EdgeRightClass, EdgeTechnology, EdgeRightColor, BoardThk);
EdgeTopId = GlobalFunc.find_EdgeMapping(EdgeTopClass, EdgeTechnology, EdgeTopColor, BoardThk).EdgeId!;
EdgeLeftId = GlobalFunc.find_EdgeMapping(EdgeLeftClass, EdgeTechnology, EdgeLeftColor, BoardThk).EdgeId!;
EdgeBtmId = GlobalFunc.find_EdgeMapping(EdgeBtmClass, EdgeTechnology, EdgeBtmColor, BoardThk).EdgeId!;
EdgeRightId = GlobalFunc.find_EdgeMapping(EdgeRightClass, EdgeTechnology, EdgeRightColor, BoardThk).EdgeId!;


// Define Edge Thickness
let EdgeTopThk: number = EdgeTopId! == 'NoEdge' ? 0 : GlobalFunc.find_EdgeLibrary(EdgeTopId!).Thickness!;
let EdgeLeftThk: number = EdgeLeftId! == 'NoEdge' ? 0 : GlobalFunc.find_EdgeLibrary(EdgeLeftId!).Thickness!;
let EdgeBtmThk: number = EdgeBtmId! == 'NoEdge' ? 0 : GlobalFunc.find_EdgeLibrary(EdgeBtmId!).Thickness!;
let EdgeRightThk: number = EdgeRightId! == 'NoEdge' ? 0 : GlobalFunc.find_EdgeLibrary(EdgeRightId!).Thickness!;

// EdgeJointType 
let EdgeJointType = GlobalFunc.find_EdgeJointTypeMapping(this.mod_TypeElement, EdgeTechnology, EdgeTopClass, EdgeLeftClass, EdgeBtmClass, EdgeRightClass);
let EdgeJointValue = this.mod_EdgeJointType == 'Automatic' ? EdgeJointType.EdgeJointType! : this.mod_EdgeJointType;

//===================================================
//          Add the front panels
//===================================================

// Variables
let Panel: any;

// Add the left door  
  Panel=this.addpart_Backwall(0,0,0,this.mod_Width,this.mod_Height,this.mod_Thickness);

// Add the part group
let Panelgroup=this.addpart_PanelGroup(0,0,0,this.mod_Width,this.mod_Height,this.mod_Thickness);
this.createPartGroup('panel01',Panelgroup);
this.assignPartGroup('panel01',Panel);

// Set attributes of the part
Panel.pa_EdgeTopMapping = EdgeTop;
Panel.pa_EdgeBtmMapping = EdgeBtm;
Panel.pa_EdgeLeftMapping = EdgeLeft;
Panel.pa_EdgeRightMapping = EdgeRight;
Panel.pa_BoardObjectMapping = BoardObjectMapping;
Panel.pa_EdgeJointType = EdgeJointValue;
 
//===================================================
//          Show the edges
//===================================================

// Show the edges if the attribute is set to true
if (this.mod_EdgesPartLibraryVis) {

  // TopEdge
  //-------------------------------------------------

  if (EdgeTopThk != 0){

    // Calculations left neighbour
    let EdgeTopStartPos= 0;
    let EdgeTopLength = this.mod_Width - EdgeLeftThk - EdgeRightThk;
    if (EdgeJointValue.substring(0,1)== 'L' || EdgeJointValue.substring(0,1)== 'E') {
      EdgeTopLength += EdgeLeftThk;
    }
    else {
      EdgeTopStartPos=EdgeLeftThk;
    }

    // Calculations right neighbour
    if (EdgeJointValue.substring(3,4)== 'S') {
      EdgeTopLength += EdgeRightThk;
    }

    // Add the part
    this.addpart_Edge(EdgeTopStartPos,this.mod_Height-EdgeTopThk,0,EdgeTopLength,EdgeTopThk,this.mod_Thickness);
  }

  // LeftEdge
  //-------------------------------------------------

  if (EdgeLeftThk != 0) {

    // Calculations left neighbour
    let EdgeLeftStartPos=0;
    let EdgeLeftLength = this.mod_Height - EdgeTopThk - EdgeBtmThk;
    if (EdgeJointValue.substring(1,2)== 'L' || EdgeJointValue.substring(1,2)== 'E') {
      EdgeLeftLength += EdgeBtmThk;
    }
    else {
      EdgeLeftStartPos = EdgeBtmThk;
    }

    // Calculations right neighbour
    if (EdgeJointValue.substring(0,1)== 'S'){
      EdgeLeftLength += EdgeTopThk;
    }
    
    // Add the part
    this.addpart_Edge(0,EdgeLeftStartPos,0,EdgeLeftThk,EdgeLeftLength,this.mod_Thickness);
  }

  // BtmEdge
  //-------------------------------------------------

  if (EdgeBtmThk != 0) {

    // Calculations left neighbour
    let EdgeBtmStartPos=0;
    let EdgeBtmLength = this.mod_Width - EdgeLeftThk - EdgeRightThk;
    if (EdgeJointValue.substring(1,2)=='L') {
      EdgeBtmStartPos = EdgeLeftThk;      
    }
    else {
      EdgeBtmLength = EdgeBtmLength + EdgeLeftThk;
    }

    // Calculations right neighbour
    if (EdgeJointValue.substring(2,3)== 'L') {
      EdgeBtmLength += EdgeRightThk;
    }
    
    // Add the part
    this.addpart_Edge(EdgeBtmStartPos,0,0,EdgeBtmLength,EdgeBtmThk,this.mod_Thickness);
  }

  // RightEdge
  //-------------------------------------------------

  if (EdgeRightThk != 0) {

    // Calculations left neighbour  
    let EdgeRightStartPos=0;
    let EdgeRightLength = this.mod_Height - EdgeBtmThk - EdgeTopThk;
    if (EdgeJointValue.substring(2,3)== 'L' ) {
      EdgeRightStartPos = EdgeBtmThk; 
    }
    else {
      EdgeRightLength += EdgeBtmThk;
    }

    // Calculations right neighbour
    if (EdgeJointValue.substring(3,4)== 'L') {
      EdgeRightLength += EdgeTopThk;
    }
    
    // Add the part
    this.addpart_Edge(this.mod_Width - EdgeRightThk,EdgeRightStartPos,0,EdgeRightThk,EdgeRightLength,this.mod_Thickness);
  }
}


