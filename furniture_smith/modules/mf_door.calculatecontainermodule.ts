
	// Create: March 2026
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// Add the placeholder to add equipment
	//
	// Revisions:
	// 
  //===================================================
  
	// Get the FreeSpace and StartPosition
  const CarcaseSpaceDimension = JSON.parse(this.mod_CarcaseSpaceDimension[0]);

  // Insert the placeholder
  const ph = this.addOD_M_md_EquipmentPlaceholder();

  // Set the attributes
  ph.mod_Width = CarcaseSpaceDimension.WidthFreeSpace;
  ph.mod_Depth = CarcaseSpaceDimension.DepthFreeSpace;
  ph.mod_Height = CarcaseSpaceDimension.HeightFreeSpace;

  // SetOrigin of the placeholder
  ph.setOrigin(CarcaseSpaceDimension.WidthFreeStartPos - this.mod_Originpos[0], CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1], CarcaseSpaceDimension.DepthFreeStartPos - this.mod_Originpos[2])
  