  
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
    PartCode: string;
    [key: string]: any;
  }

  //===================================================
  // Helper function to map the data from the bom-element to the interface
  //===================================================

  function mapBomAttributes(attributes: Map<string, unknown> | undefined, part: { _id: string; _partId: string }, bomCount: number, elementTypeId?: string): { entry: BomEntry; extras: Record<string, unknown> } {
    const entry: Partial<BomEntry> = {
      count: bomCount,
      partID: part._id,
      grain: 0
    };

    let extras: Record<string, any> = {};

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
      bom_Thk: "thickness",
      bom_Type:"PartCode"
    };

    if (!attributes || attributes.size === 0) {
      // check to ensure we try not to cycle an empty object
    } 
    else {
      attributes.forEach((value, key) => {

        if (key === "bom_GrainOrientation") {
          entry.grain = grainStringToNumber(String(value ?? ''));

        } else if (mapping[key]) {
          const target = mapping[key];
          (entry as Record<string, unknown>)[target] = value ?? '';

        } else {
          //extras[key] = value ?? null; // JL: Removed so that all attributes are sent to extras
        }
        extras[key] = value ?? null;

      });
    }

    // Add the type if it is not in the bomout-attributes
    const elementTypeMap: Record<string, BomEntry["Type"]> = {
      bomout_Hardware: "Hardware"
    };

    if ((!entry.Type || entry.Type === "") && elementTypeId && elementTypeMap[elementTypeId]) {
      entry.Type = elementTypeMap[elementTypeId];
    }

    // Create the barcode
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
      EdgeRight: '',
      PartCode: ''

    };

    const fullEntry: BomEntry = { ...defaultValues, ...entry };
    return { entry: fullEntry, extras };
  }


  //===================================================
  // Helper function to map the grain
  //===================================================

  function grainStringToNumber(grain: string): number {
    switch (grain) {
      case 'L': return 1;
      case 'N': return 0;
      case 'C': return 2;
      default: return 0;
    }
  }

  //===================================================
  // Cycle through all the bom-elements
  //===================================================

  let bomCount = 0;

  bomEntries.forEach(b => {

    const attributes = b.getAttributes();
    if (!attributes || attributes.size === 0) {
      return;
    }

    bomCount++;
    const { entry, extras } = mapBomAttributes(attributes, part, bomCount, b._bomElementTypeId);
    const fileName = `${bomCount}_${entry.barcode || entry.id || "bom"}.json`;

    const content = JSON.stringify(
      {entry,extras},null,2
    );

    this.createFileEntry(result,fileName,content,"application/json;charset=utf-8");
  });