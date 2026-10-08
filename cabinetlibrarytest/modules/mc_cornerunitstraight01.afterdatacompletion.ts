
  // Schuler Consulting
  // Create: Feb 2024
  // By Joao Lisboa
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mc_CornerunitStraight
  // Add module for the blind panel
  // Add module for the Cleat
  //
  //
  // Revisions:
  // 
  //===================================================

  // Get the FreeSpace and StartPosition
  let CarcaseSpaceDimension = JSON.parse(this.mod_CarcaseSpaceDimension[0]);

  // Check if carcase has Fingergrip on Top
  let tmpFingergripTop: boolean = false;
  if (this.mod_FingergripTop) {tmpFingergripTop = false}

  //===================================================
  //          Add module for the Blind Panel
  //===================================================

  let BlidPanelThk : number=0;
  let BlidPanelWidth : number=0;
  let BlindPanelPos: number = 0;

  let carcaseSpaceWidth = CarcaseSpaceDimension.FullWidthFreeSpace;
  let carcaseSpaceHeight = CarcaseSpaceDimension.FullHeightFreeSpace;
  let carcaseSpaceDepth = CarcaseSpaceDimension.FullDepthFreeSpace;
  let carcasePosTopShelf = CarcaseSpaceDimension.PosTopShelf;
  let CarcaseSpaceWidthStartpos = CarcaseSpaceDimension.FullWidthStartPos;
  let CarcaseSpaceHeightStartpos = CarcaseSpaceDimension.FullHeightStartPos;
  let CarcaseSpaceDepthStartpos = CarcaseSpaceDimension.FullDepthStartPos;

  if (this.mod_CornerunitStraightConstruction_matrix.IncludePanelblind)
  {
    // Define variables
    let tmpPb:string = 'part_Panelblind';


    // Add the module
    let Pb= this.addOD_M_mc_Panelblind01();

    // Query the construction table
    let retPb = GlobalFunc.find_CornerunitStraightConstruction(this.mod_CornerunitStraightConstruction, this.mod_CarcaseDirection, tmpPb, tmpFingergripTop);

    // Set values to the attributes of the mc_Panelblind
    Pb.mod_Height=retPb.Height(this,carcaseSpaceWidth!,carcaseSpaceHeight!,carcaseSpaceDepth!,CarcaseSpaceWidthStartpos!,CarcaseSpaceHeightStartpos!,CarcaseSpaceDepthStartpos!)!;
    Pb.mod_Width=retPb.Width(this,carcaseSpaceWidth!,carcaseSpaceHeight!,carcaseSpaceDepth!,CarcaseSpaceWidthStartpos!,CarcaseSpaceHeightStartpos!,CarcaseSpaceDepthStartpos!)!;
    Pb.mod_Depth=retPb.Depth(this,carcaseSpaceWidth!,carcaseSpaceHeight!,carcaseSpaceDepth!,CarcaseSpaceWidthStartpos!,CarcaseSpaceHeightStartpos!,CarcaseSpaceDepthStartpos!)!;

    // setOrigin
    Pb.setOrigin(retPb.WidthPos(this,carcaseSpaceWidth!,carcaseSpaceHeight!,carcaseSpaceDepth!,CarcaseSpaceWidthStartpos!,CarcaseSpaceHeightStartpos!,CarcaseSpaceDepthStartpos!)!,retPb.HeightPos(this,carcaseSpaceWidth!,carcaseSpaceHeight!,carcaseSpaceDepth!,CarcaseSpaceWidthStartpos!,CarcaseSpaceHeightStartpos!,CarcaseSpaceDepthStartpos!)!,retPb.DepthPos(this,carcaseSpaceWidth!,carcaseSpaceHeight!,carcaseSpaceDepth!,CarcaseSpaceWidthStartpos!,CarcaseSpaceHeightStartpos!,CarcaseSpaceDepthStartpos!)!); 

    BlidPanelThk = retPb.Depth(this,carcaseSpaceWidth!,carcaseSpaceHeight!,carcaseSpaceDepth!,CarcaseSpaceWidthStartpos!,CarcaseSpaceHeightStartpos!,CarcaseSpaceDepthStartpos!)!;
    BlidPanelWidth = retPb.Width(this,carcaseSpaceWidth!,carcaseSpaceHeight!,carcaseSpaceDepth!,CarcaseSpaceWidthStartpos!,CarcaseSpaceHeightStartpos!,CarcaseSpaceDepthStartpos!)!;
    BlindPanelPos = retPb.WidthPos(this,carcaseSpaceWidth!,carcaseSpaceHeight!,carcaseSpaceDepth!,CarcaseSpaceWidthStartpos!,CarcaseSpaceHeightStartpos!,CarcaseSpaceDepthStartpos!)!
  }
 
  //===================================================
  //          Add module for the MiddleSideShort
  //===================================================
  let SPMThk: number = 0;
  let SPMPosX: number = 0;
  let SPMPosZ: number = 0;
  let SPMDimZ: number = 0;

  if (this.mod_CornerunitStraightConstruction_matrix.IncludeMiddleSideShort) {
    // Define variables
    let tmpSPM: string = 'part_Sidepanelmiddle';

    // Add the module
    let SPM = this.addOD_M_mc_VertDivider01();

    // Query the construction table
    let retSPM = GlobalFunc.find_CornerunitStraightConstruction(this.mod_CornerunitStraightConstruction, this.mod_CarcaseDirection, tmpSPM, tmpFingergripTop);

    // Set values to the attributes of the mc_Panelblind
    SPM.mod_Height = retSPM.Height(this, carcaseSpaceWidth!, carcasePosTopShelf!, carcaseSpaceDepth!, CarcaseSpaceWidthStartpos!, CarcaseSpaceHeightStartpos!, CarcaseSpaceDepthStartpos!)!;
    SPM.mod_Width = retSPM.Width(this, carcaseSpaceWidth!, carcasePosTopShelf!, carcaseSpaceDepth!, CarcaseSpaceWidthStartpos!, CarcaseSpaceHeightStartpos!, CarcaseSpaceDepthStartpos!)!;
    SPM.mod_Depth = retSPM.Depth(this, carcaseSpaceWidth!, carcasePosTopShelf!, carcaseSpaceDepth!, CarcaseSpaceWidthStartpos!, CarcaseSpaceHeightStartpos!, CarcaseSpaceDepthStartpos!)!;
    SPM.mod_VertDividerType = 'MiddleSideShort';

    // setOrigin
    SPM.setOrigin(
      retSPM.WidthPos(this, carcaseSpaceWidth!, carcasePosTopShelf!, carcaseSpaceDepth!, CarcaseSpaceWidthStartpos!, CarcaseSpaceHeightStartpos!, CarcaseSpaceDepthStartpos!)!,
      retSPM.HeightPos(this, carcaseSpaceWidth!, carcasePosTopShelf!, carcaseSpaceDepth!, CarcaseSpaceWidthStartpos!, CarcaseSpaceHeightStartpos!, CarcaseSpaceDepthStartpos!)!,
      retSPM.DepthPos(this, carcaseSpaceWidth!, carcasePosTopShelf!, carcaseSpaceDepth!, CarcaseSpaceWidthStartpos!, CarcaseSpaceHeightStartpos!, CarcaseSpaceDepthStartpos!)!
    );

    SPMThk = retSPM.Width(this, carcaseSpaceWidth!, carcasePosTopShelf!, carcaseSpaceDepth!, CarcaseSpaceWidthStartpos!, CarcaseSpaceHeightStartpos!, CarcaseSpaceDepthStartpos!)!;
    SPMPosX = retSPM.WidthPos(this, carcaseSpaceWidth!, carcasePosTopShelf!, carcaseSpaceDepth!, CarcaseSpaceWidthStartpos!, CarcaseSpaceHeightStartpos!, CarcaseSpaceDepthStartpos!)!;
    SPMPosZ = retSPM.DepthPos(this, carcaseSpaceWidth!, carcasePosTopShelf!, carcaseSpaceDepth!, CarcaseSpaceWidthStartpos!, CarcaseSpaceHeightStartpos!, CarcaseSpaceDepthStartpos!)!;
    SPMDimZ = retSPM.Depth(this, carcaseSpaceWidth!, carcasePosTopShelf!, carcaseSpaceDepth!, CarcaseSpaceWidthStartpos!, CarcaseSpaceHeightStartpos!, CarcaseSpaceDepthStartpos!)!;

  }

  // Export informations to be used in other modules
  let cornerunitInfo: any = {
    MiddleSideShortThk  : SPMThk,
    MiddleSideShortPosX  : SPMPosX,
    MiddleSideShortPosZ  : SPMPosZ,
    MiddleSideShortDimZ  : SPMDimZ,
    BlindPanelThk	      :	BlidPanelThk,
    BlindPanelWidth     : BlidPanelWidth,
    BlindPanelPos	      :	BlindPanelPos
  };  
  this.mod_CornerunitInfo.push(JSON.stringify(cornerunitInfo));