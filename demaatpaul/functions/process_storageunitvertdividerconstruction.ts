process_StorageunitVertdividerConstruction(m: parent, FreeSpaceWidth: any, FreeSpaceHeight: any, FreeSpaceDepth: any, FreeSpaceWidthStartPos: any, FreeSpaceHeightStartPos: any, FreeSpaceDepthStartPos: any, FixedShelves?: any) {

  // Helper function for the recalculation of the freespace
  //-------------------------------------------------------------------------------------------

  function ReCalcFreeSpace(b: number, DividerCount: number, m: any) {

    let side = 1;
    if (!FreeSpaceDividerWidth[b]) {
      FreeSpaceDividerWidth[b] = [];
    }
    if (!FreeSpaceDividerWidthStartPos[b]) {
      FreeSpaceDividerWidthStartPos[b] = [];
    }

    // Manage the freespace (create two sections)
    if (VertDividerInfo.Type[b] == 'MiddleSide' || VertDividerInfo.FrontName[b] == 'mf_Drawer') {
      FreeSpaceDividerWidth[b][side] = VertDividerInfo.FrontWidth[b] - (DividerWidth[DividerCount] / 2) - FreeSpaceWidthStartPos[b - 1];
      FreeSpaceDividerWidthStartPos[b][side] = FreeSpaceWidthStartPos[b - 1];
      side++;
      FreeSpaceDividerWidth[b][side] = FreeSpaceWidth[b - 1] - (VertDividerInfo.FrontWidth[b] - (DividerWidth[DividerCount] / 2) - FreeSpaceWidthStartPos[b - 1]) - DividerWidth[DividerCount];
      FreeSpaceDividerWidthStartPos[b][side] = FreeSpaceWidthStartPos[b - 1] + (VertDividerInfo.FrontWidth[b] - (DividerWidth[DividerCount] / 2) - FreeSpaceWidthStartPos[b - 1]) + DividerWidth[DividerCount];
    }

    // Manage the freespace in depth
    else if ((VertDividerInfo.Type[b] == 'Cleat' || VertDividerInfo.Type[b] == 'MiddleSideShort') && VertDividerInfo.FrontName != 'mf_Drawer') {
      FreeSpaceDepth[b - 1] = FreeSpaceDepth[b - 1] - DividerDepth[DividerCount] - m.g.basic_OffsetFrontVertDivider;
    }
  }

  // Helper function to check the construction of the VertDivider and through errors if needed
  //-------------------------------------------------------------------------------------------

  function CheckMergingErrors(b: number, m: any): boolean {

    // Create Variable for ErrorID and reset it each cycle
    let ErrorId = '';

    // Give an error if the front has cleat and the next one does not have a cleat and the next one does not have a FixedShelf
    if ((VertDividerInfo.Type[b - 1].includes('Cleat') || VertDividerInfo.Type[b - 1].includes('MiddleSide') || VertDividerInfo.Type[b - 1].includes('MiddleSideShort')) && (VertDividerInfo.Type[b] && !VertDividerInfo.Type[b].includes('Cleat') && !VertDividerInfo.Type[b].includes('MiddleSide') && !VertDividerInfo.Type[b].includes('MiddleSideShort') && m.mod_ShelffixedTypeList[b] == 'NoFixedShelf')) {
      ErrorId = 'Error 22002';
    }

    // Give an error if the front does not have a cleat and the next one has a cleat and the next one does not have a FixedShelf
    if ((VertDividerInfo.Type[b - 1] && !VertDividerInfo.Type[b - 1].includes('Cleat') && !VertDividerInfo.Type[b - 1].includes('MiddleSide') && !VertDividerInfo.Type[b].includes('MiddleSideShort')) && (VertDividerInfo.Type[b].includes('Cleat') || VertDividerInfo.Type[b].includes('MiddleSide') || VertDividerInfo.Type[b].includes('MiddleSideShort') && m.mod_ShelffixedTypeList[b] == 'NoFixedShelf')) {
      ErrorId = 'Error 22003';
    }

    // Give an error if the front does not have a bottomshelf bellow and the divider type is different
    if (VertDividerInfo.Type[b - 1] != VertDividerInfo.Type[b] && m.mod_ShelffixedTypeList[b] == 'NoFixedShelf') {
      ErrorId = 'Error 22007';
    }

    // Give an error if the front does not have a bottomshelf bellow and the divider type is equal but there are different front width for each Front
    if (VertDividerInfo.Type[b - 1] == VertDividerInfo.Type[b] && m.mod_ShelffixedTypeList[b] == 'NoFixedShelf' && VertDividerInfo.FrontWidth[b - 1] != VertDividerInfo.FrontWidth[b] && (VertDividerInfo.Type[b].includes('Cleat') || VertDividerInfo.Type[b].includes('MiddleSide') || VertDividerInfo.Type[b].includes('MiddleSideShort') || VertDividerInfo.Type[b - 1].includes('Cleat') || VertDividerInfo.Type[b - 1].includes('MiddleSide') || VertDividerInfo.Type[b - 1].includes('MiddleSideShort'))) {
      ErrorId = 'Error 22008';
    }

    if (ErrorId) {
      let ErrorMessage = GlobalFunc.find_ErrorList(ErrorId, 1);
      logError(ErrorMessage.Message(''));
      return false;
    }
    else {
      return true;
    }
  }

  // Helper function to insert the modules for the vertical deviders
  //-------------------------------------------------------------------------------------------
  function InsertDivider(createDevider: boolean, b: number, m: any) {

    // Check if there is no error
    if (createDevider) {

      // Add the dividers
      let divider = m.addOD_M_mc_VertDivider01();

      // Set attributes of the child
      divider.mod_Width = DividerWidth[b];
      divider.mod_Height = DividerHeight[b];
      divider.mod_Depth = DividerDepth[b];
      divider.mod_VertDividerType = DividerType[b];

      // Push the divider into the array of dividers
      Dividers.push(divider);

      // setOrigin
      divider.setOrigin(DividerWidthStartPos[b], DividerHeightStartPos[b], DividerDepthStartPos[b]);
    }
  }

  // Helper function to update the modules for the vertical deviders
  //-------------------------------------------------------------------------------------
  function UpdateDivider(b: number) {
    Dividers[b - 1].mod_Height = DividerHeight[b];
  }

  // Variables
  //-------------------------------------------------------------------------------------

  let FreeSpaceDividerWidth: number[][] = [];
  let FreeSpaceDividerWidthStartPos: number[][] = [];
  const DividerHeight: number[] = [0];
  const DividerHeightStartPos: number[] = [0];
  const DividerWidth: number[] = [0];						// the number of records from this array equals the total number of dividers in a cabinet
  const DividerWidthStartPos: number[] = [0];		// the number of records from this array equals the total number of dividers in a cabinet
  const DividerDepth: number[] = [];
  const DividerDepthStartPos: number[] = [0];
  const DividerType: string[] = [];
  const Dividers: any = [];
  let DividerCount = 0;
  let createDivider = true;

  const DividerWidthPerFront: number[] = [0];					// the number of records from this array equals the total number of fronts in a cabinet (position in array exists even if no vert divider exists for a specific front)
  const DividerWidthStartPosPerFront: number[] = [0];	// the number of records from this array equals the total number of fronts in a cabinet (position in array exists even if no vert divider exists for a specific front)
  const DividerDepthPerFront: number[] = [0];					// the number of records from this array equals the total number of fronts in a cabinet (position in array exists even if no vert divider exists for a specific front)
  const DividerDepthStartPosPerFront: number[] = [0];	// the number of records from this array equals the total number of fronts in a cabinet (position in array exists even if no vert divider exists for a specific front)

  // Parse the stored data into the JSON-Format
  let VertDividerInfo = JSON.parse(m.mod_VertDividerInfoList[0]);
  let librarySolution = true;

  //##########################################################################################
  // Library solution
  //##########################################################################################

  if (librarySolution) {

    // Cycle through the vertical deviders and make the calculations
    //-------------------------------------------------------------------------------------------

    for (let b = 1; b <= VertDividerInfo.Type.length; b++) {

      if (VertDividerInfo.Type[b] == 'Cleat' || VertDividerInfo.Type[b] == 'MiddleSide' || VertDividerInfo.Type[b] == 'MiddleSideShort') {

        // Merge the vertical divider with the front section below, because there is no fixed shelf
        let tmpDo = false;
        if (tmpDo && b > 1) {

          // Set the new height of the divider
          DividerHeight[DividerCount] += FreeSpaceHeight[b];

          // Call the function for the calculations
          ReCalcFreeSpace(b, DividerCount, m);
          UpdateDivider(DividerCount);
          createDivider = CheckMergingErrors(b, m);

          DividerWidthPerFront[b] = DividerWidthPerFront[b - 1];
          DividerWidthStartPosPerFront[b] = DividerWidthStartPosPerFront[b - 1];
          DividerDepthPerFront[b] = DividerDepthPerFront[b - 1];
          DividerDepthStartPosPerFront[b] = DividerDepthStartPosPerFront[b - 1];
        }

        // Insert a vertical divider for the next front section
        else {

          // Counter
          DividerCount++

          // Managing the height
          DividerHeight[DividerCount] = FreeSpaceHeight[b - 1];
          DividerHeightStartPos[DividerCount] = FreeSpaceHeightStartPos[b - 1];

          // Managing the width
          if (VertDividerInfo.Type[b] == 'MiddleSide' || VertDividerInfo.Type[b] == 'MiddleSideShort') {
            DividerWidth[DividerCount] = m.g.basic_SidepanelmiddleThk;
          }
          else if (VertDividerInfo.Type[b] == 'Cleat') {
            DividerWidth[DividerCount] = m.g.basic_CleatWidth;
          }
          DividerWidthStartPos[DividerCount] = VertDividerInfo.FrontWidth[b] - (DividerWidth[DividerCount] / 2);

          // Managing the depth
          if (VertDividerInfo.Type[b] == 'MiddleSide') {
            DividerDepth[DividerCount] = FreeSpaceDepth[b - 1] - m.g.basic_OffsetFrontVertDivider;
          }
          else if (VertDividerInfo.Type[b] == 'MiddleSideShort') {
            DividerDepth[DividerCount] = m.g.basic_SidepanelmiddleShortWidth;
          }
          else if (VertDividerInfo.Type[b] == 'Cleat') {
            DividerDepth[DividerCount] = m.g.basic_CleatThk;
          }
          DividerDepthStartPos[DividerCount] = FreeSpaceDepthStartPos[b - 1] + FreeSpaceDepth[b - 1] - DividerDepth[DividerCount] - m.g.basic_OffsetFrontVertDivider;

          // Type of divider
          DividerType[DividerCount] = VertDividerInfo.Type[b];

          // Call the function for the calculation of the freespace
          ReCalcFreeSpace(b, DividerCount, m)

          // Call the function to insert the module
          InsertDivider(createDivider, DividerCount, m);

          DividerWidthPerFront[b] = DividerWidth[DividerCount];
          DividerWidthStartPosPerFront[b] = DividerWidthStartPos[DividerCount];
          DividerDepthPerFront[b] = DividerDepth[DividerCount];
          DividerDepthStartPosPerFront[b] = DividerDepthStartPos[DividerCount];
        }
      }
      else {
        // Call the function for the calculation of the freespace
        ReCalcFreeSpace(b, DividerCount, m)

        DividerWidthPerFront[b] = 0;
        DividerWidthStartPosPerFront[b] = 0;
        DividerDepthPerFront[b] = 0;
        DividerDepthStartPosPerFront[b] = 0;
      }
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

  // Create VertDividerInfoEnhanced
  //-------------------------------------------------------------------------------------------

  // Create the Variable VertDividerInfoEnhanced
  let VertDividerInfoEnhanced: any = {
    Type: VertDividerInfo.Type,
    FrontWidth: VertDividerInfo.FrontWidth,
    FrontName: VertDividerInfo.FrontName,
    PosX: DividerWidthStartPosPerFront,
    DimX: DividerWidthPerFront,
    FreeSpaceWidth: FreeSpaceDividerWidth,
    FreeSpaceWidthStartPos: FreeSpaceDividerWidthStartPos
  };

  // Update attribute mod_VertDividerInfoList
  let VertDividerInfoEnhancedJson = JSON.stringify(VertDividerInfoEnhanced);
  m.mod_VertDividerInfoList[0] = VertDividerInfoEnhancedJson;

  // Return data to mc_Storageunit
  //-------------------------------------------------------------------------------------------

  // Create the object to return it
  let VertDividerCarcData: any = {
    DividerWidthStartPosPerFront: DividerWidthStartPosPerFront,
    DividerDepthStartPosPerFront: DividerDepthStartPosPerFront,
    DividerWidthPerFront: DividerWidthPerFront,
    DividerDepthPerFront: DividerDepthPerFront,
    FreeSpaceDepth: FreeSpaceDepth
  }

  // Stringify and return the data
  return JSON.stringify(VertDividerCarcData);

}