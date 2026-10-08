
  // Create: March 2025
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// CreateBuildPlan of mc_Hob01
	// Add the drill part
	//
	// Revisions:
	//
  //===================================================================================

  //===================================================================================
	// Get data from the table
  //===================================================================================

  let retConstruction = GlobalFunc.find_HobConstruction(this.mod_HobConstructionId);

	//===================================================================================
	// Add the drill part
  //===================================================================================

  // Add the drill part
  let Drill = this.addpart_CountertopCutout(0,-30,0,1,30,1);
