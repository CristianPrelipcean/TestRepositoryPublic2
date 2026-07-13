// Schuler Consulting
// Create: Juli 2023
// By Ludwig Weber
// Purpose: HOMAG Converter for bom-elements
//
// Description:
// Converts the bom-elements for output as XML-file
//
// Revisions:
// 
//===================================================

// Initialize variables
let finalStr = '';
let str = '';
let elemType = '';
let elemName = '';
let elemId = '';
let parentId = '';
let material = '';
let grain = 0;
let elemCategory = '';
let EdgeFront = '';
let EdgeBack = '';
let EdgeLeft = '';
let EdgeRight = '';
let bomCount = 1;
let width = 0;
let depth = 0;
let thk = 0;

// Cycle through all Bom-Elements of the cabinet
bomEntries.forEach(b => {

  // Delete old string
  str="";
  bomCount++;

  // Cycle through all attributes of the element
  b.getAttributes().forEach((value, key) => {
    
    if (key == "bom_ElementType"){elemType = value;}
    else if (key == "bom_ParentId"){parentId = value;}
    else if (key == "bom_ElementId"){elemId = value;}
    else if (key == "bom_Name"){elemName = value;}
    else if (key == "bom_BoardId"){material = value;}
    else if (key == "bom_GrainOrientation"){grain = value;}
    else if (key == "bom_ElementCategory"){elemCategory = value;}
    else if (key == "bom_EdgeFront"){EdgeFront = value;}
    else if (key == "bom_EdgeBack"){EdgeBack = value;}
    else if (key == "bom_EdgeLeft"){EdgeLeft = value;}
    else if (key == "bom_EdgeRight"){EdgeRight = value;}
    else if (key == "bom_Material"){material = value;}
    else if (key == "bom_Length"){width = value;}
    else if (key == "bom_Width"){depth = value;}
    else if (key == "bom_Finalthk"){thk = value;}
    else {str += "   " + key + ": " + value + "\r\n";}		  		  
  });	

  // Create final string and attach BomAttributes
  finalStr += str;

  // Create output for this element
  let k:any = {};
  k.id = elemId;
  k.parent = parentId;
  k.partID = part._id;
  k.count = bomCount;
  k.Type = elemType;
  k.Name = elemName;
  k.width = width;
  k.depth = depth;
  k.thickness =thk;
  k.material = material;
  k.barcode = part._partId + "_" + part._id;
  k.grain = 0;
  k.category = elemCategory;
  k.EdgeFront =EdgeFront
  k.EdgeRight = EdgeRight;
  k.EdgeBack = EdgeBack;
  k.EdgeLeft = EdgeLeft;
  this.createFileEntry(result, JSON.stringify(k), finalStr);	
});