  // Schuler Consulting
  // Create: July 2024
  // By Henning Wiesbrock
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_ShelffixedGroup01
  // Add the fixed shelves
  //
  // Revisions:
  // 19/11/2024 Add Thickness of fixed shelf for calculate the correct position
  // 
  //===================================================
  //
  //===================================================
  //          Fixed shelf for RackArea
  //===================================================

  //---------------Initialzize variables--------------------------------------
  let arrPositions: number[] = [];
  let Thickness: number = this.mod_ShelffixedThk;

  // Get the FreeSpace and StartPosition
  let CarcaseSpaceDimension = JSON.parse(this.mod_CarcaseSpaceDimension[0]);

  // Call table tab_ShelfadjQtyPosSettings
  let retQtyPosSetting = GlobalFunc.find_ShelfadjQtyPosSettings(this.mod_TypeElement, this.mod_ShelffixedPartParentName, this.mod_ShelffixedPartParentType, CarcaseSpaceDimension.HeightFreeSpace);

  // Calculate the FreeSpace for the Positioning the Shelffixed

  let QtyShelffixed = retQtyPosSetting.DescriptorPosY!.split('_').length - 1;
  let CalcTotalHeight = QtyShelffixed * Thickness;

  // Process  the descriptor
  let arrDescPos = GlobalFunc.process_Descriptor(retQtyPosSetting.DescriptorPosY!, CarcaseSpaceDimension.HeightFreeSpace - CalcTotalHeight)

  // Add fixed shelves
  let i = 0;
  arrDescPos.forEach(position => {
    i++;
    if (i == 0) {
      arrPositions[i] = parseFloat(position.toFixed(1));
    }
    else {
      arrPositions[i] = parseFloat(position.toFixed(1)) + Thickness * (i - 1);
    }

    // Insert fixed shelf
    let Elem = this.addpart_Shelffixed(0, arrPositions[i], 0, this.mod_Width, this.mod_ShelffixedThk, this.mod_Depth - this.mod_ShelffixedOffsetFront);
    GlobalFunc.process_AddMaterial(Elem, 'shelf', this.mod_CarcaseColor, 'None', this.mod_CarcaseEdgeColor, this.mod_CarcaseEdgeFrontColor, 'None', false, false);
    this.assignPartGroup(this.mod_CarcaseId, Elem);
  })