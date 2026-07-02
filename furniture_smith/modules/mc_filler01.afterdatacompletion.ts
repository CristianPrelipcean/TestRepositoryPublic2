
  // Schuler Consulting
  // Create: April 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // Add the main module mc_Filler01
  //
  // Revisions:
  //
  //======================================================================

  //======================================================================
  //          Add the main module mc_Filler01
  //======================================================================

  // Add the module
  //----------------------------------------------------

  const filler = this.addOD_M_mc_FillerFront01();

  // Set the attributes of the child
  //----------------------------------------------------

  filler.mod_CarcaseId = this.mod_CarcaseId;
  filler.mod_FingergripBtmType = "NoFingergrip";
  filler.mod_FingergripTop = false;
  filler.mod_FingergripTopType = "NoFingergrip";
  filler.mod_FrontHeight = this.mod_Height;
  filler.mod_FrontId = this.mod_FrontId;
  filler.mod_FrontOversizeTop = this.mod_GlobalFrontOversizeTop;
  filler.mod_FrontOversizeLeft = this.mod_GlobalFrontOversizeLeft;
  filler.mod_FrontOversizeRight = this.mod_GlobalFrontOversizeRight;
  filler.mod_FrontOversizeBtm = this.mod_GlobalFrontOversizeBtm;
  filler.mod_FrontThk = 19;
  filler.mod_DoorDirection = this.mod_Direction;
  filler.mod_FirstFront = true;
  filler.mod_LastFront = true;
  filler.mod_FrontWidth = this.mod_Width - this.mod_FrontGapVert / 2;
  filler.mod_FillerHardware = this.mod_FillerHardware;

  // setOrigin
  //----------------------------------------------------

  const startPos = this.mod_Direction === "Right" ? this.mod_FrontGapVert / 2 : 0;
  filler.setOrigin(startPos, this.mod_FrontPosStart, this.mod_Depth + this.mod_FrontGapCarcase);

  //======================================================================
  //          Add the connectors
  //======================================================================

  // Add the module
  //----------------------------------------------------

  const side = this.addOD_M_mc_StorageunitSidepanel01();

  // Set the attributes of the child
  //----------------------------------------------------

  side.mod_CarcaseId = this.mod_FrontId;
  side.mod_FingergripTop = false;
  side.mod_FingergripQtyMiddle = 0;
  side.mod_FingergripPos1 = 0;
  side.mod_FingergripPos2 = 0;
  side.mod_FingergripPos3 = 0;
  side.mod_FingergripPos4 = 0;
  side.mod_FingergripPos5 = 0;
  side.mod_CarcaseOutsideColor = this.mod_CarcaseColor;
  side.mod_CarcaseEdgeBackColor = this.mod_CarcaseEdgeColor;
  side.mod_CarcaseOutsideProgram = this.mod_CarcaseProgram;

  side.mod_CarcaseConnectionLeftBtm = "SideCShelf";
  side.mod_CarcaseConnectionLeftTop = "SideCShelf";
  side.mod_CarcaseConnectionRightBtm = "SideCShelf";
  side.mod_CarcaseConnectionRightTop = "SideCShelf";
  side.mod_CarcasePartConnectionBackHor = "BackwallCShelf";
  side.mod_CarcasePartConnectionLeftHor = "SideCShelf";
  side.mod_CarcasePartConnectionRightHor = "SideCShelf";
  side.mod_CarcasePartConnectionTopVert = "ShelfCSide";
  side.mod_CarcasePartConnectionBtmVert = "ShelfCSide";

  side.mod_FittingConnectionBtmVert = "Dowel";
  side.mod_FittingConnectionTopVert = "Dowel";
  side.mod_FittingConnectionLeftBtm = "Dowel";
  side.mod_FittingConnectionLeftTop = "Dowel";
  side.mod_FittingConnectionLeftHor = "Dowel";
  side.mod_FittingConnectionRightBtm = "Dowel";
  side.mod_FittingConnectionRightHor = "Dowel";
  side.mod_FittingConnectionRightTop = "Dowel";

  side.mod_BackHeight = 0;
  side.mod_TopDepth = 0;
  side.mod_SlopeAngle = 0;
  side.mod_SlopedCeilingConstruction = "Construction01";
  side.mod_CarcaseDirection = "Left";
  side.mod_CarcaseVisTop = false;
  side.mod_CarcaseVisBtm = false;
  side.mod_CarcaseVisBack = false;

  side.mod_SidepanelType = "Left";
  side.mod_Width = this.mod_SidepanelleftThk;
  side.mod_Height = this.mod_Height;
  side.mod_Depth = this.mod_Depth - 300;

  // setOrigin
  //----------------------------------------------------

  if (this.mod_Direction === 'Right') {
    side.setOrigin(0, 0, 300);
  }
  else {
    side.setOrigin(this.mod_Width - this.mod_SidepanelleftThk, 0, 300);
  }
