// Schuler Consulting
// Create: Nov 2023
// By Ludwig Weber
// Purpose: PartLibrary
//
// Description:
// CreateBuildPlan mc_Panel
// part of the panels
//
// Revisions:
// Date: May 2024
// By Henning Wiesbrock
//===================================================

//===================================================
//          Add PartGroup for the carcase and also create the box
//===================================================

let Panel=this.addpart_PanelGroup(0,0,0,this.mod_Length,this.mod_Thickness,this.mod_Width);
this.createPartGroup('panel01', Panel);

//===================================================
//          Create parts for the panels
//===================================================
// Variables
let EdgeFront: any;
let EdgeLeft: any;
let EdgeBack: any;  
let EdgeRight: any;
let EdgeFrontThk: any;
let EdgeLeftThk: any;
let EdgeBackThk: any;  
let EdgeRightThk: any;
let EdgeJointValue: any;

let BoardObjectMapping = GlobalFunc.find_BoardObjectMapping(this.mod_Program, this.mod_TypeElement, this.mod_PartDesign, this.mod_Thickness, this.mod_Color, this.mod_BtmColor);


  // Attribute values for EdgeColor and EdgeClass
  EdgeFront = GlobalFunc.find_EdgeMapping(this.mod_EdgeFrontClass, this.mod_EdgeTechnology,BoardObjectMapping.in_Color, this.mod_Thickness)
  EdgeLeft = GlobalFunc.find_EdgeMapping(this.mod_EdgeLeftClass, this.mod_EdgeTechnology,BoardObjectMapping.in_Color, this.mod_Thickness)
  EdgeBack = GlobalFunc.find_EdgeMapping(this.mod_EdgeBackClass, this.mod_EdgeTechnology,BoardObjectMapping.in_Color, this.mod_Thickness)
  EdgeRight = GlobalFunc.find_EdgeMapping(this.mod_EdgeRightClass, this.mod_EdgeTechnology,BoardObjectMapping.in_Color, this.mod_Thickness)


// No Egdes for FrontEdge
if(EdgeFront.EdgeId == "NoEdge") {
  EdgeFrontThk = 0;
} else {
  let EdgeFrontLibrary = GlobalFunc.find_EdgeLibrary(EdgeFront.EdgeId)
  EdgeFrontThk = EdgeFrontLibrary.Thickness;
}

// No Egdes for LeftEdge
if(EdgeLeft.EdgeId == "NoEdge") {
  EdgeLeftThk = 0;
} else {
  let EdgeLeftLibrary = GlobalFunc.find_EdgeLibrary(EdgeLeft.EdgeId)
  EdgeLeftThk = EdgeLeftLibrary.Thickness;
}

// No Egdes for BackEdge
if(EdgeBack.EdgeId == "NoEdge") {
  EdgeBackThk = 0;
} else {
  let EdgeBackLibrary = GlobalFunc.find_EdgeLibrary(EdgeBack.EdgeId)
  EdgeBackThk = EdgeBackLibrary.Thickness;
}

// No Egdes for RightEdge
if(EdgeRight.EdgeId == "NoEdge") {
  EdgeRightThk = 0;
} 
else {
  let EdgeRightLibrary = GlobalFunc.find_EdgeLibrary(EdgeRight.EdgeId)
  EdgeRightThk = EdgeRightLibrary.Thickness;
}


  EdgeJointValue = this.mod_EdgeJointType


// Basic setting for Edges visible
if (!this.mod_EdgesPartLibraryVis) {
  let Elem=this.addpart_Panel(0,0,0,this.mod_Length,this.mod_Thickness,this.mod_Width);
  //Elem.assign3DModel(Graphic.Model3D);
  this.assignPartGroup('panel01',Elem);
}
else {
  let Elem=this.addpart_Panel(0,0,0,this.mod_Length,this.mod_Thickness,this.mod_Width);
  //Elem.assign3DModel(Graphic.Model3D);
  this.assignPartGroup('panel01',Elem);

  // Insert Front Edge
  let EdgeFrontStartPos=0;
  let EdgeFrontLength = this.mod_Length - EdgeLeftThk - EdgeRightThk;
  if (EdgeJointValue.substring(0,1)== 'L' || EdgeJointValue.substring(0,1)== 'E')
  {
    EdgeFrontStartPos=0;
    EdgeFrontLength = EdgeFrontLength + EdgeLeftThk;
  }
  else
  {
    EdgeFrontStartPos=EdgeLeftThk;
  }
  if (EdgeJointValue.substring(3,4)== 'S')
  {
    EdgeFrontLength = EdgeFrontLength + EdgeRightThk;
  }
  if (EdgeFrontThk != 0)
  {
    let EdgeFrontVis =this.addpart_Edge(EdgeFrontStartPos,0,this.mod_Width-EdgeFrontThk,EdgeFrontLength,this.mod_Thickness,EdgeFrontThk);
  }


  // Insert Left Edge
  let EdgeLeftStartPos=0;
  let EdgeLeftLength = this.mod_Width - EdgeFrontThk - EdgeBackThk;
  if (EdgeJointValue.substring(1,2)== 'L' || EdgeJointValue.substring(1,2)== 'E')
  {
    EdgeLeftStartPos=0;
    EdgeLeftLength = EdgeLeftLength + EdgeBackThk;
  }
  else
  {
    EdgeLeftStartPos=EdgeBackThk;
  }
  if (EdgeJointValue.substring(0,1)== 'S')
  {
    EdgeLeftLength = EdgeLeftLength + EdgeFrontThk;
  }
  if (EdgeLeftThk != 0)
  {
    let EdgeLeftVis =this.addpart_Edge(0,0,EdgeLeftStartPos,EdgeLeftThk,this.mod_Thickness,EdgeLeftLength);
  }

  // Insert Back Edge
  let EdgeBackStartPos=0;
  let EdgeBackLength = this.mod_Length - EdgeLeftThk - EdgeRightThk;
  if (EdgeJointValue.substring(1,2)== 'L' )
  {
    EdgeBackStartPos=EdgeLeftThk;
    
  }
  else
  {
    EdgeBackStartPos=0;
    EdgeBackLength = EdgeBackLength + EdgeLeftThk;
  }
  if (EdgeJointValue.substring(2,3)== 'L')
  {
    EdgeBackLength = EdgeBackLength + EdgeRightThk;
  }
  if (EdgeBackThk != 0)
  {
    let EdgeBackVis =this.addpart_Edge(EdgeBackStartPos,0,0,EdgeBackLength,this.mod_Thickness,EdgeBackThk);
  }

  // Insert Right Edge
  let EdgeRightStartPos=0;
  let EdgeRightLength = this.mod_Width - EdgeBackThk - EdgeFrontThk;
  if (EdgeJointValue.substring(2,3)== 'L' )
  {
  EdgeRightStartPos=EdgeBackThk;
  
  }
  else
  {
  EdgeRightStartPos=0;
  EdgeRightLength = EdgeRightLength + EdgeBackThk;
  }
  if (EdgeJointValue.substring(3,4)== 'L')
  {
  EdgeRightLength = EdgeRightLength + EdgeFrontThk;
  }
  if (EdgeRightThk != 0)
  {
  let EdgeRightVis =this.addpart_Edge(this.mod_Length - EdgeRightThk,0,EdgeRightStartPos,EdgeRightThk,this.mod_Thickness,EdgeRightLength);
  }
}

