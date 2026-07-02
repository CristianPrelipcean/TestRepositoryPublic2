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

//===================================================
// Interface for the bom data
//===================================================

interface BomEntry {
  id: string;
  parent: string;
  partID: string;
  ArticleGroup: string;
  count: number;
  Type: string;
  Name: string;
  width: number;
  depth: number;
  cutLength: number;
  cutWidth: number;
  thickness: number;
  material: string;
  barcode: string;
  grain: number;
  category: string;
  EdgeFront: string;
  EdgeBack: string;
  EdgeLeft: string;
  EdgeRight: string;
  [key: string]: any;
}

//===================================================
// Helper function to map the data from the bom-element to the interface
//===================================================

function mapBomAttributes(attributes: Map<string, any>, part: any, bomCount: number): { entry: BomEntry, extras: string } {
  const entry: Partial<BomEntry> = {
    count: bomCount,
    partID: part._id,
    grain: 0 // Defaultwert
  };

  let extras = '';

  const mapping: Record<string, keyof BomEntry> = {
    bom_ElementType: "Type",
    bom_ParentId: "parent",
    bom_ElementId: "id",
    bom_ArticleGroup: "ArticleGroup",
    bom_Name: "Name",
    bom_BoardId: "material",
    bom_ElementCategory: "category",
    bom_EdgeTransition: "EdgeTransition",
    bom_EdgeFront: "EdgeFront",
    bom_EdgeBack: "EdgeBack",
    bom_EdgeLeft: "EdgeLeft",
    bom_EdgeRight: "EdgeRight",
    bom_Material: "material",
    bom_Length: "width",
    bom_Width: "depth",
    bom_CutDimLength1: "cutLength",
    bom_CutDimWidth1: "cutWidth",
    bom_Finalthk: "thickness",
    bom_Thk: "thickness"
  };

  attributes.forEach((value, key) => {
    if (key === "bom_GrainOrientation") {
      entry.grain = grainStringToNumber(value);
    } else if (mapping[key]) {
      (entry as any)[mapping[key]] = value;
    } else {
      extras += `   ${key}: ${value}\r\n`;
    }
  });

  entry.barcode = `${part._partId}_${part._id}`;

  // Ensure no undefined values
  const defaultValues: BomEntry = {
    id: '',
    parent: '',
    partID: '',
    ArticleGroup: 'notDefined',
    count: 0,
    Type: '',
    Name: '',
    width: 0,
    depth: 0,
    cutLength: 0,
    cutWidth: 0,
    thickness: 0,
    material: '',
    barcode: '',
    grain: 0,
    category: '',
    EdgeTransition: '',
    EdgeFront: '',
    EdgeBack: '',
    EdgeLeft: '',
    EdgeRight: ''
  };

  Object.keys(defaultValues).forEach((key) => {
    if (entry[key as keyof BomEntry] === undefined) {
      entry[key as keyof BomEntry] = defaultValues[key as keyof BomEntry];
    }
  });

  return { entry: entry as BomEntry, extras };
}


//===================================================
// Helper function to map the grain
//===================================================

function grainStringToNumber(grain: string): number {
  switch (grain) {
    case 'L': return 1;
    case 'N': return 0;
    case 'C': return 2;
    default: return 0; // fallback für unbekannte Werte
  }
}

//===================================================
// Cycle through all the bom-elements
//===================================================

let bomCount = 0;

bomEntries.forEach(b => {
  bomCount++;
  const { entry, extras } = mapBomAttributes(b.getAttributes(), part, bomCount);
  this.createFileEntry(result, JSON.stringify(entry), extras);
});