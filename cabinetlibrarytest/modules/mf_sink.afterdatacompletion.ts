
	// Create: March 2025
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of mf_Sink
	// Add module for the sink
	//
	// Revisions:
	//
  //===================================================================================

  //===================================================================================
	// Get data from the table
  //===================================================================================

  // Get the default sink until there is a valid selection
  const sinkSupplier = this.mod_SinkSupplier === 'None' ||this.mod_SinkId === 'None' ? 'None' : this.mod_SinkSupplier;
	const sinkId = this.mod_SinkSupplier === 'None' || this.mod_SinkId === 'None' ? 'None' : this.mod_SinkId;
  const retMapping = GlobalFunc.find_SinkMapping(sinkSupplier, sinkId);


  // Provide the id's for the sub-module
  const constructionId = retMapping.ConstructionId;
  const graphicId = retMapping.GraphicId;

  // Get the data from the construction table
  const construction = constructionId ? GlobalFunc.find_SinkConstruction(constructionId!) : null;
  const offset = construction?.OffsetBlock ?? 0;
  const posTabX = construction?.PosTabWdt ?? 0;
  const posTabY = construction?.PosTabHgt ?? 0;
  const posTabZ = construction?.PosTabDpt ?? 0;

	//===================================================================================
	// Add the construction module for the sink
  //===================================================================================

  // Add the module
  const Sink = this.addOD_M_mc_Sink01();

  // Set values to the attributes of the child
  Sink.mod_SinkGraphicId = graphicId;
  Sink.mod_SinkConstructionId = constructionId;

  // SetOrigin
  Sink.setOrigin(this.mod_SinkMoveWidth + offset, 0, -this.mod_SinkMoveDepth);

  //===================================================================================
  // Return the data for the cutout to the carcase (add it to the contour)
  //===================================================================================

  // Create an object for the cutout
  if (construction) {
    let objSink = {
      Supplier: this.mod_SinkSupplier,
      Id: this.mod_SinkId,
      CutWidth: construction.CutWidth,
      CutDepth: construction.CutDepth,
      CutRadius: construction.CutRadius,
      CutPosX: this.mod_SinkMoveWidth + offset,
      CutPosY: this.mod_SinkMoveDepth
    }

    // Push the JSON-string to the attribute
    this.mod_CountertopInfo.push(JSON.stringify(objSink));
  }

  //===================================================================================
	// Add the graphic module for the mixer
  //===================================================================================

  if (this.mod_MixerId != 'None') {

    // Add module
    const Mixer = this.addOD_M_mc_ApplianceGraphic();

    // Set values to the attributes of the child
    Mixer.mod_GraphicId = this.mod_MixerId;

    // SetOrigin
    const posX = this.mod_SinkMoveWidth + offset + posTabX;
    const posY = posTabY;
    const posZ = posTabZ - this.mod_SinkMoveDepth;
    Mixer.setOrigin(posX, posY, posZ);

  }