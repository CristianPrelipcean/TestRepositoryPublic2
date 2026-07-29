
  // Create: March 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mf_Hob
  // Add module for the hob
  //
  // Revisions:
  //
  //===================================================================================

  //===================================================================================
  // Get data from the table
  //===================================================================================

  // Get the default hob until there is a valid selection
  const hobSupplier = this.mod_HobSupplier === 'None' || this.mod_HobId === 'None' ? 'None' : this.mod_HobSupplier;
  const hobId = this.mod_HobSupplier === 'None' || this.mod_HobId === 'None' ? 'None' : this.mod_HobId;
  let retMapping = GlobalFunc.find_HobMapping(hobSupplier, hobId);

  // Provide the id's for the sub-module
  let constructionId = retMapping.ConstructionId;
  let graphicId = retMapping.GraphicId;

  // Provide the blocked space in height for the carcase (top shelf construction)
  let hobConstruction = constructionId ? GlobalFunc.find_HobConstruction(constructionId) : null;
  let hobBlockedSpaceHgt = hobConstruction ? hobConstruction.HobBlockedHgt ?? 0 : 0;
  this.mod_HobInfo.push(hobBlockedSpaceHgt);

  //===================================================================================
  // Add the construction module
  //===================================================================================

  // Add the module
  let Hob = this.addOD_M_mc_Hob01();

  // Set values to the attributes of the child
  Hob.mod_HobGraphicId = graphicId;
  Hob.mod_HobConstructionId = constructionId;

  // SetOrigin
  Hob.setOrigin(this.mod_HobMoveWidth, 0, -this.mod_HobMoveDepth);

  //===================================================================================
  // Return the data for the cutout to the carcase (add it to the contour)
  //===================================================================================

  // Create an object for the cutout
  if (hobConstruction) {
    let objHob = {
      Supplier: this.mod_HobSupplier,
      Id: this.mod_HobId,
      CutWidth: hobConstruction.CutWidth,
      CutDepth: hobConstruction.CutDepth,
      CutRadius: hobConstruction.CutRadius,
      CutPosX: this.mod_HobMoveWidth,
      CutPosY: this.mod_HobMoveDepth
    }

    // Push the JSON-string to the attribute
    this.mod_CountertopInfo.push(JSON.stringify(objHob));
  }