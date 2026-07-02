
  // Schuler Consulting
  // Create: November 2023
  // By Henning Wiesbrock
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mf_Fliplift
  // Add module for the flip lift elements
  // Add module for the adjustable shelves
  //
  // Revisions:
  // September 2025
  // By Ludwig Weber
  // Change the adjustable shelves
  // Add the equipment adjustable shelf multiple
  //===============================================================================================

  //===============================================================================================
  //          Get the Free Space and Part Info
  //===============================================================================================

  // Import CarcaseSpaceDimension
  //---------------------------------------------------
  const CarcaseSpaceDimension = JSON.parse(this.mod_CarcaseSpaceDimension[0]);

  // Import CarcasePartInfo (before modification)
  //---------------------------------------------------
  const carcasePartInfo = JSON.parse(this.mod_CarcasePartInfo[0]);

  // Build a new object for carcase part info per front
  //---------------------------------------------------
  const CarcasePartInfoPerFront: any = {
    HorizontalPartsType: carcasePartInfo.HorizontalPartsType,
    HorizontalPartsPosY: carcasePartInfo.HorizontalPartsPosY,
    HorizontalPartsPosZ: carcasePartInfo.HorizontalPartsPosZ,
    HorizontalPartsDimY: carcasePartInfo.HorizontalPartsDimY,
    HorizontalPartsDimZ: carcasePartInfo.HorizontalPartsDimZ,
    HorizontalPartsFrontAngle: carcasePartInfo.HorizontalPartsFrontAngle
  };

  // List of vertical-related property names
  // These are the keys in `carcasePartInfo` that contain
  // arrays of values for each vertical carcase part.
  // All horizontal part data is kept as-is (entire arrays),
  // while vertical data will be restricted to two entries.
  //---------------------------------------------------
  const i = 1;
  const verticalProps = [
    'VerticalPartsType',
    'VerticalPartsPosX',
    'VerticalPartsPosZ',
    'VerticalPartsDimX',
    'VerticalPartsDimZ',
    'VerticalPartsFrontAngle'
  ];
  for (const key of verticalProps) {
    CarcasePartInfoPerFront[key] = [
      carcasePartInfo[key][i - 1], // previous vertical part
      carcasePartInfo[key][i]      // current vertical part
    ];
  }

  // Serialize the modified CarcasePartInfo for use in child modules
  //---------------------------------------------------
  const CarcasePartInfoPerFrontJson = JSON.stringify(CarcasePartInfoPerFront);

  ///===============================================================================================
  //          Add module for the Flip Lift (single front)
  //===============================================================================================

  if (this.mod_FlipliftType != 'FHF') {

    // Add the module
    let fliplift = this.addOD_M_mc_Fliplift01();
    fliplift.setOrigin(0, 0, this.mod_FrontGapCarcase);

    // Set attributes of the childs
    fliplift.mod_FrontId = this.mod_FrontId;
    fliplift.mod_FrontWidth = this.mod_FrontWidth;
    fliplift.mod_Originpos.push(this.mod_Originpos[0]);
    fliplift.mod_Originpos.push(this.mod_Originpos[1]);
    fliplift.mod_Originpos.push(this.mod_Originpos[2] + this.mod_FrontGapCarcase);
    fliplift.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);
    fliplift.mod_CarcasePartInfo.push(CarcasePartInfoPerFrontJson);

    // Management of the front heights
    fliplift.mod_FrontHeight = this.mod_FrontHeight;
    fliplift.mod_FlipliftFrontHeightList.push(this.mod_FrontHeight);
    fliplift.mod_FlipliftFrontNumber = 0;
  }

  //===============================================================================================
  //          Add module for the Flip Lift FHF (splitted front)
  //===============================================================================================

  else if (this.mod_FlipliftType == 'FHF') {

    // Value from the attribute
    if (this.mod_FrontSplitDescriptor != 'Automatic') {

      // Prozess Descriptor
      let DescriptorList = GlobalFunc.process_Descriptor(this.mod_FrontSplitDescriptor, this.mod_FrontHeight);

      // Select the first value of the descriptor for calculation of the top front panel
      let BottomHeight = DescriptorList[0];

      // Creates a new array of front heights and adds the second front height (Because the descriptor only delivers the first front)
      let FrontHeightList = DescriptorList.length > 0 ? [...DescriptorList, this.mod_FrontHeight! - BottomHeight] : [this.mod_FrontHeight!];

      // Creates a new array of front heights corrected by the gap     
      let FrontHeights = FrontHeightList.map(h => h - this.mod_FrontGapHor / 2);

      // Add the bottom front
      //----------------------------------------------
      let FlipliftBtm = this.addOD_M_mc_Fliplift01(1);
      FlipliftBtm.setOrigin(0, 0, this.mod_FrontGapCarcase);

      // Set the attributes for bottom front
      FlipliftBtm.mod_FrontId = this.mod_FrontId + "Btm"
      FlipliftBtm.mod_FrontWidth = this.mod_FrontWidth;
      FlipliftBtm.mod_Originpos.push(this.mod_Originpos[0]);
      FlipliftBtm.mod_Originpos.push(this.mod_Originpos[1]);
      FlipliftBtm.mod_Originpos.push(this.mod_Originpos[2] + this.mod_FrontGapCarcase);
      FlipliftBtm.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);
      FlipliftBtm.mod_CarcasePartInfo.push(CarcasePartInfoPerFrontJson);
      FlipliftBtm.mod_LastFront = false;
      FlipliftBtm.mod_FrontOversizeTop = 0;

      // Manage the front heights
      FlipliftBtm.mod_FrontHeight = FrontHeights[0];
      FlipliftBtm.mod_FlipliftFrontHeightList.push(...FrontHeights);
      FlipliftBtm.mod_FlipliftFrontNumber = 0;

      // Get the handle weight
      let sealedBtmFliplift = FlipliftBtm.seal();

      // Add the top front
      //----------------------------------------------
      let FlipliftTop = this.addOD_M_mc_Fliplift01(0);
      FlipliftTop.setOrigin(0, FrontHeights[0] + this.mod_FrontGapHor, this.mod_FrontGapCarcase);

      //Set the attributes for top front
      FlipliftTop.mod_FrontId = this.mod_FrontId + "Top"
      FlipliftTop.mod_FrontWidth = this.mod_FrontWidth;
      FlipliftTop.mod_Originpos.push(this.mod_Originpos[0]);
      FlipliftTop.mod_Originpos.push(this.mod_Originpos[1] + FrontHeights[0]);
      FlipliftTop.mod_Originpos.push(this.mod_Originpos[2] + this.mod_FrontGapCarcase);
      FlipliftTop.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);
      FlipliftTop.mod_CarcasePartInfo.push(CarcasePartInfoPerFrontJson);
      FlipliftTop.mod_FrontPosStart! += FrontHeights[0]! + this.mod_FrontGapHor;
      FlipliftTop.mod_FirstFront = false;
      FlipliftTop.mod_FrontOversizeBtm = 0;

      // Manage the front heights
      FlipliftTop.mod_FrontHeight = FrontHeights[1];
      FlipliftTop.mod_FlipliftFrontHeightList.push(...FrontHeights);
      FlipliftTop.mod_FlipliftFrontNumber = 1;

      // Set the handle weight
      FlipliftTop.mod_HandleWeightCalculations.push(sealedBtmFliplift.mod_HandleWeightCalculations[0]);
    }
  }

  //===============================================================================================
  //          Find Equipment Docked
  //===============================================================================================

  // Check if an equipment is docked in the cabinet
  let checkEquipmentDocked = false;

  // Cycle through all children of the mf_Door
  this.m.forEach((p, index) => {

    // If there is a shelfadjMultiple
    if (p instanceof OD_M_me_ShelfadjMultiple01) {
      checkEquipmentDocked = true;

      p.mod_Width = CarcaseSpaceDimension.WidthFreeSpace;
      p.mod_Depth = CarcaseSpaceDimension.DepthFreeSpace;
      p.mod_ShelfadjPartParentName = "Fliplift";
      p.mod_ShelfadjPartParentType = this.mod_FlipliftType;
      p.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);
      p.mod_CarcaseId = this.mod_CarcaseId;

      // SetOrigin of the child
      p.setOrigin(CarcaseSpaceDimension.WidthFreeStartPos - this.mod_Originpos[0], CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1], CarcaseSpaceDimension.DepthFreeStartPos - this.mod_Originpos[2]);
    }
  })

  //===============================================================================================
  //          Add module for the adjustable shelf (Standard if no equipment docked)
  //===============================================================================================

  if (!checkEquipmentDocked) {

    // Add the module
    let shelfadjgroup = this.addOD_M_mc_ShelfadjGroup01();

    // Set the attributes to the child 
    shelfadjgroup.mod_Width = CarcaseSpaceDimension.WidthFreeSpace;
    shelfadjgroup.mod_Depth = CarcaseSpaceDimension.DepthFreeSpace;
    shelfadjgroup.mod_Height = CarcaseSpaceDimension.HeightFreeSpace;
    shelfadjgroup.mod_ShelfadjPartParentName = "Fliplift";
    shelfadjgroup.mod_ShelfadjPartParentType = this.mod_FlipliftType;
    shelfadjgroup.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);

    // SetOrigin of the child
    shelfadjgroup.setOrigin(CarcaseSpaceDimension.WidthFreeStartPos - this.mod_Originpos[0], CarcaseSpaceDimension.HeightFreeStartPos - this.mod_Originpos[1], CarcaseSpaceDimension.DepthFreeStartPos - this.mod_Originpos[2])
  }