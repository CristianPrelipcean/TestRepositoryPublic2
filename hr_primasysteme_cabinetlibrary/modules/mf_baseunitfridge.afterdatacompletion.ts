
  // Schuler Consulting
  // Create: October 2025
  // By Anni Chen
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mf_BaseunitFridge
	// Add module for construction of baseunit fridges
  //
  // Revisions:
  // 
  //===================================================

  // Get data from the tables
  let retMapping = GlobalFunc.find_BaseunitFridgeMapping(this.mod_BaseunitFridgeSupplier, this.mod_BaseunitFridgeId);
  let retConstruction = GlobalFunc.find_BaseunitFridgeConstruction(retMapping.ConstructionId!);

  // Create object for the baseunit fridge information
  interface DwInfo {
    Width: number;
    Depth: number;
    Height: number;
    GraphicId: string | undefined;
    Integration: string | undefined;
    DoorDirection: string | undefined;
  }

  const dwInfo: DwInfo = {
    Width: retConstruction.NominalWidth ? retConstruction.NominalWidth : 600,
    Depth: retConstruction.MinDepth ? retConstruction.MinDepth : 550,
    Height: retConstruction.MinHeight ? retConstruction.MinHeight : 815,
    GraphicId: retMapping.GraphicId,
    Integration: retConstruction.Integration,
    DoorDirection: this.mod_DoorDirection
  };

  // Push the object back to the root for the docking
  this.mod_BaseunitFridgeInfo.push(JSON.stringify(dwInfo));

  //===================================================================================
  // Add the module
  //===================================================================================

  // Add the module
  let dW = this.addOD_M_mc_BaseunitFridge01();

  // Set the attributes
  dW.mod_BaseunitFridgeInfo.push(JSON.stringify(dwInfo));
  dW.mod_FrontWidth = retConstruction.NominalWidth ? retConstruction.NominalWidth : 600;
  dW.mod_FrontHeight = this.mod_FrontHeight;

  // setOrigin
  dW.setOrigin(0, 0, this.mod_FrontGapCarcase);
  dW.mod_Originpos.push(this.mod_Originpos[0]);
  dW.mod_Originpos.push(this.mod_Originpos[1]);
  dW.mod_Originpos.push(this.mod_Originpos[2] + this.mod_FrontGapCarcase);
  dW.mod_Originpos.push(this.mod_Originpos[3]);