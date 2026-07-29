process_StorageunitShelfbtmConstruction(m: parent, firstBwCon: string = 'None', firstBwPos: number = 0) {

  // Interface to provide the data to the carcase
  //-------------------------------------------------------------------------------------

  interface ShelfBtmInfo {
    BwBtm: number;          // Manage starting position of the first backwall
    BtmPosBack: number;     // Define back side position of the bottom shelf (fixed shelf starting position)
    BtmPosFront: number;    // Frontposition of the bottom shelf (free space calculation)
    BtmPart: string;        // Name of the construction part (provided in the parts list for fittings like push to open)
    Height: number;
    Width: number;
    Depth: number;
    WidthPos: number;
    HeightPos: number;
    DepthPos: number;
  }

  // Initialize the object
  let shelfBtmInfo: ShelfBtmInfo = {
    BwBtm: 0,
    BtmPosBack: 0,
    BtmPosFront: 0,
    BtmPart: 'None',
    Height: 0,
    Width: 0,
    Depth: 0,
    WidthPos: 0,
    HeightPos: 0,
    DepthPos: 0
  };

	// Variables
  //-------------------------------------------------------------------------------------

  let moduleName = 'mc_Storageunit01'
  let tmpBwBtm: number = 0;
  let tmpBtmPosBack: number = 0;
  let tmpBtmPosFront: number = 0;
  let tmpBtmPart: string = '';
  let retBtm: any;

  // Query the settings table to get the module to insert
  //-------------------------------------------------------------------------------------
  let additionalInfo01 = 'All';
  let shelfbtmSettings = GlobalFunc.find_CarcaseShelfbtmSettings(moduleName, m.mod_CarcaseShelfbtmConstruction, additionalInfo01);

  let librarySolution: boolean = shelfbtmSettings.LibrarySolution!;
  let usedModule: string = shelfbtmSettings.UsedModule!;
  let partName = shelfbtmSettings.ConstructionTablePartName!;
  let insertModule: boolean = shelfbtmSettings.InsertModule!;

  //##########################################################################################
  // Library solution
  //##########################################################################################

  if (librarySolution) {

    //====================================================================
    // mc_StorageunitShelfbtm01
    //====================================================================
    if (usedModule == 'mc_StorageunitShelfbtm01') {

      // Calculate tmpAdditionalInfo01 (All or SlopedCeiling to use in the ccc-key)
      let tmpAdditionalInfo01: string = m.mod_SlopeAngle === 0 ? 'All' : 'SlopedCeiling';

      // Get CarcaseBackwConstruction to use as PartBack in CCK_StorageUnit
      let CarcaseBackwConstruction_Btm = GlobalFunc.find_CarcaseBackwallSettings(firstBwCon)!;

      // Query the ccc-Key
      retBtm = GlobalFunc.find_StorageunitConstruction(partName, m.mod_CarcaseConnectionLeftTop, m.mod_CarcaseConnectionLeftBtm, m.mod_CarcaseConnectionRightBtm, m.mod_CarcaseConnectionRightTop, CarcaseBackwConstruction_Btm.ConstructionBackwallBottom!, m.mod_CarcaseFrontConstruction_matrix.Bottom!, m.mod_CarcaseVisBtm, tmpAdditionalInfo01);

      if (insertModule) {

        // Add the module
        let Btm = m.addOD_M_mc_StorageunitShelfbtm01();
        
        // Set values to the attributes of the child
        Btm.mod_Height = retBtm.Height(m, firstBwPos);
        Btm.mod_Width = retBtm.Width(m, firstBwPos);
        Btm.mod_Depth = retBtm.Depth(m, firstBwPos);
        Btm.mod_EdgeFrontType = retBtm.EdgeTypeFront!;
        Btm.mod_EdgeLeftType = retBtm.EdgeTypeLeft!;
        Btm.mod_EdgeBackType = retBtm.EdgeTypeBack!;
        Btm.mod_EdgeRightType = retBtm.EdgeTypeRight!;
        Btm.mod_EdgeJointType = retBtm.EdgeJointType;

        // setOrigin
        Btm.setOrigin(retBtm.WidthPos(m, firstBwPos), retBtm.HeightPos(m, firstBwPos), retBtm.DepthPos(m, firstBwPos));

      }
      
      // Define back side position of the bottom shelf (fixed shelf starting position)
      tmpBtmPosBack = (CarcaseBackwConstruction_Btm.ConstructionBackwallBottom! === 'Overlayed') ? -10 : retBtm.DepthPos(m, firstBwPos);

      // Frontposition of the bottom shelf (free space calculation)
      tmpBtmPosFront = retBtm.Depth(m, firstBwPos) + retBtm.DepthPos(m, firstBwPos);

      // Manage starting position of the first backwall
      tmpBwBtm = retBtm.HeightPos(m, firstBwPos) + retBtm.Height(m, firstBwPos);

      // PartName (for Carcase Parts Info)
      tmpBtmPart = 'ShelfBtm';

    }

    //====================================================================
    // Other modules
    //====================================================================
    else {


    }

  }

  //##########################################################################################
  // Custom solutions (User Exit)
  //##########################################################################################

  else {


  }

  //##########################################################################################
  // Return the needed data to the carcase
  //##########################################################################################

  shelfBtmInfo.BwBtm = tmpBwBtm;
  shelfBtmInfo.BtmPosBack = tmpBtmPosBack;
  shelfBtmInfo.BtmPosFront = tmpBtmPosFront;
  shelfBtmInfo.BtmPart = tmpBtmPart;

  shelfBtmInfo.Height = retBtm.Height(m, firstBwPos);
  shelfBtmInfo.Width = retBtm.Width(m, firstBwPos);
  shelfBtmInfo.Depth = retBtm.Depth(m, firstBwPos);
  shelfBtmInfo.WidthPos = retBtm.WidthPos(m, firstBwPos);
  shelfBtmInfo.HeightPos = retBtm.HeightPos(m, firstBwPos);
  shelfBtmInfo.DepthPos = retBtm.DepthPos(m, firstBwPos);

  return JSON.stringify(shelfBtmInfo);

}