process_CornerunitSidepanelConstruction(m: parent, side: string = 'Left') {

  // Interface to provide the data to the carcase
  //-------------------------------------------------------------------------------------

  interface SidepanelInfo {
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
  let moduleName = 'mc_Cornerunit01';
  //let CarcaseBackwConstruction: any;
  let Sp: any;
  //let tmpBwSp: number = 0;       
  //let tmpSpPosBack: number = 0;
  //let tmpSpPosFront: number = 0;
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
      let tmpAdditionalInfo01: string = 'All';

      // Get CarcaseBackwConstruction to use as PartBack in CCK_StorageUnit
      //CarcaseBackwConstruction = GlobalFunc.find_CarcaseBackwallSettings(firstBwCon)!;

      // Get the constructionBackwall based on the side panel side
      //let constructionBackwall = side == "Left" ? CarcaseBackwConstruction.ConstructionBackwallLeft! : CarcaseBackwConstruction.ConstructionBackwallRight!;

      // Get the constructionFront based on the side panel side
      let constructionFrontLeft = 'n.a.'; 
      let constructionFrontRight = 'n.a.';
      if (side == "Left") {
        constructionFrontLeft = m.mod_CarcaseFrontConstruction_matrix.Left!;
      }
      if (side == "Right") {
        constructionFrontRight = m.mod_CarcaseFrontConstruction_matrix.Right!;
      }

      // Get the visibility based on the side panel side
      let visibility = side == "Left" ? m.mod_CarcaseVisLeft : m.mod_CarcaseVisRight;

      // Query the ccc-Key
      retSp = GlobalFunc.find_CarcaseCornerunitConstruction(partName, m.mod_CarcaseConnectionLeftTop, m.mod_CarcaseConnectionLeftBtm, m.mod_CarcaseConnectionRightBtm, m.mod_CarcaseConnectionRightTop, 'n.a.', constructionFrontLeft, 'n.a.', constructionFrontRight, visibility, tmpAdditionalInfo01);

      if (insertModule) {

        // Add the module
        Sp = m.addOD_M_mc_StorageunitSidepanel01();
        
        // Set values to the attributes of the child
        Sp.mod_Height = retSp.Height(m);
        Sp.mod_Width = retSp.Width(m);
        Sp.mod_Depth = retSp.Depth(m);
        Sp.mod_SidepanelType = partType;
        Sp.mod_EdgeFrontType = retSp.EdgeTypeFront!;
        Sp.mod_EdgeLeftType = retSp.EdgeTypeLeft!;
        Sp.mod_EdgeBackType = retSp.EdgeTypeBack!;
        Sp.mod_EdgeRightType = retSp.EdgeTypeRight!;
        Sp.mod_EdgeJointType = retSp.EdgeJointType;
        Sp.mod_Originpos.push(retSp.WidthPos(m));
        Sp.mod_Originpos.push(retSp.HeightPos(m));
        Sp.mod_Originpos.push(retSp.DepthPos(m));

        //Rotate and set setOrigin
        let rotation: number = side == "Left" ? 90 : 0;
        let positionCorrection: number = side == "Left" ? retSp.Width(m) : 0;
        let modMatrix = ModuleHelper.posAndRotateY(retSp.WidthPos(m), retSp.HeightPos(m), retSp.DepthPos(m) + positionCorrection, rotation, new Vector3(retSp.WidthPos(m), retSp.HeightPos(m), retSp.DepthPos(m) + positionCorrection));
        Sp.setOrigin(modMatrix);

      }


      // Manage starting position of the backwalls on the side
      //let tmpSpThk = side == 'Left' ? retSp.Width(m) : 0
      //tmpBwSp = retSp.WidthPos(m) + tmpSpThk;

      // Define back side position of the sidepanel (fixed shelf starting position)
      //tmpSpPosBack = constructionBackwall == 'Overlayed' ? -10 : retSp.DepthPos(m);

      // Frontposition of the sidepanel (free space calculation)
      //tmpSpPosFront = retSp.Depth(m, firstBwPos) + retSp.DepthPos(m, firstBwPos);

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

  //sidepanelInfo.BwSp = tmpBwSp;
  //sidepanelInfo.SpPosBack = tmpSpPosBack;
  //sidepanelInfo.SpPosFront = tmpSpPosFront;
  sidepanelInfo.SpPart = tmpSpPart;

  sidepanelInfo.Height = retSp.Height(m);
  sidepanelInfo.Width = retSp.Width(m);
  sidepanelInfo.Depth = retSp.Depth(m);
  sidepanelInfo.WidthPos = retSp.WidthPos(m);
  sidepanelInfo.HeightPos = retSp.HeightPos(m);
  sidepanelInfo.DepthPos = retSp.DepthPos(m);

  return JSON.stringify(sidepanelInfo);

}