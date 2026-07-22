process_BoardBomInfo(Elem: any, part: any){

//---------------Get data from tables----------------------------------
            
// EdgeJoint
let EdgeJoint = GlobalFunc.find_EdgeJointTypeConstruction(part.pa_EdgeJointType,part.pa_EdgePosType);

// Board
let BoardLibrary = GlobalFunc.find_BoardLibrary(part.pa_BoardObjectMapping!.BoardId!);

//Board Grain
let PartGrain: string = BoardLibrary.Grain == 'NoGrain' ? 'NoGrain' : part.pa_PartGrain;

let GrainDirection = GlobalFunc.find_GrainDirection(part._partId,PartGrain);
           
//LotGroup
let LotGroup = GlobalFunc.find_LotGroupMapping(part.parent.mod_TypeElement,part.pa_ProgramQuery.Custom_ProductGroup,part.parent.mod_PartDesign,part.pa_ProgramQuery.Custom_GrainPatternRelevant!);

// Edge 
let EdgeTopCode = part.pa_EdgeTopMapping!.EdgeId! == 'NoEdge' ? "NoEdge" : GlobalFunc.find_EdgeLibrary(part.pa_EdgeTopMapping!.EdgeId!).EdgeCode!;
let EdgeLeftCode = part.pa_EdgeLeftMapping!.EdgeId! == 'NoEdge' ? "NoEdge" : GlobalFunc.find_EdgeLibrary(part.pa_EdgeLeftMapping!.EdgeId!).EdgeCode!;
let EdgeBtmCode = part.pa_EdgeBtmMapping!.EdgeId! == 'NoEdge' ? "NoEdge" : GlobalFunc.find_EdgeLibrary(part.pa_EdgeBtmMapping!.EdgeId!).EdgeCode!;
let EdgeRightCode = part.pa_EdgeRightMapping!.EdgeId! == 'NoEdge' ? "NoEdge" : GlobalFunc.find_EdgeLibrary(part.pa_EdgeRightMapping!.EdgeId!).EdgeCode!;

// EdgeThk 
  let EdgeTopThk = part.pa_EdgeTopMapping!.EdgeId! == 'NoEdge' ? 0 : GlobalFunc.find_EdgeLibrary(part.pa_EdgeTopMapping!.EdgeId!);
  let EdgeLefThk = part.pa_EdgeTopMapping!.EdgeId! == 'NoEdge' ? 0 : GlobalFunc.find_EdgeLibrary(part.pa_EdgeLeftMapping!.EdgeId!);
  let EdgeBtmThk = part.pa_EdgeTopMapping!.EdgeId! == 'NoEdge' ? 0 : GlobalFunc.find_EdgeLibrary(part.pa_EdgeBtmMapping!.EdgeId!);
  let EdgeRighThk = part.pa_EdgeTopMapping!.EdgeId! == 'NoEdge' ? 0 : GlobalFunc.find_EdgeLibrary(part.pa_EdgeRightMapping!.EdgeId!);

// PartOversize
/*
  let PartOversizeTop = part.pa_EdgeTopMapping!.EdgeId! == 'NoEdge' ? 0 : GlobalFunc.find_PartOverdimensionSettings(EdgeTopThk.Thickness);
  let PartOversizeLeft = part.pa_EdgeTopMapping!.EdgeId! == 'NoEdge' ? 0 : GlobalFunc.find_PartOverdimensionSettings(EdgeLefThk.Thickness);
  let PartOversizeBtm = part.pa_EdgeTopMapping!.EdgeId! == 'NoEdge' ? 0 : GlobalFunc.find_PartOverdimensionSettings(EdgeBtmThk.Thickness);
  let PartOversizeRight = part.pa_EdgeTopMapping!.EdgeId! == 'NoEdge' ? 0 : GlobalFunc.find_PartOverdimensionSettings(EdgeRighThk);
*/

// Possible saw dimensions
let WidthSaw1: number = 0; 
let WidthSaw2: number = 0; 
let LengthSaw1: number = 0; 
let LengthSaw2: number = 0; 

  if (PartGrain == 'GrainHor' || PartGrain == 'NoGrain') {
    // Calculate Width Saw
    if (part._width < 100 && part.pa_ProgramQuery.Custom_ProductGroup != 'Wood') {
      WidthSaw1 = 100;
      WidthSaw2 = part._width + 0.5;
    }

    else if (part._width < 100 && part.pa_ProgramQuery.Custom_ProductGroup == 'Wood') {
      WidthSaw1 = 100;
      WidthSaw2 = part._width;
    }

    else if (part._width >= 100 && part.pa_ProgramQuery.Custom_ProductGroup != 'Wood') {
      WidthSaw1 = part._width + 0.5;
      WidthSaw2 = 0;
    }

    else {
      WidthSaw1 = part._width;
      WidthSaw2 = 0;
    }

    // Calculate Length Saw
    if (part._depth < 240 && part.pa_ProgramQuery.Custom_ProductGroup != 'Wood') {
      LengthSaw1 = 240;
      LengthSaw2 = part._depth + 0.5;
    }

    else if (part._depth < 240 && part.pa_ProgramQuery.Custom_ProductGroup == 'Wood') {
      LengthSaw1 = 240;
      LengthSaw2 = part._depth;
    }

    else if (part._depth >= 240 && part.pa_ProgramQuery.Custom_ProductGroup != 'Wood') {
      LengthSaw1 = part._depth + 0.5;
      LengthSaw2 = 0;
    }

    else {
      LengthSaw1 = part._depth;
      LengthSaw2 = 0;
    }
  }

  if (PartGrain == 'GrainVert') {

    // Calculate Width Saw
    if (part._width < 240 && part.pa_ProgramQuery.Custom_ProductGroup != 'Wood') {
      WidthSaw1 = 240;
      WidthSaw2 = part._width + 0.5;
    }

    else if (part._width < 240 && part.pa_ProgramQuery.Custom_ProductGroup == 'Wood') {
      WidthSaw1 = 240;
      WidthSaw2 = part._width;
    }

    else if (part._width >= 240 && part.pa_ProgramQuery.Custom_ProductGroup != 'Wood') {
      WidthSaw1 = part._width + 0.5;
      WidthSaw2 = 0;
    }

    else {
      WidthSaw1 = part._width;
      WidthSaw2 = 0;
    }

    // Calculate Length Saw
    if (part._depth < 100 && part.pa_ProgramQuery.Custom_ProductGroup != 'Wood') {
      LengthSaw1 = 100;
      LengthSaw2 = part._depth + 0.5;
    }

    else if (part._depth < 100 && part.pa_ProgramQuery.Custom_ProductGroup == 'Wood') {
      LengthSaw1 = 100;
      LengthSaw2 = part._depth;
    }

    else if (part._depth >= 100 && part.pa_ProgramQuery.Custom_ProductGroup != 'Wood') {
      LengthSaw1 = part._depth + 0.5;
      LengthSaw2 = 0;
    }

    else {
      LengthSaw1 = part._depth;
      LengthSaw2 = 0;
    }
  }

// ArticleDescription
  let ArticleDescription = GlobalFunc.find_PartSettings(part._partId);


//---------------Set attributes of the board----------------------------

Elem.bom_Type= ArticleDescription.BomPartDescription;
Elem.bom_Name='Front';
Elem.bom_PartId=part._id;
Elem.bom_ElementCategory='';
Elem.bom_ElementId=part._id;
Elem.bom_ParentId='Panel01';
Elem.bom_ElementType='Board';
Elem.bom_Material = BoardLibrary.MaterialCode;
Elem.bom_Width = part._depth;
Elem.bom_Length = part._width;

Elem.bom_CutDimLength1 = WidthSaw1;
Elem.bom_CutDimWidth1 = LengthSaw1;
if (part._width < 100 && part.pa_ProgramQuery.Custom_ProductGroup != 'Wood') 
{ 
Elem.bom_CutDimLength2 = WidthSaw2;
}
if (part._depth <240 && part.pa_ProgramQuery.Custom_ProductGroup != 'Wood') 
{
Elem.bom_CutDimWidth2 = LengthSaw2;
}

Elem.bom_Finalthk = part._thickness;
Elem.bom_BoardType =  BoardLibrary.BoardType!;
Elem.bom_GrainOrientation = GrainDirection.GrainDirection;
Elem.bom_Route = 'DemoRoute';
Elem.bom_EdgeLeft =  EdgeLeftCode;
Elem.bom_EdgeRight = EdgeRightCode;
Elem.bom_EdgeBack = EdgeBtmCode;
Elem.bom_EdgeFront =EdgeTopCode;
Elem.bom_EdgeJointFrontLeft = EdgeJoint.EdgeJointFrontLeft;
Elem.bom_EdgeJointLeftBack = EdgeJoint.EdgeJointLeftBack;
Elem.bom_EdgeJointBackRight = EdgeJoint.EdgeJointBackRight;
Elem.bom_EdgeJointRightFront = EdgeJoint.EdgeJointRightFront;
Elem.bom_EdgeShape = EdgeJoint.EdgeShape;
Elem.bom_EdgeTransition = EdgeJoint.EdgeCode;
Elem.bom_ArticleGroup = LotGroup.LotGroup
}