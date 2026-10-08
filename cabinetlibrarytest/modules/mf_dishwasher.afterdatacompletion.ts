
	// Create: April 2025
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of mf_Dishwasher
	// Add module for construction of dishwashers
	//
	// Revisions:
	//
	//===================================================================================

  //===================================================================================
  // Add the graphic module for appliances
  //===================================================================================

  // Get data from the tables
  let retMapping = GlobalFunc.find_DishwasherMapping(this.mod_DishwasherSupplier, this.mod_DishwasherId);
  let retConstruction = GlobalFunc.find_DishwasherConstruction(retMapping.ConstructionId!);

  // Create object for the diswasher information
  interface DwInfo {
    Width: number;
    Depth: number;
    Height: number;
    GraphicId: string | undefined;
    Integration: string | undefined;
  }

  const dwInfo: DwInfo = {
    Width: retConstruction.NominalWidth ? retConstruction.NominalWidth : 600,
    Depth: retConstruction.MinDepth ? retConstruction.MinDepth : 550,
    Height: retConstruction.MinHeight ? retConstruction.MinHeight : 815,
    GraphicId: retMapping.GraphicId,
    Integration: retConstruction.Integration
  };

  // Push the object back to the root for the docking
	this.mod_DishwasherInfo.push(JSON.stringify(dwInfo));

	//===================================================================================
	// Add the module
	//===================================================================================

	// Add the module
	let dW = this.addOD_M_mc_Dishwasher01();

	// Set the attributes
	dW.mod_DishwasherInfo.push(JSON.stringify(dwInfo));
  dW.mod_FrontWidth = retConstruction.NominalWidth ? retConstruction.NominalWidth : 600;
  dW.mod_FrontHeight = retConstruction.Integration === 'full' ? this.mod_FrontHeight : this.mod_FrontHeight + this.mod_FrontGapHorTop - (retConstruction.ControlPanelHeight ?? 0);

  // setOrigin
  dW.setOrigin(0, 0, this.mod_FrontGapCarcase);
  dW.mod_Originpos.push(this.mod_Originpos[0]);
  dW.mod_Originpos.push(this.mod_Originpos[1]);
	dW.mod_Originpos.push(this.mod_Originpos[2] + this.mod_FrontGapCarcase);
	dW.mod_Originpos.push(this.mod_Originpos[3]);
