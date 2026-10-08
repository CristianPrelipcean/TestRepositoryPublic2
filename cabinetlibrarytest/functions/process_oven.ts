process_Oven(root: any, oven: any, carc: any, FrontStartPos: number = 0, CabinetStartPos: number = 0): { nextFront: number; ovenData: string } {

  //===================================================================================
  // Variables
  //===================================================================================

  let totalHeight = 0;
  let lastGap = 0;
  let shelfActive = false;
  let startingPosition = 0;
  let shelfPosition = 0;
  let hlfShelfThk = oven.mod_ShelffixedThk / 2;
  const ovenList: { ovenID: string; ovenPos: number }[] = [];

  //===================================================================================
  // Interfaces
  //===================================================================================

  // Interface for the fixed shelves
  interface ShelfFixedInfo {
    PosY: number;                  // Height position of the fixed shelf
    Fingergrip: boolean;           // Fingergrip in front of the fixed shelf
    Position: string;              // Position of the fixed shelf related to the fingergrip and front gap
    FingergripType: string;        // Version of fingergrip to get the dimensions
    Backside: string;              // Attribute for "Contact" or "ThrougBw"
    Part: string;                  // Shelffixed or Rail
  }

  // Interface for the front data (backwalls and free space)
  interface FrontInfo {
    StartingPosition: number;        // Starting position of the front
    FrontHeight: number;             // Height of the front set from the UserExit
    RealFrontHeight: number;         // Calculated front height without gaps
    BackwallConstruction: string;    // Backwall construction selected on the front
    BackwallPosition: number;        // Backwall position selected on the front
    FixedshelfBottom: boolean;       // Fixed shelf selected on the front
  }

  // ===================================================================================
  // Internal helper functions
  // ===================================================================================

  // Function to create ShelfFixedInfo
  //-------------------------------------------------------------------------------------

  function CreateShelfFixedInfo(posY: number, m: any, backside: string = 'ThroughBw'): ShelfFixedInfo {
    return {
      PosY: posY + m.mod_FrontPosStart,
      Fingergrip: false,
      Position: 'GapMiddle',
      FingergripType: 'None',
      Backside: backside,
      Part: 'part_Shelffixed'
    };
  }

  // Function to create FrontInfo
  //-------------------------------------------------------------------------------------

  function CreateFrontInfo(startingPosition: number, totalHeight: number): FrontInfo {
    return {
      StartingPosition: startingPosition,
      FrontHeight: totalHeight,
      RealFrontHeight: totalHeight,
      BackwallConstruction: 'NoBackwall',
      BackwallPosition: 0,
      FixedshelfBottom: true
    };
  }

  // Function to call the OvenData
  //-------------------------------------------------------------------------------------

  function getValidOvenData(supplier: string, id: string): ReturnType<typeof GlobalFunc.find_OvenMapping> | undefined {
    const primary = GlobalFunc.find_OvenMapping(supplier, id);
    if (primary) return primary;

    // Fallback auf 'None'-Werte
    return GlobalFunc.find_OvenMapping('None', 'None');
  }

  // Calculate starting position of the fixed shelves based on backwall construction
  //-------------------------------------------------------------------------------------

	let shelfMainBw = 'ThroughBw';
  if (carc.mod_CarcaseBackwallConstruction == 'Grooved_LR'){
		shelfMainBw = 'ContactBw'
	}
	else{
		shelfMainBw = 'ThroughBw';
	}

  //===================================================================================
  //          First appliance
  //===================================================================================

  if (oven.mod_OvenSupplier1 != 'None' && oven.mod_OvenId1 != 'None') {

    // Get the data from the tables
    let OvenData = getValidOvenData(oven.mod_OvenSupplier1, oven.mod_OvenId1);
    if (OvenData) {
      let OvenConstruction = GlobalFunc.find_OvenConstruction(OvenData.ConstructionId!);

      // Adjust the totalHeight and startingPosition
      let gapBtm = oven.mod_OvenGap1 < OvenConstruction.LowerGapMin ? OvenConstruction.LowerGapMin : oven.mod_OvenGap1;
      let gapTop = oven.mod_OvenGap2 < OvenConstruction.UpperGapMin ? OvenConstruction.UpperGapMin : oven.mod_OvenGap2;

      // Calculations
      startingPosition = gapBtm;
      shelfPosition = startingPosition - hlfShelfThk + OvenConstruction.OverhangBotMax;

      // Add the fixedshelves	
      if (FrontStartPos > root.mod_ShelfbtmThk + root.mod_ShelffixedThk) {
        carc.mod_ShelffixedInfoList.push(JSON.stringify(CreateShelfFixedInfo(shelfPosition, oven, shelfMainBw)));
      }
      else {
        startingPosition = root.mod_ShelfbtmThk + root.g.basic_ShelfbtmOffsetBtm - OvenConstruction.OverhangBotMax;
      }

      // Calculations
      totalHeight += startingPosition + OvenConstruction.FrontDistanceHgt;
      lastGap = gapTop;

      // Add the module	
      ovenList.push({ ovenID: OvenData.GraphicId!, ovenPos: startingPosition });

      // Activate the shelf for the stacking
      shelfActive = OvenConstruction.ShelftopStacking!;
    }

    //===================================================================================
    //          Second appliance
    //===================================================================================

    if (oven.mod_OvenSupplier2 != 'None' && oven.mod_OvenId2 != 'None') {

      // Get the data from the tables
      let OvenData = getValidOvenData(oven.mod_OvenSupplier2, oven.mod_OvenId2);
      if (OvenData) {
        let OvenConstruction = GlobalFunc.find_OvenConstruction(OvenData.ConstructionId!);

        // Adjust the totalHeight and startingPosition
        let gapBtm = oven.mod_OvenGap2 < OvenConstruction.LowerGapMin ? OvenConstruction.LowerGapMin : oven.mod_OvenGap2;
        let gapTop = oven.mod_OvenGap3 < OvenConstruction.UpperGapMin ? OvenConstruction.UpperGapMin : oven.mod_OvenGap3;

        // Calculations
        startingPosition = totalHeight + gapBtm;
        shelfPosition = startingPosition - hlfShelfThk + OvenConstruction.OverhangBotMax;
        totalHeight = startingPosition + OvenConstruction.FrontDistanceHgt;
        lastGap = gapTop;

        // Add the fixedshelves
        if (shelfActive) {
          carc.mod_ShelffixedInfoList.push(JSON.stringify(CreateShelfFixedInfo(shelfPosition, oven, shelfMainBw)));
        }

        // Add the module
        ovenList.push({ ovenID: OvenData.GraphicId!, ovenPos: startingPosition });

        // Activate the shelf for the stacking
        shelfActive = OvenConstruction.ShelftopStacking!;
      }

      //===================================================================================
      //          Third appliance
      //===================================================================================

      if (oven.mod_OvenSupplier3 != 'None' && oven.mod_OvenId3 != 'None') {

        // Get the data from the tables
        let OvenData = getValidOvenData(oven.mod_OvenSupplier3, oven.mod_OvenId3);
        if (OvenData) {
          let OvenConstruction = GlobalFunc.find_OvenConstruction(OvenData.ConstructionId!);

          // Adjust the totalHeight and startingPosition
          let gapBtm = oven.mod_OvenGap3 < OvenConstruction.LowerGapMin ? OvenConstruction.LowerGapMin : oven.mod_OvenGap3;
          let gapTop = oven.mod_OvenGap4 < OvenConstruction.UpperGapMin ? OvenConstruction.UpperGapMin : oven.mod_OvenGap4;

          // Calculations
          startingPosition = totalHeight + gapBtm;
          shelfPosition = startingPosition - hlfShelfThk + OvenConstruction.OverhangBotMax;
          totalHeight = startingPosition + OvenConstruction.FrontDistanceHgt;
          lastGap = gapTop;

          // Add the fixedshelves
          if (shelfActive) {
            carc.mod_ShelffixedInfoList.push(JSON.stringify(CreateShelfFixedInfo(shelfPosition, oven, shelfMainBw)));
          }

          // Add the module
          ovenList.push({ ovenID: OvenData.GraphicId!, ovenPos: startingPosition });
        }
      }
    }
  }

  //===================================================================================
  // Default if no appliance is selected
  //===================================================================================

  else {
    // Get the data from the tables
    let OvenData = GlobalFunc.find_OvenMapping('None', 'None');
    let OvenConstruction = GlobalFunc.find_OvenConstruction(OvenData.ConstructionId!);

      // Adjust the totalHeight and startingPosition
      let gapBtm = oven.mod_OvenGap1 < OvenConstruction.LowerGapMin ? OvenConstruction.LowerGapMin : oven.mod_OvenGap1;
      let gapTop = oven.mod_OvenGap2 < OvenConstruction.UpperGapMin ? OvenConstruction.UpperGapMin : oven.mod_OvenGap2;

      // Calculations
      startingPosition = gapBtm;
      shelfPosition = startingPosition - hlfShelfThk + OvenConstruction.OverhangBotMax;

      // Add the fixedshelves	
      if (FrontStartPos > root.mod_ShelfbtmThk + root.mod_ShelffixedThk) {
        carc.mod_ShelffixedInfoList.push(JSON.stringify(CreateShelfFixedInfo(shelfPosition, oven, shelfMainBw)));
      }
      else {
        startingPosition = root.mod_ShelfbtmThk + root.g.basic_ShelfbtmOffsetBtm - OvenConstruction.OverhangBotMax;
      }

      // Calculations
      totalHeight += startingPosition + OvenConstruction.FrontDistanceHgt;
      lastGap = gapTop;

    // Add the module	
    ovenList.push({ ovenID: OvenData.GraphicId!, ovenPos: startingPosition });
  }

  //===================================================================================
  // Add the last fixed shelf and return the FrontInfo
  //===================================================================================

  // Add the top fixedshelf (Only if it is not on top of the cabinet)
  shelfPosition = totalHeight + hlfShelfThk - oven.mod_OvenShelffixedOverhangTop;
  if (shelfPosition + oven.mod_FrontPosStart < oven.mod_CarcaseHeight - 20) {
    carc.mod_ShelffixedInfoList.push(JSON.stringify(CreateShelfFixedInfo(shelfPosition, oven, shelfMainBw)));
  }

  // Return FrontInfo
  totalHeight += lastGap;
  carc.mod_FrontAreaInfoList.push(JSON.stringify(CreateFrontInfo(FrontStartPos - CabinetStartPos - oven.mod_FrontGapHor, totalHeight)));

  // ===================================================================================
  // Return values
  // ===================================================================================

  const nextFront = FrontStartPos + totalHeight;
  const ovenData = JSON.stringify(ovenList);
  return { nextFront, ovenData };
}