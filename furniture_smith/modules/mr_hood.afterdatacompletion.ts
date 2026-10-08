
	// Schuler Consulting
	// Create: March 2025
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of mr_Hood
	// Add the graphic of the hood
	//
	//
	// Revisions:
	//
  //===================================================================================

  //===================================================================================
  // Get the data from the table
  //===================================================================================

  let hoodSupplier = this.mod_HoodSupplier;
  let hoodId       = this.mod_HoodId;

  // Normalize invalid values
  if (hoodSupplier === 'None' || hoodId === 'None') {
    hoodSupplier = 'None';
    hoodId = 'None';
  }

  // Try to get hood mapping
  let HoodData = GlobalFunc.find_HoodMapping(hoodSupplier, hoodId);

  // Fallback: try None / None
  if (!HoodData) {
    HoodData = GlobalFunc.find_HoodMapping('None', 'None');
  }

  // If still no data → do NOT add Hood module
  if (!HoodData) {
    return;
  }

  //===================================================================================
  // Add the module
  //===================================================================================

  const Hood = this.addOD_M_mc_ApplianceGraphic();

  // Set attributes
  Hood.mod_GraphicId = HoodData.GraphicId;

  // Set origin
  Hood.setOrigin(0, 0, 0);

  //===================================================
	//          Create vector / docking
  //===================================================

  // Get the hood elements from the table
  const Data = GlobalFunc.find_ApplianceGraphicLibrary(HoodData.GraphicId ?? '');

  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;
  let minZ = Number.MAX_VALUE;

  let maxX = Number.MIN_VALUE;
  let maxY = Number.MIN_VALUE;
  let maxZ = Number.MIN_VALUE;

  // Cycle through all graphic elements
  Data.forEach(elem => {

    const x1 = elem.WidthPos ?? 0;
    const y1 = elem.HeightPos ?? 0;
    const z1 = elem.DepthPos ?? 0;

    const x2 = x1 + (elem.Width ?? 0);
    const y2 = y1 + (elem.Height ?? 0);
    const z2 = z1 + (elem.Depth ?? 0);

    minX = Math.min(minX, x1, x2);
    minY = Math.min(minY, y1, y2);
    minZ = Math.min(minZ, z1, z2);

    maxX = Math.max(maxX, x1, x2);
    maxY = Math.max(maxY, y1, y2);
    maxZ = Math.max(maxZ, z1, z2);
  });

	// Left side
	this.addDockingInfo(Dock.LeftBottom, new Vector3(minX, minY, minZ), new Vector3(minX, minY, maxZ));
	this.addDockingInfo(Dock.LeftTop, new Vector3(minX, maxY, minZ), new Vector3(minX, maxY, maxZ));

	// Right side
	this.addDockingInfo(Dock.RightBottom, new Vector3(maxX, minY, minZ), new Vector3(maxX, minY, maxZ));
	this.addDockingInfo(Dock.RightTop, new Vector3(maxX, maxY, minZ), new Vector3(maxX, maxY, maxZ));

  //===================================================================================
  // Call the UserExit of this module
  //===================================================================================

  GlobalFunc.ue_Hood(this);
