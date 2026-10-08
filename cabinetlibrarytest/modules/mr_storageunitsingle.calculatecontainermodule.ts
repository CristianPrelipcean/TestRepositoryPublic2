
	// Create: April 2026
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// Add the placeholder to add equipment
	//
	// Revisions:
	// 
  //===================================================
  
  // Variables
  const startPosCabinet = this.mod_PlinthAreaDesign_matrix.PlinthAreaType !== 'None' ? this.mod_PlinthAreaHeight! : 0;
  const height = this.mod_Height;
  let startPos = this.mod_FrontPosStart + startPosCabinet;
  let isFilled = false;

  // Check if there is space available
  for (const p of this.m) {
    if (p instanceof OD_M_mf_Door || p instanceof OD_M_mf_Fliplift || p instanceof OD_M_mf_Drawer || p instanceof OD_M_mf_Pullout || p instanceof OD_M_mf_PantryPullout || p instanceof OD_M_mf_Fridge || p instanceof OD_M_mf_RackArea || p instanceof OD_M_mf_Fixedfront) {

      // Stop if we are sure the cabinet is filled with fronts
      if (startPos + p.mod_FrontHeightSelection! >= height + startPosCabinet) {
        isFilled = true;
        break;
      }

      // Calculate starting position of the next front
      if (p.mod_FingergripTop === true) {
        const tmpGapMid = this.mod_FingergripType_matrix.CShapeHeight! - (this.mod_FingergripType_matrix.CShapeOverlapBelow! + this.mod_FingergripType_matrix.CShapeOverlapAbove!);
        startPos += p.mod_FrontHeightSelection! - tmpGapMid - this.mod_FingergripType_matrix.CShapeOverlapBelow! + this.mod_FingergripType_matrix.CShapeHeight! - this.mod_FingergripType_matrix.CShapeOverlapAbove!;
      }
      else {
        startPos += p.mod_FrontHeightSelection!;
      }
    }
  }
  
  // Insert the placeholder if there is still space for a front
  if (!isFilled) {

    // Add the placeholder
    const ph = this.addOD_M_md_FrontPlaceholder();

    // Set the attributes
    ph.mod_Width = this.mod_Width;
    ph.mod_Depth = 19;
    ph.mod_Height = this.mod_Height;

    // SetOrigin of the placeholder
    ph.setOrigin(0, startPosCabinet, this.mod_Depth)
  }