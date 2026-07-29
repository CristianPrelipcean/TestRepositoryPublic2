process_StorageunitBackwallConstruction(m: IFuncParents_mc_Storageunit01, partLeft: string = 'None', partRight: string = 'None', partBtm: string = 'None', partTop: string = 'None', vertFreeSpace: number = 0, horFreeSpace: number = 0, startLeft: number = 0, startBtm: number = 0, shelfList: string = '') {

  // Define all the interfaces
  //-------------------------------------------------------------------------------------

  // Interface to provide the data to the carcase
  interface BackwallData {
    Part: string;
    Height: number;
    Width: number;
    Depth: number;
    WidthPos: number;
    HeightPos: number;
    DepthPos: number;
  }
  let backwallList: BackwallData[] = [];

  // Interface for the backwalls for insertion
  interface BackwallInfo {
    FreespaceVert: number,
    FreespaceHor: number,
    StartBot: number,
    StartLeft: number,
    BackwallPos: number,
    BackwallConstruction: string
  }
  let backwalls: BackwallInfo[] = []

  // Interface for the shelves
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

  // Interface for the front elements
  interface FrontInfo {
    FrontCategory: string            // Identificator of sepecial fronts
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

  // Helper function to get the shelf from the list of shelves
  //-------------------------------------------------------------------------------------

  function FindShelf(targetValue: number, tolerance: number = 30): ShelfInfo | undefined {
    return shelfInfo.find(shelf =>
      shelf.HeightPos >= (targetValue - tolerance) &&
      shelf.HeightPos <= (targetValue + tolerance)
    );
  }

  function FindShelvesInRange(lowerBound: number, upperBound: number, tolerance: number = 30): ShelfInfo[] {
    return shelfInfo
      .filter(shelf =>
        shelf.HeightPos >= lowerBound + tolerance &&
        shelf.HeightPos <= upperBound - tolerance
      )
      .sort((a, b) => a.HeightPos - b.HeightPos);
  }

  // Helper function to add a new backwall
  //-------------------------------------------------------------------------------------

  function TryAddBackwall(freeSpaceVert: number, startPos: number, construction: string | null | undefined, position: number): void {
    if (construction && construction !== "NoBackwall") {
      AddBackwall(freeSpaceVert, startPos, construction, position);
    }
  }

  function AddBackwall(freeSpaceVertical: number, startPos: number, backwallConstruction: string, backwallPosition: number): void {
    let newBackwall: BackwallInfo = {
      FreespaceVert: freeSpaceVertical,
      FreespaceHor: horFreeSpace,
      StartBot: startPos,
      StartLeft: startLeft,
      BackwallPos: backwallPosition,
      BackwallConstruction: backwallConstruction
    };
    backwalls.push(newBackwall);
  }

  // Variables
  //-------------------------------------------------------------------------------------

  let tmpPart: string = "Backwall";
  let tmpStartPos = 0;
  let tmpEndPos = 0;
  let tmpBwPos = 0;
  let tmpBwConstruction: string | undefined = undefined;
  let tmpBwBefore = false;
  let i = 0;
  let librarySolution = true;

  //##########################################################################################
  // Library solution
  //##########################################################################################

  if (librarySolution) {

    //=====================================================================================
    // Iterate through the front elements to detect the backwalls
    //=====================================================================================

    // If there is no front in the cabinet
    //---------------------------------------------------------------------------------

    if (m.mod_FrontAreaInfoList.length === 0) {

      AddBackwall(vertFreeSpace, startBtm, m.mod_CarcaseBackwallConstruction, m.mod_BackwallPos);
      tmpBwBefore = false;
    }

    // If there are fronts in the cabinet
    //---------------------------------------------------------------------------------

    else {
      m.mod_FrontAreaInfoList.forEach(front => {

        // Store the front element of this iteration
        let frontInfo: FrontInfo = JSON.parse(front);
        i++;

        // If there is more than one front in the cabinet
        //---------------------------------------------------------------------------------

        if (m.mod_FrontAreaInfoList.length > 1) {

          // If the first front is a fridge
          //---------------------------------------------------------------------------------

          if (i == 1 && frontInfo.FrontCategory == "Fridge") {

            // Try to find fixed shelves for the backwall insertion
            let foundShelves = FindShelvesInRange(
              frontInfo.StartingPosition,
              frontInfo.StartingPosition + frontInfo.RealFrontHeight
            );

            // If we found fixed shelves, we use the last one as start position for the backwall if it is in the upper half of the fridge
            const lastShelf = foundShelves.at(-1);
            if (lastShelf && lastShelf.HeightPos + lastShelf.Height >= frontInfo.StartingPosition + frontInfo.RealFrontHeight / 2) {
              tmpStartPos = lastShelf.HeightPos + lastShelf.Height;
              tmpBwPos = frontInfo.BackwallPosition;
              tmpBwConstruction = frontInfo.BackwallConstruction;
              tmpBwBefore = true;
            }

          }

          // Define the starting values for the first backwall
          //---------------------------------------------------------------------------------

          else if (i == 1 && frontInfo.BackwallConstruction != "NoBackwall") {
            tmpStartPos = startBtm;
            tmpBwPos = frontInfo.BackwallPosition;
            tmpBwConstruction = frontInfo.BackwallConstruction; // <- wichtig
            tmpBwBefore = true;
          }

          // Analyse all the front elements if a starting position was defined
          //---------------------------------------------------------------------------------

          else if (i > 1 && tmpBwBefore) {

            // Try to find a fixed shelf at this position
            let foundShelf = FindShelf(frontInfo.StartingPosition);

            // Backwalls can not be merged because position in depth is not equal
            if (tmpBwPos != frontInfo.BackwallPosition) {
              if (foundShelf) {

                // Add new backwall
                tmpEndPos = foundShelf.HeightPos;
                let freeSpaceVert = tmpEndPos - tmpStartPos;
                TryAddBackwall(freeSpaceVert, tmpStartPos, tmpBwConstruction, tmpBwPos);

                // Initialize the next backwall
                if (frontInfo.BackwallConstruction != "NoBackwall") {
                  tmpStartPos = foundShelf.HeightPos + foundShelf.Height;
                  tmpBwPos = frontInfo.BackwallPosition;
                  tmpBwConstruction = frontInfo.BackwallConstruction;
                  tmpBwBefore = true;
                }
                else {
                  tmpBwBefore = false;
                  tmpBwConstruction = undefined;
                }
              }
              else {
                logError("Can not find an end position for the backwall!");
              }
            }

            // Backwalls can not be merged because the fixed shelf is splitting the backwall
            else if (foundShelf && tmpBwPos > foundShelf.DepthPos) {

              // Add new backwall
              tmpEndPos = foundShelf.HeightPos;
              let freeSpaceVert = tmpEndPos - tmpStartPos;
              TryAddBackwall(freeSpaceVert, tmpStartPos, tmpBwConstruction, tmpBwPos);
              tmpBwBefore = false;

              // If it is a fridge
              if (frontInfo.FrontCategory == "Fridge") {
                
                // Try to find fixed shelves for the backwall insertion
                let foundShelves = FindShelvesInRange(
                  frontInfo.StartingPosition,
                  frontInfo.StartingPosition + frontInfo.RealFrontHeight
                );
                let k = 0;

                foundShelves.forEach(shelf => {
                  k++;
                  if (k == 1) {
                    tmpStartPos = shelf.HeightPos + shelf.Height;
                    tmpBwPos = frontInfo.BackwallPosition;
                    tmpBwConstruction = frontInfo.BackwallConstruction; // <- setzen
                    tmpBwBefore = !!tmpBwConstruction && tmpBwConstruction !== "NoBackwall";
                  }
                });
              }

              // Initialize the next backwall
              else if (frontInfo.BackwallConstruction != "NoBackwall") {
                tmpStartPos = foundShelf.HeightPos + foundShelf.Height;
                tmpBwPos = frontInfo.BackwallPosition;
                tmpBwConstruction = frontInfo.BackwallConstruction; // <- setzen
                tmpBwBefore = true;
              } else {
                tmpBwBefore = false;
                tmpBwConstruction = undefined;
              }
            }
          }

          // Try to find a starting position if there are still no backwalls in place
          else {
            let foundShelf = FindShelf(frontInfo.StartingPosition);
            if (foundShelf) {
              if (frontInfo.BackwallConstruction != "NoBackwall") {
                tmpStartPos = foundShelf.HeightPos + foundShelf.Height;
                tmpBwPos = frontInfo.BackwallPosition;
                tmpBwConstruction = frontInfo.BackwallConstruction; // <- setzen
                tmpBwBefore = true;
              }
              else {
                tmpBwBefore = false;
                tmpBwConstruction = undefined;
              }
            }
            else {
              if (frontInfo.BackwallConstruction != "NoBackwall") {
                logError("Can not find a starting position for the backwall!");
              }
            }
          }
        }

        // If there is only a fridge
        //---------------------------------------------------------------------------------

        else if (frontInfo.FrontCategory == "Fridge") {

          // Try to find fixed shelves for the backwall insertion
          let foundShelves = FindShelvesInRange(frontInfo.StartingPosition, frontInfo.StartingPosition + frontInfo.RealFrontHeight);

          // If we found fixed shelves, we use them to define the backwall positions
          if (foundShelves.length > 0) {
            const halfHeight = frontInfo.StartingPosition + frontInfo.RealFrontHeight / 2;

            foundShelves.forEach((shelf, k) => {
              const isBelowHalf = shelf.HeightPos < halfHeight;

              // Bottom shelf in the niche
              if (isBelowHalf) {
                const vertFreeSpaceLocal = shelf.HeightPos - startBtm;

                // Space for backwall
                if (vertFreeSpaceLocal >= 150) {

                  TryAddBackwall(
                    vertFreeSpaceLocal,
                    startBtm,
                    frontInfo.BackwallConstruction,
                    frontInfo.BackwallPosition
                  );
                  tmpBwBefore = false;
                  tmpBwConstruction = undefined;
                }

                // Air stream -> no backwall
                else {

                  tmpBwBefore = false;
                  tmpBwConstruction = undefined;
                }
              }

              // Top shelf in the niche
              else {
                if (frontInfo.BackwallConstruction !== "NoBackwall") {
                  tmpStartPos = shelf.HeightPos + shelf.Height;
                  tmpBwPos = frontInfo.BackwallPosition;
                  tmpBwConstruction = frontInfo.BackwallConstruction;
                  tmpBwBefore = true;
                } else {
                  tmpBwBefore = false;
                  tmpBwConstruction = undefined;
                }
              }
            });
          }
        }

        // If there is only one front in the cabinet and there is a backwall
        //---------------------------------------------------------------------------------

        else if (frontInfo.BackwallConstruction != "NoBackwall") {
          TryAddBackwall(
            vertFreeSpace,
            startBtm,
            frontInfo.BackwallConstruction,
            frontInfo.BackwallPosition
          );
          tmpBwBefore = false;
          tmpBwConstruction = undefined;
        }
      });

      // Add the last backwall if there was a starting position created but not an end position
      //---------------------------------------------------------------------------------

      if (tmpBwBefore) {
        let freeSpaceVert = startBtm + vertFreeSpace - tmpStartPos;
        TryAddBackwall(freeSpaceVert, tmpStartPos, tmpBwConstruction, tmpBwPos);
      }
    }

    //=====================================================================================
    // For each backwall to insert
    //=====================================================================================

    let totalBackwalls: number = backwalls.length;
    let j: number = 0;
    backwalls.forEach(backwall => {
      j++;

      let bwPosition = backwall.BackwallPos;
      let bwThickness = m.mod_BackwallThk;
      let bwSlopeAngle = 0;

      if (j == totalBackwalls && m.mod_SlopeAngle != 0) {
        // If it's the last backwall and the cabinet has SlopeAngle, then we adjust the Thickness

        // Read Settings table
        let slopedCeilingSettings = GlobalFunc.find_SlopedCeilingSettings(
          m.mod_SlopedCeilingConstruction!
        );

        bwThickness = slopedCeilingSettings.BackwallThk!;
        bwThickness != m.mod_BackwallThk
          ? logInfo(
            "Automatic adjustment: Backwall thickness is now " +
            bwThickness +
            " instead of " +
            m.mod_BackwallThk
          )
          : "";

        bwSlopeAngle = m.mod_SlopeAngle;
      }

      // Get the data from the ccc-Key table
      //-------------------------------------------------------------------------------------

      // Query the ccc-Key
      let retBackwall = GlobalFunc.find_BackwallConstruction(
        backwall.BackwallConstruction,
        partLeft,
        partBtm,
        partRight,
        partTop,
        m.mod_CarcaseVisBack
      );

      // Calculations
      let calcHeightPos =
        backwall.StartBot +
        retBackwall.HeightPosition(
          m,
          horFreeSpace,
          vertFreeSpace,
          bwPosition,
          bwThickness
        );

      // Add the module
      //-------------------------------------------------------------------------------------

      let Backwall = m.addOD_M_mc_StorageunitBackwall01();

      // Set values to the attributes of the child
      Backwall.mod_Height = retBackwall.Height(
        m,
        backwall.FreespaceHor,
        backwall.FreespaceVert,
        bwPosition,
        bwThickness
      );
      Backwall.mod_Width = retBackwall.Width(
        m,
        backwall.FreespaceHor,
        backwall.FreespaceVert,
        bwPosition,
        bwThickness
      );
      Backwall.mod_Depth = retBackwall.Depth(
        m,
        backwall.FreespaceHor,
        backwall.FreespaceVert,
        bwPosition,
        bwThickness
      );
      Backwall.mod_EdgeFrontType = retBackwall.matrix_EdgeTypeFront!;
      Backwall.mod_EdgeLeftType = retBackwall.matrix_EdgeTypeLeft!;
      Backwall.mod_EdgeBackType = retBackwall.matrix_EdgeTypeBack!;
      Backwall.mod_EdgeRightType = retBackwall.matrix_EdgeTypeRight!;
      Backwall.mod_EdgeJointType = retBackwall.matrix_EdgeJointType;
      Backwall.mod_SlopeAngle = bwSlopeAngle;

      // setOrigin
      Backwall.setOrigin(
        startLeft +
        retBackwall.WidthPosition(
          m,
          backwall.FreespaceHor,
          backwall.FreespaceVert,
          bwPosition,
          bwThickness
        ),
        calcHeightPos,
        retBackwall.DepthPosition(
          m,
          backwall.FreespaceHor,
          backwall.FreespaceVert,
          bwPosition,
          bwThickness
        )
      );

      // Add the backwall data to the list
      let backwallData: BackwallData = {
        Part: tmpPart,
        Height: retBackwall.Height(
          m,
          backwall.FreespaceHor,
          backwall.FreespaceVert,
          bwPosition,
          bwThickness
        ),
        Width: retBackwall.Width(
          m,
          backwall.FreespaceHor,
          backwall.FreespaceVert,
          bwPosition,
          bwThickness
        ),
        Depth: retBackwall.Depth(
          m,
          backwall.FreespaceHor,
          backwall.FreespaceVert,
          bwPosition,
          bwThickness
        ),
        WidthPos:
          startLeft +
          retBackwall.WidthPosition(
            m,
            backwall.FreespaceHor,
            backwall.FreespaceVert,
            bwPosition,
            bwThickness
          ),
        HeightPos: calcHeightPos,
        DepthPos: retBackwall.DepthPosition(
          m,
          backwall.FreespaceHor,
          backwall.FreespaceVert,
          bwPosition,
          bwThickness
        )
      };
      backwallList.push(backwallData);
    });
  }

  //##########################################################################################
  // Custom solutions (User Exit)
  //##########################################################################################

  else {
    // custom
  }

  //##########################################################################################
  // Return the needed data to the carcase
  //##########################################################################################

  return JSON.stringify(backwallList);
}