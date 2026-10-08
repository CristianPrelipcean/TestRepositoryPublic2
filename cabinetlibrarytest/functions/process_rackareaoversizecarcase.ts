process_RackAreaOversizeCarcase(parentModule: any) {

  //=====================================
  // Define variables
  //=====================================

  let isOnlyRackArea = false;
  let retOversize = 0;
  let moduleCount = 0;
  let rackareaCount = 0;

  //=====================================
  // Search for Front-Modules in StorageunitSigle
  //=====================================

  // Search in the parent which modules are in place
  if (Array.isArray(parentModule.m)) {
    const modules = parentModule.m as any[];

    rackareaCount = modules.filter((p) => p instanceof OD_M_mf_RackArea).length;
    moduleCount = modules.filter((p) =>
      p instanceof OD_M_mf_Door ||
      p instanceof OD_M_mf_Fliplift ||
      p instanceof OD_M_mf_Drawer ||
      p instanceof OD_M_mf_Oven ||
      p instanceof OD_M_mf_Fridge ||
      p instanceof OD_M_mf_RackArea
    ).length;

    // Check if the rack area is the only child
    isOnlyRackArea = rackareaCount === 1 && moduleCount === 1;
  }

  if (isOnlyRackArea) {

    //=====================================
    // Get data from table FrontConstruction
    //=====================================

    //---------------Get data from table Front Construction---------------------------
    let retFrontThk = GlobalFunc.find_FrontConstruction(parentModule.mod_FrontProgram, parentModule.mod_FrontDesign, 'Door', parentModule.mod_Width, parentModule.mod_Height, 'Door', 'All');

    //---------------Convert data type string to number ---------------------------
    let FrontThk = retFrontThk.Thickness;

    //=====================================
    // Calculate Oversize Value for each Type
    //=====================================

    if (parentModule.g.basic_RackAreaOversizeAutomaticCarcaseType == true) {
      if (parentModule.g.basic_RackAreaOversizeCarcaseType == 'FixedOversize') {
        retOversize = parentModule.g.basic_RackAreaDepthFixedCarcase + parentModule.mod_RackAreaManualOffsetCarcase;
      }

      else if (parentModule.g.basic_RackAreaOversizeCarcaseType == 'FlexibleOversize') {
        retOversize = FrontThk + parentModule.mod_FrontGapCarcase + parentModule.mod_RackAreaManualOffsetCarcase;
      }
    }
    else {
      if (parentModule.mod_RackAreaOversizeCarcaseType == 'FixedOversize') {
        retOversize = parentModule.g.basic_RackAreaDepthFixedCarcase + parentModule.mod_RackAreaManualOffsetCarcase;
      }

      else if (parentModule.mod_RackAreaOversizeCarcaseType == 'FlexibleOversize') {
        retOversize = FrontThk + parentModule.mod_FrontGapCarcase + parentModule.mod_RackAreaManualOffsetCarcase;
      }
    }
  }

  // If the situation doesn't allow to extend the caracase, but the user is configuring an oversize we give him a message
  else {
    if (parentModule.g.basic_RackAreaOversizeAutomaticCarcaseType == false && rackareaCount >= 1) {
      if (parentModule.mod_RackAreaOversizeCarcaseType == 'FixedOversize' || parentModule.mod_RackAreaOversizeCarcaseType == 'FlexibleOversize') {
        let InfoMessage = GlobalFunc.find_ErrorList('Info 22003', 1);
        logInfo(InfoMessage.Message(''));
      }
    }
  }

  // Return the oversize to the module
  return retOversize;

}