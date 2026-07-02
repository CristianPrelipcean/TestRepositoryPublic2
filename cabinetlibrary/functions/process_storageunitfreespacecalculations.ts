process_StorageunitFreeSpaceCalculations(m: parent, posLeftPart: number = 0, posRightPart: number = 0, posBtm: number = 0, posTop: number = 0, shelfList: string = '', backwallList: string = '') {

  // Interface to provide the data to the carcase
  //-------------------------------------------------------------------------------------

  interface FreeSpaceInfo {
    FullWidthFreeSpace: number;
    FullWidthStartPos: number;
    FullHeightFreeSpace: number;
    FullHeightStartPos: number;
    FullDepthFreeSpace: number;
    FullDepthStartPos: number;
    FreeSpaceDepth: number[];
    FreeSpaceDepthStartPos: number[];
    FreeSpaceHeight: number[];
    FreeSpaceHeightStartPos: number[];
    FreeSpaceWidth: number[];
    FreeSpaceWidthStartPos: number[];
    PosTopShelf: number;
  }

  // Initialize the object
  let freeSpaceInfo: FreeSpaceInfo = {
    FullWidthFreeSpace: 0,
    FullWidthStartPos: 0,
    FullHeightFreeSpace: 0,
    FullHeightStartPos: 0,
    FullDepthFreeSpace: 0,
    FullDepthStartPos: 0,
    FreeSpaceDepth: [],
    FreeSpaceDepthStartPos: [],
    FreeSpaceHeight: [],
    FreeSpaceHeightStartPos: [],
    FreeSpaceWidth: [],
    FreeSpaceWidthStartPos: [],
    PosTopShelf: 0
  };

  // Interface for the fronts
  //-------------------------------------------------------------------------------------

  interface FrontInfo {
	StartingPosition: number;        // Starting position of the front
	FrontHeight: number;             // Height of the front set from the UserExit
	RealFrontHeight: number;         // Calculated front height without gaps
	BackwallConstruction: string;    // Backwall construction selected on the front
	BackwallPosition: number;        // Backwall position selected on the front
	FixedshelfBottom: boolean;       // Fixed shelf selected on the front
	FingergripBottom: boolean;       // Fingergrip on bottom (true / false)
	FingergripTop: boolean;          // Fingergrip on top (true / false)
	FringergripType: string;         // Type of fingergrip (dimensions)
  }	

  // Interface for the backwalls
  //-------------------------------------------------------------------------------------

  interface BackwallData {
    Part: string;
    Height: number;
    Width: number;
    Depth: number;
    WidthPos: number;
    HeightPos: number;
    DepthPos: number;
  }
  let backwallInfo: BackwallData[] = JSON.parse(backwallList);

  // Interface for the shelves
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
  let shelfInfo: ShelfInfo[] = JSON.parse(shelfList);

  //=====================================================================================
  // Helper functions
  //=====================================================================================

  // Helper function to get the shelf from the list of shelves
  //-------------------------------------------------------------------------------------

  function FindShelf(targetValue: number, tolerance: number = 20): ShelfInfo | undefined {
    return shelfInfo.find(shelf =>
      shelf.HeightPos >= (targetValue - tolerance) &&
      shelf.HeightPos <= (targetValue + tolerance)
    );
  }

  // Helper function to get the backwall from the list of backwalls
  //-------------------------------------------------------------------------------------

  function FindBackwall(position1: number, position2: number, tolerance: number = 20): BackwallData | undefined {
	  const exactMatch = backwallInfo.find(backwall =>
      backwall.HeightPos <= (position1 + tolerance) &&
      backwall.HeightPos + backwall.Height >= (position2 - tolerance)
	  );
  
    if (exactMatch) {
      return exactMatch;
    }
    
    return backwallInfo.find(backwall =>
      backwall.HeightPos <= (position1 + tolerance)
    );
  }

  // Variables
  //-------------------------------------------------------------------------------------

  let librarySolution = true;

  //##########################################################################################
  // Library solution
  //##########################################################################################

  if (librarySolution) {

    //=====================================================================================
    // Calculation of the full free space (carcase inside dimension)
    //=====================================================================================

    // Calculation of RealPosTop based on Fingergrip top
    const { LShapeHeight, CShapeOverlapBelow, CShapeOverlapAbove, CShapeHeight } = m.mod_FingergripType_matrix;
    const fingergripReductionTop = CShapeHeight! - CShapeOverlapAbove!;
    const fingergripReductionBtm = CShapeOverlapBelow!;
    const lastFrontJson = m.mod_FrontAreaInfoList.length > 0 ? m.mod_FrontAreaInfoList[m.mod_FrontAreaInfoList.length - 1] : undefined;
    const hasFingergripTop = lastFrontJson ? (JSON.parse(lastFrontJson) as FrontInfo).FingergripTop : false;
    let realPosTop = (hasFingergripTop === true && posTop >= m.mod_CarcaseHeight - LShapeHeight!) ? m.mod_CarcaseHeight - LShapeHeight! : posTop;

    // Width
    freeSpaceInfo.FullWidthFreeSpace = posRightPart - posLeftPart;
    freeSpaceInfo.FullWidthStartPos = posLeftPart + m.mod_CarcaseMovement;

    // Height
    freeSpaceInfo.FullHeightFreeSpace = realPosTop - posBtm;
    freeSpaceInfo.FullHeightStartPos = posBtm;
    freeSpaceInfo.PosTopShelf = posTop - posBtm;

    // Depth
    const maxDepthPos = Math.max(...backwallInfo.map(b => b.DepthPos));
    freeSpaceInfo.FullDepthFreeSpace = m.mod_CarcaseDepth - maxDepthPos;
    freeSpaceInfo.FullDepthStartPos = maxDepthPos;

    //=====================================================================================
    // Cycle through the front elements and set its free space
    //=====================================================================================

    m.mod_FrontAreaInfoList.forEach((front, index, array) => {

      // Get the front data
      let frontInfo: FrontInfo = JSON.parse(front);

      // Set the freespace width for this front
      //-------------------------------------------------------------------------------------

      freeSpaceInfo.FreeSpaceWidth.push(freeSpaceInfo.FullWidthFreeSpace);
      freeSpaceInfo.FreeSpaceWidthStartPos.push(freeSpaceInfo.FullWidthStartPos);

      // Set the freespace depth for this front
      //-------------------------------------------------------------------------------------

      let foundBackwall = FindBackwall(frontInfo.StartingPosition, frontInfo.StartingPosition + frontInfo.RealFrontHeight);
      freeSpaceInfo.FreeSpaceDepth.push(m.mod_CarcaseDepth - ((foundBackwall?.DepthPos ?? 0) + (foundBackwall?.Depth ?? 0)));
      freeSpaceInfo.FreeSpaceDepthStartPos.push((foundBackwall?.DepthPos ?? 0) + (foundBackwall?.Depth ?? 0));

      // Set the freespace height for this front
      //-------------------------------------------------------------------------------------

      // Variables
      let tmpHgt = 0;
      let startPos = 0;

      // If there is only one front
      if (array.length === 1) {
		    startPos = posBtm;
        tmpHgt = realPosTop - posBtm;       
      }

      // If it is the first front
      else if (index === 0) {
        startPos = posBtm;
        let tmpPos = frontInfo.RealFrontHeight + frontInfo.StartingPosition - (frontInfo.FingergripTop ? fingergripReductionTop : 0);
        const foundShelf = FindShelf(tmpPos);
        if (foundShelf && foundShelf.HeightPos < tmpPos) {
          tmpPos = foundShelf.HeightPos;
        }
        tmpHgt = tmpPos - posBtm;
      }

      // If it is the last front
      else if (index === array.length - 1) {
        const foundShelfBtm = FindShelf(frontInfo.StartingPosition);
        startPos = foundShelfBtm ? foundShelfBtm.HeightPos + foundShelfBtm.Height : frontInfo.StartingPosition;
        if (frontInfo.FingergripBottom) {
          startPos += fingergripReductionBtm;
        }
        tmpHgt = realPosTop - startPos;
      }

      // All the fronts in the middle
      else {
        const foundShelfBtm = FindShelf(frontInfo.StartingPosition);
        startPos = foundShelfBtm ? foundShelfBtm.HeightPos + foundShelfBtm.Height : frontInfo.StartingPosition;
        if (frontInfo.FingergripBottom) {
          startPos += fingergripReductionBtm;
        }

        let tmpPos = Math.min(frontInfo.RealFrontHeight + frontInfo.StartingPosition, realPosTop);
        const foundShelfTop = FindShelf(tmpPos);
        if(foundShelfTop && foundShelfTop.HeightPos < tmpPos){
          tmpPos = foundShelfTop.HeightPos;
        }

        tmpHgt = tmpPos - startPos - (frontInfo.FingergripTop ? fingergripReductionTop : 0);
      }

      // Set the calculated values
      freeSpaceInfo.FreeSpaceHeight.push(tmpHgt);
      freeSpaceInfo.FreeSpaceHeightStartPos.push(startPos);
    });
  }

  //##########################################################################################
  // Custom solutions (User Exit)
  //##########################################################################################

  else {


  }

  //##########################################################################################
  // Return the needed data to the carcase
  //##########################################################################################

  return JSON.stringify(freeSpaceInfo);

}