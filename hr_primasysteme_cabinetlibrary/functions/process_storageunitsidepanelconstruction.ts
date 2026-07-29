process_StorageunitSidepanelConstruction(m: parent, side: string = 'Left', firstBwCon: string = 'None', firstBwPos: number = 0) {

  // Interface to provide the data to the carcase
  //-------------------------------------------------------------------------------------

  interface SidepanelInfo {
    BwSp: number;           // Manage starting position of the backwalls on the side
    SpPosBack: number;      // Define back side position of the sidepanel (fixed shelf starting position)
    SpPosFront: number;     // Frontposition of the sidepanel (free space calculation)
    SpPart: string;         // Name of the construction part (provided in the parts list for fittings like push to open)
    Height: number;
    Width: number;
    Depth: number;
    WidthPos: number;
    HeightPos: number;
    DepthPos: number;
  }

  // Initialize the object
  let sidepanelInfo: SidepanelInfo = {
    BwSp: 0,
    SpPosBack: 0,
    SpPosFront: 0,
    SpPart: 'None',
    Height: 0,
    Width: 0,
    Depth: 0,
    WidthPos: 0,
    HeightPos: 0,
    DepthPos: 0
  };

  // Variables
  //-------------------------------------------------------------------------------------
  let moduleName = 'mc_Storageunit01';
  let CarcaseBackwConstruction: any;
  let Sp: any;
  let tmpBwSp: number = 0;       
  let tmpSpPosBack: number = 0;
  let tmpSpPosFront: number = 0;
  let tmpSpPart: string = '';
  let retSp: any;

  // Query the settings table to get the module to insert
	//-------------------------------------------------------------------------------------

	let additionalInfo01 = 'All';
	let sidePanelSettings = GlobalFunc.find_CarcaseSidepanelSettings(moduleName, side == 'Left' ? m.mod_SidepanelleftType : m.mod_SidepanelrightType, side, additionalInfo01);

  let librarySolution: boolean = sidePanelSettings.LibrarySolution!;
  let usedModule: string = sidePanelSettings.UsedModule!;
  let partName = sidePanelSettings.ConstructionTablePartName!;
  let insertModule: boolean = sidePanelSettings.InsertModule!; 
  let partType: string = sidePanelSettings.PartType!;

  //##########################################################################################
  // Library solution
  //##########################################################################################

  if (librarySolution) {

    //====================================================================
    // mc_StorageunitSidepanel01
    //====================================================================
    if (usedModule == 'mc_StorageunitSidepanel01') {

      // Calculate tmpAdditionalInfo01 (All or SlopedCeiling to use in the ccc-key)
      let tmpAdditionalInfo01: string = m.mod_SlopeAngle === 0 ? 'All' : 'SlopedCeiling';

      // Get CarcaseBackwConstruction to use as PartBack in CCK_StorageUnit
      CarcaseBackwConstruction = GlobalFunc.find_CarcaseBackwallSettings(firstBwCon)!;

      // Get the constructionBackwall based on the side panel side
      let constructionBackwall = side == "Left" ? CarcaseBackwConstruction.ConstructionBackwallLeft! : CarcaseBackwConstruction.ConstructionBackwallRight!;

      // Get the constructionFront based on the side panel side
      let constructionFront = side == "Left" ? m.mod_CarcaseFrontConstruction_matrix.Left! : m.mod_CarcaseFrontConstruction_matrix.Right!;

      // Get the visibility based on the side panel side
      let visibility = side == "Left" ? m.mod_CarcaseVisLeft : m.mod_CarcaseVisRight;

      // Query the ccc-Key
      retSp = GlobalFunc.find_StorageunitConstruction(partName, m.mod_CarcaseConnectionLeftTop, m.mod_CarcaseConnectionLeftBtm, m.mod_CarcaseConnectionRightBtm, m.mod_CarcaseConnectionRightTop, constructionBackwall, constructionFront, visibility, tmpAdditionalInfo01);

      if (insertModule) {

        // Add the module
        Sp = m.addOD_M_mc_StorageunitSidepanel01();
        
        // Set values to the attributes of the child
        Sp.mod_Height = retSp.Height(m, firstBwPos);
        Sp.mod_Width = retSp.Width(m, firstBwPos);
        Sp.mod_Depth = retSp.Depth(m, firstBwPos);
        Sp.mod_SidepanelType = partType;
        Sp.mod_EdgeFrontType = retSp.EdgeTypeFront!;
        Sp.mod_EdgeLeftType = retSp.EdgeTypeLeft!;
        Sp.mod_EdgeBackType = retSp.EdgeTypeBack!;
        Sp.mod_EdgeRightType = retSp.EdgeTypeRight!;
        Sp.mod_EdgeJointType = retSp.EdgeJointType;
        Sp.mod_Originpos.push(retSp.WidthPos(m, firstBwPos));
        Sp.mod_Originpos.push(retSp.HeightPos(m, firstBwPos));
        Sp.mod_Originpos.push(retSp.DepthPos(m, firstBwPos));
        Sp.mod_CarcaseVisLeft = m.mod_CarcaseVisLeft;
		    Sp.mod_CarcaseVisRight = m.mod_CarcaseVisRight;

        // setOrigin
        Sp.setOrigin(retSp.WidthPos(m, firstBwPos), retSp.HeightPos(m, firstBwPos), retSp.DepthPos(m, firstBwPos));
      }


      // Manage starting position of the backwalls on the side
      let tmpSpThk = side == 'Left' ? retSp.Width(m, firstBwPos) : 0
      tmpBwSp = retSp.WidthPos(m, firstBwPos) + tmpSpThk;

      // Define back side position of the sidepanel (fixed shelf starting position)
      tmpSpPosBack = constructionBackwall == 'Overlayed' ? -10 : retSp.DepthPos(m, firstBwPos);

      // Frontposition of the sidepanel (free space calculation)
      tmpSpPosFront = retSp.Depth(m, firstBwPos) + retSp.DepthPos(m, firstBwPos);

      // PartName (for Carcase Parts Info)
      tmpSpPart = side === 'Left' ? 'LeftSidePanel' : 'RightSidePanel';

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

  sidepanelInfo.BwSp = tmpBwSp;
  sidepanelInfo.SpPosBack = tmpSpPosBack;
  sidepanelInfo.SpPosFront = tmpSpPosFront;
  sidepanelInfo.SpPart = tmpSpPart;

  sidepanelInfo.Height = retSp.Height(m, firstBwPos);
  sidepanelInfo.Width = retSp.Width(m, firstBwPos);
  sidepanelInfo.Depth = retSp.Depth(m, firstBwPos);
  sidepanelInfo.WidthPos = retSp.WidthPos(m, firstBwPos);
  sidepanelInfo.HeightPos = retSp.HeightPos(m, firstBwPos);
  sidepanelInfo.DepthPos = retSp.DepthPos(m, firstBwPos);

  return JSON.stringify(sidepanelInfo);

}