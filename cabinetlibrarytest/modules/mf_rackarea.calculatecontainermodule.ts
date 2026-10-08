
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
  

  interface LeafCompartmentBounds {
    compartmentId: string;
    name?: string;

    width: number;
    height: number;
    depth: number;

    originX: number;
    originY: number;
    originZ: number;
  }

  // Calculate Leaf Compartments
  let leafCompartments = JSON.parse(GlobalFunc.calc_LeafCompartments(this.mod_CompartmentsInformation[0])) as LeafCompartmentBounds[];

  leafCompartments.forEach(leaf => {
    // Insert the placeholder
    const ph = this.addOD_M_md_EquipmentPlaceholder();

    // Set the attributes
    ph.mod_Width = leaf.width;
    ph.mod_Depth = leaf.depth;
    ph.mod_Height = leaf.height;

    // SetOrigin of the placeholder
    ph.setOrigin(leaf.originX + CarcaseSpaceDimension.WidthFreeStartPos - this.mod_Originpos[0], leaf.originY + CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1], leaf.originZ + CarcaseSpaceDimension.DepthFreeStartPos - this.mod_Originpos[2])

  })
       
    