
  // Schuler Consulting
  // Create: April 2025
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mr_Appliance
  //
  // Revisions
  //
  //===================================================

  //===================================================
  // Get the insertion height for the front
  //===================================================

  let StartPosCabinet = this.mod_PlinthAreaDesign_matrix.PlinthAreaType !== 'None' ? this.mod_PlinthAreaHeight! : 0;
  let TopPosCabinet = StartPosCabinet + this.mod_Height;
  this.mod_DropZoneVisible[0] = true;

  //===================================================
  // Calculate the toe kick position
  //===================================================
    
  let retInfo = GlobalFunc.process_PlinthAreaLegs(this);

  // Provide the position of the legs for creation of the contour
  const legPositions = {
    LineLeft: retInfo.LineLeft,
    LineRight: retInfo.LineRight,
    LineFront: retInfo.LineFront,
    LineBack: retInfo.LineBack
  };
  this.mod_PlinthAreaPositionInfo.push(JSON.stringify(legPositions));
  

  //===================================================
  //          Cycle through the childs and manage the front elements
  //===================================================

  // Define variables
  let GlobalCount: number = 0;
  let StartPos = this.mod_FrontPosStart + StartPosCabinet;
  let LastFrontElem = 0;
  let foundWidth = 0;

  let tmpLastStartPos: number[] = []; //Stores the position of each front
  tmpLastStartPos[0] = 0;
  let tmpLastGap: number[] = []; //Stores the gap between each fronts (either normal gap or fingergrip gap)
  tmpLastGap[0] = 0;
  let tmpLastFrontFingergrip: boolean[] = [false]; // Stores if the front has fingergrip
  tmpLastFrontFingergrip[0] = false;

  // Cycle
  this.m.forEach(p => {
    if (p instanceof OD_M_mf_Dishwasher) {

      // Found a Dishwasher
      this.mod_DropZoneVisible[0] = false;

      // Set the attributes
      p.mod_FrontId = 'Dishwasher_' + (++GlobalCount);
      p.mod_FrontPosStart = StartPos;

      // setOrigin
      p.setOrigin(0, StartPos, this.mod_Depth);
      p.mod_Originpos[0] = 0;
      p.mod_Originpos[1] = StartPos;
      p.mod_Originpos[2] = this.mod_Depth;
      p.mod_Originpos[3] = TopPosCabinet - StartPos;

      // Check the frontheight
      if (StartPos + p.mod_FrontHeightSelection! >= this.mod_Height + StartPosCabinet) { LastFrontElem = 1 }
        
      if (LastFrontElem == 1 && p.mod_FingergripTop == true) {
        p.mod_FrontHeight = this.mod_Height - (StartPos - StartPosCabinet + this.mod_FingergripType_matrix.LShapeGapAbove!) 
      }
      else if (LastFrontElem == 1 && p.mod_FingergripTop == false) {
        p.mod_FrontHeight = this.mod_Height - (StartPos - StartPosCabinet + this.mod_FrontGapHorTop);
      }
      else {
        StartPos += p.mod_FrontHeightSelection!;
        p.mod_FrontHeight = p.mod_FrontHeightSelection! - this.mod_FrontGapHor;
        tmpLastStartPos.push(StartPos - StartPosCabinet);
        tmpLastGap.push(this.mod_FrontGapHor / 2);
      }

      // Seal the dishwasher to get its dimensions
      let sealedDW = p.seal();

      interface DwInfo {
        Width: number;
        Depth: number;
        Height: number;
        GraphicId: string | undefined;
      }

      let dwInfo: DwInfo = JSON.parse(sealedDW.mod_DishwasherInfo[0]);
      this.mod_InformationList.push(sealedDW.mod_DishwasherInfo[0]);
      foundWidth = dwInfo.Width;
    }
    else if (p instanceof OD_M_mf_BaseunitFridge) {

      // Found a Baseunit Frdige
      this.mod_DropZoneVisible[0] = false;

      // Set the attributes
      p.mod_FrontId = 'BaseunitFridge_' + (++GlobalCount);
      p.mod_FrontPosStart = StartPos;

      // setOrigin
      p.setOrigin(0, StartPos, this.mod_Depth);
      p.mod_Originpos[0] = 0;
      p.mod_Originpos[1] = StartPos;
      p.mod_Originpos[2] = this.mod_Depth;
      p.mod_Originpos[3] = TopPosCabinet - StartPos;

      // Check the frontheight
      if (StartPos + p.mod_FrontHeightSelection! >= this.mod_Height + StartPosCabinet) { LastFrontElem = 1 }
        
      if (LastFrontElem == 1 && p.mod_FingergripTop == true) {
        p.mod_FrontHeight = this.mod_Height - (StartPos - StartPosCabinet + this.mod_FingergripType_matrix.LShapeGapAbove!) 
      }
      else if (LastFrontElem == 1 && p.mod_FingergripTop == false) {
        p.mod_FrontHeight = this.mod_Height - (StartPos - StartPosCabinet + this.mod_FrontGapHorTop);
      }
      else {
        StartPos += p.mod_FrontHeightSelection!;
        p.mod_FrontHeight = p.mod_FrontHeightSelection! - this.mod_FrontGapHor;
        tmpLastStartPos.push(StartPos - StartPosCabinet);
        tmpLastGap.push(this.mod_FrontGapHor / 2);
      }

      // Seal the baseunit fridge to get its dimensions
      let sealedDW = p.seal();

      interface DwInfo {
        Width: number;
        Depth: number;
        Height: number;
        GraphicId: string | undefined;
      }

      let dwInfo: DwInfo = JSON.parse(sealedDW.mod_BaseunitFridgeInfo[0]);
      this.mod_InformationList.push(sealedDW.mod_BaseunitFridgeInfo[0]);
      foundWidth = dwInfo.Width;
    }
  });

  //===================================================
  //          Create vector / docking
  //===================================================

  // Set the width correctly
  let finalWidth = foundWidth > 0 ? foundWidth : this.mod_Width;

  // Left side
  this.addDockingInfo(Dock.LeftBottom, new Vector3(0, 0, -this.mod_CarcaseDistanceWall), new Vector3(0, 0, this.mod_Depth));
  this.addDockingInfo(Dock.LeftTop, new Vector3(0, TopPosCabinet, -this.mod_CarcaseDistanceWall), new Vector3(0, TopPosCabinet, this.mod_Depth));

  // Right side
  this.addDockingInfo(Dock.RightBottom, new Vector3(finalWidth, 0, -this.mod_CarcaseDistanceWall), new Vector3(finalWidth, 0, this.mod_Depth));
  this.addDockingInfo(Dock.RightTop, new Vector3(finalWidth, TopPosCabinet, -this.mod_CarcaseDistanceWall), new Vector3(finalWidth, TopPosCabinet, this.mod_Depth));

  // Back side
  this.addDockingInfo(Dock.BackBottom, new Vector3(0, 0, -this.mod_CarcaseDistanceWall), new Vector3(finalWidth, 0, -this.mod_CarcaseDistanceWall));
  this.addDockingInfo(Dock.BackTop, new Vector3(0, TopPosCabinet, -this.mod_CarcaseDistanceWall), new Vector3(finalWidth, TopPosCabinet, -this.mod_CarcaseDistanceWall));  

  //===================================================
  //          Call the UserExit of this module
  //===================================================
  
  GlobalFunc.ue_Appliance(this);
  