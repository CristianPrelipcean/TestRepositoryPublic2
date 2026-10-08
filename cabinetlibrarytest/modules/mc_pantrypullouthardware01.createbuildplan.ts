
  // Schuler Consulting
  // Create: November 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // Add parts for hardware
  // Provide data for BOM
  // Add the drillpart for NC
  //
  // Revisions: 
  //===================================================

  //===================================================
  //          Call the process function
  //===================================================

  const hwData = JSON.parse(this.mod_Information);

  //===================================================
  //          Try to add the parts
  //===================================================

  if (hwData) {

    // Slide bottom
    if(hwData.SlideBtm.Model3D){
      const slideBtm = this.addpart_PantryPulloutHardware(hwData.SlideBtm.PosX, hwData.SlideBtm.PosY, hwData.SlideBtm.PosZ, hwData.SlideBtm.DimX, hwData.SlideBtm.DimY, hwData.SlideBtm.DimZ);
      slideBtm.assign3DModel(hwData.SlideBtm.Model3D);
      GlobalFunc.process_AddMaterial(slideBtm, 'hardware', hwData.SlideBtm.Color);
    }

    // Slide top
    if(hwData.SlideTop.Model3D){
      const slideTop = this.addpart_PantryPulloutHardware(hwData.SlideTop.PosX, hwData.SlideTop.PosY, hwData.SlideTop.PosZ, hwData.SlideTop.DimX, hwData.SlideTop.DimY, hwData.SlideTop.DimZ);
      slideTop.assign3DModel(hwData.SlideTop.Model3D);
      GlobalFunc.process_AddMaterial(slideTop, 'hardware', hwData.SlideTop.Color);
    }


    // Connector top
    if(hwData.ConnectorTop.Model3D){
      const connectorTop = this.addpart_PantryPulloutHardware(hwData.ConnectorTop.PosX, hwData.ConnectorTop.PosY, hwData.ConnectorTop.PosZ, hwData.ConnectorTop.DimX, hwData.ConnectorTop.DimY, hwData.ConnectorTop.DimZ);
      connectorTop.assign3DModel(hwData.ConnectorTop.Model3D);
      this.assignOpenGroup(this.mod_FrontId, connectorTop);
      GlobalFunc.process_AddMaterial(connectorTop, 'hardware', hwData.ConnectorTop.Color);
    }

    // Connector bottom
    if (hwData.ConnectorBtm.Model3D){
      const connectorBtm = this.addpart_PantryPulloutHardware(hwData.ConnectorBtm.PosX, hwData.ConnectorBtm.PosY, hwData.ConnectorBtm.PosZ, hwData.ConnectorBtm.DimX, hwData.ConnectorBtm.DimY, hwData.ConnectorBtm.DimZ);
      connectorBtm.assign3DModel(hwData.ConnectorBtm.Model3D);
      this.assignOpenGroup(this.mod_FrontId, connectorBtm);
      GlobalFunc.process_AddMaterial(connectorBtm, 'hardware', hwData.ConnectorBtm.Color);
    }

    // Frame
    if(hwData.Frame.Model3D){
      const framePart = this.addpart_PantryPulloutHardware(hwData.Frame.PosX, hwData.Frame.PosY, hwData.Frame.PosZ, hwData.Frame.DimX, hwData.Frame.DimY, hwData.Frame.DimZ);
      this.assignOpenGroup(this.mod_FrontId, framePart);
      framePart.assign3DModel(hwData.Frame.Model3D);
      GlobalFunc.process_AddMaterial(framePart, 'hardware', hwData.Frame.Color);
    }

    // Baskets
    for (let i = 0; i < hwData.ListBaskets.length; i++) {
      const basket = hwData.ListBaskets[i];
      if(basket.Model3D){       
        const basketPart = this.addpart_PantryPulloutHardware(basket.PosX, basket.PosY, basket.PosZ, basket.DimX, basket.DimY, basket.DimZ);
        this.assignOpenGroup(this.mod_FrontId, basketPart);
        basketPart.assign3DModel(basket.Model3D);
        GlobalFunc.process_AddMaterial(basketPart, 'hardware', basket.Color);
      }
    }   
  }

  // Insert Bom-Data
  const bomPart = this.addpart_PantryPulloutBom(0, 0, 0, 0, 0, 0);
  this.assignPartGroup(this.mod_FrontId, bomPart);
  const bomData = {
    FrameId: hwData.BomIdFrame,
    BasketId: hwData.BomIdBasket,
    BasketsQty: hwData.BasketQty
  };
  bomPart.pa_HardwareId = JSON.stringify(bomData);
