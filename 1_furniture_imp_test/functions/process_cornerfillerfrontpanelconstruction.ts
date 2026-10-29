process_CornerFillerFrontpanelConstruction(m: parent, moduleName: string, CornerFillerFrontConstruction: string, carcaseDirection: string, widthLeft:number, widthRight:number, heightLeft:number, heightRight:number, carcaseWidth:number, carcaseDepth:number, startPositionHeight:number, cornerUnitFrontWidth:number = 0, frontHeightNumber:number = 0) { 

  // Initialize variables
  let countElem = 0;

  // Query the construction table to get the modules to insert
	//-------------------------------------------------------------------------------------
  let retCornerFiller = GlobalFunc.find_CornerFillerFrontpanelConstruction(moduleName, CornerFillerFrontConstruction, carcaseDirection);

  // Insert Corner Filler Front panels
  //-------------------------------------------------------------------------------------
  retCornerFiller.forEach(elem => {
    countElem++;
    // Module is mc_CornerFillerFront01
    if (elem.Module == 'mc_CornerFillerFront01') { 

      if (elem.InsertModule) { // If module should be inserted

        // Insert module
        let frontPanelModule = m.addOD_M_mc_CornerFillerFront01();

        // Get const Pos values from table
        const widthPos = elem.WidthPos(m, widthLeft, widthRight, heightLeft, heightRight, carcaseWidth, carcaseDepth, startPositionHeight, cornerUnitFrontWidth);
        const heightPos = elem.HeigthPos(m, widthLeft, widthRight, heightLeft, heightRight, carcaseWidth, carcaseDepth, startPositionHeight, cornerUnitFrontWidth);
        const depthPos = elem.DepthPos(m, widthLeft, widthRight, heightLeft, heightRight, carcaseWidth, carcaseDepth, startPositionHeight, cornerUnitFrontWidth);
        const rotationPointWidth = elem.RotationPointWidth(m, widthLeft, widthRight, heightLeft, heightRight, carcaseWidth, carcaseDepth, startPositionHeight, cornerUnitFrontWidth);
        const rotationPointHeight = elem.RotationPointHeight(m, widthLeft, widthRight, heightLeft, heightRight, carcaseWidth, carcaseDepth, startPositionHeight, cornerUnitFrontWidth);
        const rotationPointDepth = elem.RotationPointDepth(m, widthLeft, widthRight, heightLeft, heightRight, carcaseWidth, carcaseDepth, startPositionHeight, cornerUnitFrontWidth);


        // Set values to the attributes
        frontPanelModule.mod_FrontWidth = elem.Width(m, widthLeft,widthRight, heightLeft, heightRight, carcaseWidth, carcaseDepth, startPositionHeight, cornerUnitFrontWidth);
        frontPanelModule.mod_FrontHeight = elem.Height(m, widthLeft,widthRight, heightLeft, heightRight, carcaseWidth, carcaseDepth, startPositionHeight, cornerUnitFrontWidth);
        frontPanelModule.mod_FrontThk = elem.Depth(m, widthLeft,widthRight, heightLeft, heightRight, carcaseWidth, carcaseDepth, startPositionHeight, cornerUnitFrontWidth);
        frontPanelModule.mod_DoorDirection = elem.Direction;
        frontPanelModule.mod_Direction = elem.Direction;
        frontPanelModule.mod_CarcaseDirection = carcaseDirection;

        let frontHeightNumberText = frontHeightNumber == 0 ? '' : '_' + frontHeightNumber.toString();
        frontPanelModule.mod_FrontId = elem.FrontId! + frontHeightNumberText + '_' + countElem.toString();
        
        frontPanelModule.mod_FrontType = elem.FrontId!;
        
        frontPanelModule.mod_Originpos.push(widthPos);
        frontPanelModule.mod_Originpos.push(heightPos);
        frontPanelModule.mod_Originpos.push(depthPos);

        //Set origin
        let modMatrix = ModuleHelper.posAndRotateY(widthPos, heightPos, depthPos, elem.RotationAngle, new Vector3(rotationPointWidth, rotationPointHeight, rotationPointDepth));
        frontPanelModule.setOrigin(modMatrix);

      }

    }
      

  })




  
  return 'END'
}