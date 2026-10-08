process_StorageunitShelffixedConstruction(m: parent) {

  // Interface to provide the data to the carcase
  //-------------------------------------------------------------------------------------

  interface ShelfInfo {
    Part: string;
    Height: number;
    Width: number;
    Depth: number;
    WidthPos: number;
    HeightPos: number;
    DepthPos: number;
  }

  // Array for the shelves
  let shelfList: ShelfInfo[] = [];

  // Variables
  //-------------------------------------------------------------------------------------

  let tmpPart: string = 'ShelfFixed';
  let tmpAdditionalInfo01: string = m.mod_SlopeAngle === 0 ? 'All' : 'SlopedCeiling';
  let retShelf: any;
  let librarySolution = true;

  //##########################################################################################
  // Library solution
  //##########################################################################################

  if (librarySolution) {

    //=====================================================================================
    // Get the JSON-data for the mod_FrontAreaInfoList (backwall data)
    //=====================================================================================

    // Define the interface
    interface FrontInfo {
      StartingPosition: number;        // Starting position of the front
      FrontHeight: number;             // Height of the front set from the UserExit
      RealFrontHeight: number;         // Calculated front height without gaps
      BackwallConstruction: string;    // Backwall construction selected on the front
      BackwallPosition: number;        // Backwall position selected on the front
      FixedshelfBottom: boolean;       // Fixed shelf selected on the front
    }

    // Array attribute to store the JSON-objects
    let frontObjects: FrontInfo[] = [];

    // Get all the JSON-strings, parse them and store them
    m.mod_FrontAreaInfoList.forEach(front => {
      let frontInfo = JSON.parse(front);
      frontObjects.push(frontInfo);
    });

    //=====================================================================================
    // For each fixed shelf we found on the fronts
    //=====================================================================================

    m.mod_ShelffixedInfoList.forEach(fixedShelf => {

      //=====================================================================================
      // Get the JSON-data for the fixed shelf
      //=====================================================================================

      // Define the interface
      interface ShelfFixedInfo {
        PosY: number;                  // Height position of the fixed shelf
        Fingergrip: boolean;           // Fingergrip in front of the fixed shelf
        Position: string;              // Position of the fixed shelf related to the fingergrip and gaps
        FingergripType: string;        // Version of fingergrip to get the dimensions
        Backside: string;              // Attribute for "Contact" or "ThrougBw"
        Part: string;                  // Shelffixed or Rail
      }

      let shelfInfo: ShelfFixedInfo = JSON.parse(fixedShelf);

      //=====================================================================================
      // Calculations
      //=====================================================================================

      // Backside situation and backwall position for the query in the CCC-key table
      //-------------------------------------------------------------------------------------

      // Get the data for the relevant fronts
      let hgtPos = shelfInfo.PosY + m.g.basic_FrontGapHor / 2;
      let firstFront = frontObjects.find(front => front.StartingPosition + front.FrontHeight === hgtPos);
      let secondFront = frontObjects.find(front => front.StartingPosition === hgtPos);

      // Default (we can merge the backwalls, or we don't find any data)
      let situationBack = shelfInfo.Backside;
      let backwallPos = m.mod_BackwallPos;

      // If we can not merge the backwall on the backside of the fixed shelf
      if (firstFront && secondFront) {
        if (firstFront.BackwallPosition !== secondFront.BackwallPosition) {
          if (situationBack == "ContactBw") {
            situationBack = "ThroughBw";
            logInfo('The value "ContactBw" is not valid if the backwallpositions are not equal. We changed it to "ThroughBw".')
          }

          backwallPos = Math.min(firstFront.BackwallPosition, secondFront.BackwallPosition);
        }
      }

      // Calculation of the height position of the fixed shelf
      //-------------------------------------------------------------------------------------

      let calcHeightPos = shelfInfo.PosY - m.mod_ShelffixedThk / 2;

      if (shelfInfo.Position == 'GapBelow') {
        calcHeightPos = shelfInfo.PosY - m.g.basic_FrontGapHor / 2 + m.g.basic_ShelffixedOffsetFront
      }
      else if (shelfInfo.Position == 'GapAbove') {
        calcHeightPos = shelfInfo.PosY - m.mod_ShelffixedThk + m.g.basic_FrontGapHor / 2 + m.g.basic_ShelffixedOffsetFront!
      }

      //=====================================================================================
      // Add the module
      //=====================================================================================

      let Shelf = m.addOD_M_mc_StorageunitShelffixed01();

      // Query the ccc-Key
      retShelf = GlobalFunc.find_StorageunitConstruction(shelfInfo.Part, m.mod_CarcaseConnectionLeftTop, m.mod_CarcaseConnectionLeftBtm, m.mod_CarcaseConnectionRightBtm, m.mod_CarcaseConnectionRightTop, situationBack, 'Overlayed', false, tmpAdditionalInfo01);

      // Set values to the attributes of the child
      Shelf.mod_ShelffixedThk = retShelf.Height(m, 0);
      Shelf.mod_Width = retShelf.Width(m, 0);
      Shelf.mod_Depth = retShelf.Depth(m, backwallPos);
      Shelf.mod_EdgeFrontType = retShelf.EdgeTypeFront!;
      Shelf.mod_EdgeLeftType = retShelf.EdgeTypeLeft!;
      Shelf.mod_EdgeBackType = retShelf.EdgeTypeBack!;
      Shelf.mod_EdgeRightType = retShelf.EdgeTypeRight!;
      Shelf.mod_EdgeJointType = retShelf.EdgeJointType;

      // setOrigin
      Shelf.setOrigin(retShelf.WidthPos(m, 0), calcHeightPos, retShelf.DepthPos(m, backwallPos));

      // Add the shelf data to the list
      let shelfData: ShelfInfo = {
        Part: tmpPart,
        Height: retShelf.Height(m, 0),
        Width: retShelf.Width(m, 0),
        Depth: retShelf.Depth(m, backwallPos),
        WidthPos: retShelf.WidthPos(m, 0),
        HeightPos: calcHeightPos,
        DepthPos: retShelf.DepthPos(m, backwallPos)
      };
      shelfList.push(shelfData);

    })
  }

  //##########################################################################################
  // Custom solutions (User Exit)
  //##########################################################################################

  else {


  }

  //##########################################################################################
  // Return the needed data to the carcase
  //##########################################################################################

  return JSON.stringify(shelfList);

}