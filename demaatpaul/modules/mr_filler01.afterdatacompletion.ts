  // Schuler Consulting
  // Create: April 2025
  // By Joao Lisboa
  // Purpose: CabinetLibrary
  //
  // Description:
  // AfterDataCompletion of mr_Filler01
  // Add the carcase to the root-module
  // Add the PlinthArea to the root-module
  // Cycle through the childs and manage the front elements
  // Cycle through the childs and search for fingergrip
  //===================================================

  //===================================================
  //          Add the carcase to the root-module
  //===================================================

  // Add the module
  //----------------------------------------------------

  let carc = this.addOD_M_mc_Storageunit01(0);

  //  Set attributes based on the Filler Construction
  //----------------------------------------------------
  let additionalInfo: string = 'All';
  let fillerSettings = GlobalFunc.find_FillerSettings(this.mod_FillerType, this.mod_Direction, additionalInfo);

  carc.mod_SidepanelleftType = fillerSettings.SidepanelleftType;
  carc.mod_SidepanelleftThk = fillerSettings.SidepanelleftType == 'NoSp' ? this.mod_FrontGapVert / 2 : this.mod_SidepanelleftThk;
  carc.mod_SidepanelrightType = fillerSettings.SidepanelrightType;
  carc.mod_SidepanelrightThk = fillerSettings.SidepanelrightType == 'NoSp' ? this.mod_FrontGapVert / 2 : this.mod_SidepanelrightThk;
  carc.mod_CarcaseShelftopConstruction = fillerSettings.ShelftopConstruction;
  carc.mod_CarcaseShelfbtmConstruction = fillerSettings.ShelfbtmConstruction;
  carc.mod_CarcaseBackwallConstruction = fillerSettings.BackwallConstruction;
  
  
  // Set attributes not derived (attributes not in use but that need to get values)
  carc.mod_BackwallPos = 8;
  carc.mod_BackwallThk = 8;
  carc.mod_HangerPosX = 'Left_Right';
  carc.mod_HangerPosY = 'Automatic';
  carc.mod_RailhortopbackThk = 19;
  carc.mod_RailhortopfrontThk = 19;
  carc.mod_RailverttopbackThk = 19;
  carc.mod_RailverttopfrontThk = 19;
  carc.mod_ShelffixedThk = 19;
  carc.mod_CarcaseBackwallColor = this.mod_CarcaseColor;
  carc.mod_CarcaseBackwallProgram = this.mod_CarcaseProgram;
  carc.mod_CarcaseShelfbtmOversizeInsideWall = 0;
  carc.mod_CarcaseShelftopOversizeInsideWall = 0;
  carc.mod_CarcaseSidepanelleftOversizeInsideWall = 0;
  carc.mod_CarcaseSidepanelrightOversizeInsideWall = 0;
  carc.mod_HangerType = 'NoHanger';
  carc.mod_LightPosX1 = 0;
  carc.mod_LightPosX2 = 0;
  carc.mod_LightPosX3 = 0;
  carc.mod_LightPosX4 = 0;
  carc.mod_LightPosX5 = 0;
  carc.mod_LightPart = 'BottomShelf';
  carc.mod_LightPosX = 'Central';
  carc.mod_LightPosY = 100;
  carc.mod_LightSystem = 'NoLight';
  carc.mod_BackwallFixedHeight = 100;
  carc.mod_HangerOffsetPosY = 0;
  carc.mod_HangerColor = 'DemoWhite';
  carc.mod_SidepanelmiddleThk = 19;
  carc.mod_SlopedCeilingDimensionLogic = 'FollowWallUserHeight';
  carc.mod_SlopeAngle = 0;
  carc.mod_BackHeight = 600;
  carc.mod_SlopedCeilingConstruction = 'Construction01';
  carc.mod_TopDepth = 150;
  

  // Calculation of the carcase width and starting Position (Endless cabinets)
  //----------------------------------------------------

  function GetSideAdjustment(type: string, thickness: number): number {
    switch (type) {
      case 'OutSp':
      case 'NoSpAtOutSpOversized':
        return 0;
      case 'NoSpAtOutSp':
        return thickness;
      case 'NoSpAtMiSp':
      case 'MiSp':
        return thickness / 2;
      default:
        return 0;
    }
  }

  function GetCarcaseMovement(leftType: string, leftThk: number): number {
    switch (leftType) {
      case 'MiSp':
      case 'NoSpAtMiSp':
        return -leftThk / 2;
      case 'NoSpAtOutSp':
        return -leftThk;
      default:
        return 0;
    }
  }

  function CalculateCarcaseWidth(leftType: string, rightType: string, width: number, leftThk: number, rightThk: number): number {
    const leftAdjustment = GetSideAdjustment(leftType, leftThk);
    const rightAdjustment = GetSideAdjustment(rightType, rightThk);
    return width + leftAdjustment + rightAdjustment;
  }

  // Set the values to the relevant attributes of the carcase
  //----------------------------------------------------

  let StartPosCabinet = this.mod_PlinthAreaDesign_matrix.PlinthAreaType !== 'None' ? this.mod_PlinthAreaHeight! : 0;
  let CarcaseMovement = GetCarcaseMovement(this.mod_SidepanelleftType, this.mod_SidepanelleftThk);

  carc.mod_CarcaseWidth = CalculateCarcaseWidth(this.mod_SidepanelleftType, this.mod_SidepanelrightType, this.mod_Width, this.mod_SidepanelleftThk, this.mod_SidepanelrightThk);
  carc.mod_CarcaseMovement = CarcaseMovement;
  carc.mod_CarcaseDepth = fillerSettings.UseCarcaseDepth ? this.mod_Depth : this.mod_FillerDepth;
  let depthAdjustment = fillerSettings.UseCarcaseDepth ? 0 : this.mod_Depth - this.mod_FillerDepth;
  carc.mod_CarcaseHeight = this.mod_Height;
  carc.mod_CarcaseId = 'Carcase_01';

  // Set origin of the carcase
  //----------------------------------------------------

  carc.setOrigin(CarcaseMovement, StartPosCabinet, depthAdjustment);

  // Save origin in Attribute
  carc.mod_Originpos.push(CarcaseMovement);
  carc.mod_Originpos.push(StartPosCabinet);
  carc.mod_Originpos.push(depthAdjustment);

  //===================================================
  //          Cycle through the childs and manage the front elements
  //===================================================

  // Define variables
  let GlobalCount: number = 0;
  let CountDoor: number = 0;
  let CountFlipLift: number = 0;
  let CountDrawer: number = 0;
  let CountFixedfront: number = 0;
  let CountOven: number = 0;
  let CountFridge: number = 0;
  let CountRackArea: number = 0;
  let LastFrontElem: number = 0;
  let LastFrontHeight: number = 0;
  let CountFingerGrip: number = 0;
  let FingergripBottom = false;
  let tmpGapMid: number = 0;
  let FingerGripLine: number = 0;
  let StartPos = this.mod_FrontPosStart + StartPosCabinet;
  let tmpLastStartPos: number[] = []; //Stores the position of each front
  tmpLastStartPos[0] = 0;
  let tmpLastGap: number[] = []; //Stores the gap between each fronts (either normal gap or fingergrip gap)
  tmpLastGap[0] = 0;
  let tmpLastFrontFingergrip: boolean[] = [false]; // Stores if the front has fingergrip
  tmpLastFrontFingergrip[0] = false;
  let prevtopshelf = 0  //verify if the prvious module has a fix top shelf

  // Initialize fingergrip information for the carcase
  carc.mod_FingergripTop = false;
  carc.mod_FingergripQtyMiddle = 0;
  carc.mod_FingergripPos1 = 0;
  carc.mod_FingergripPos2 = 0;
  carc.mod_FingergripPos3 = 0;
  carc.mod_FingergripPos4 = 0;
  carc.mod_FingergripPos5 = 0;

  //Initialize variables for Dividers
  let VertDividerType: string[] = [];
  let VertDividerFrontWidth: number[] = [];
  let VertDividerFrontName: string[] = [];
  


  // Define variable to inform what's the bottom front 
  let FrontOnBottom: string = 'None';

  //===================================================
  // Create Front ID and Count total quantities
  //===================================================

  const typeCounters = {
    Drawer: 0,
    Door: 0,
    Fliplift: 0,
    Fixedfront: 0,
    Oven: 0,
    Fridge: 0,
    RackArea: 0,
    FillerFront: 0
  };

  this.m.forEach(p => {
    if (p instanceof OD_M_mf_FillerFront) {
      p.mod_FrontId = 'FillerFront_' + (++typeCounters.FillerFront);
      p.mod_DoorDirection = this.mod_Direction == 'Left' ? 'Left' : 'Right';
      p.mod_SidepanelleftThk = this.mod_SidepanelleftType == 'NoSp' ? 0 : this.mod_SidepanelleftThk;
      p.mod_SidepanelrightThk = this.mod_SidepanelleftType == 'NoSp' ? 0 : this.mod_SidepanelrightThk;
    }
  });

  // Cycle
  this.m.forEach(p => {

    //===============================================================================================
    // Manage generic dimensions and gaps for all front elements
    //===============================================================================================

    if (p instanceof OD_M_mf_FillerFront) {

      // Create Carcase ID and Attributes
      GlobalCount++;
      p.mod_CarcaseId = 'Carcase_01';
      p.mod_CarcaseDepth = this.mod_Depth;
      p.mod_CarcaseWidth = this.mod_Width;
      //p.mod_CarcaseHeight = height; // TO DELETE
      p.mod_CarcaseHeight = this.mod_Height;
      p.mod_FrontPosStart = StartPos - StartPosCabinet;

      // setOrigin
      p.setOrigin(0, StartPos, this.mod_Depth);

      p.mod_Originpos[0] = 0;
      p.mod_Originpos[1] = StartPos;
      p.mod_Originpos[2] = this.mod_Depth;

      // Check first and last front element
      if (StartPos + p.mod_FrontHeightSelection! >= this.mod_Height + StartPosCabinet) { LastFrontElem = 1 }

      // Error if front element start over the carcase top end
      if (StartPos >= this.mod_Height + StartPosCabinet) {
        let ErrorMessage = GlobalFunc.find_ErrorList('Error 22019', 1);
        logError(ErrorMessage.Message(''));
      }

      // Calculation of front height and set information to carcase regarding fingergrip
      if (LastFrontElem == 1 && p.mod_FingergripTop == true) {
        carc.mod_FingergripTop = true;
        p.mod_FrontHeight = this.mod_Height - (StartPos - StartPosCabinet + this.mod_FingergripType_matrix.LShapeGapAbove!)
        LastFrontHeight = this.mod_Height - (StartPos - StartPosCabinet);
        StartPos = this.mod_Height;
        tmpLastStartPos.push(StartPos - StartPosCabinet);
        tmpLastGap.push(-this.mod_FingergripType_matrix.CShapeOverlapAbove!);
        if (tmpLastFrontFingergrip[tmpLastFrontFingergrip.length - 1] == true) { p.mod_FingergripBtmType = carc.mod_FingergripType! }
        else { p.mod_FingergripBtmType = 'NoFingergrip' }
        tmpLastFrontFingergrip.push(true);
        p.mod_FingergripTopType = carc.mod_FingergripType!;

      }
      else if (LastFrontElem == 1 && p.mod_FingergripTop == false) {
        p.mod_FrontHeight = this.mod_Height - (StartPos - StartPosCabinet + this.mod_FrontGapHorTop);
        LastFrontHeight = this.mod_Height - (StartPos - StartPosCabinet); 
        StartPos = this.mod_Height;
        tmpLastStartPos.push(StartPos - StartPosCabinet);
        tmpLastGap.push(this.mod_FrontGapHorTop);
        if (tmpLastFrontFingergrip[tmpLastFrontFingergrip.length - 1] == true) { p.mod_FingergripBtmType = carc.mod_FingergripType! }
        else { p.mod_FingergripBtmType = 'NoFingergrip' }
        tmpLastFrontFingergrip.push(false);
        p.mod_FingergripTopType = 'NoFingergrip';
      }
      else {
        if (p.mod_FingergripTop == true) {

          tmpGapMid = this.mod_FingergripType_matrix.CShapeHeight! - (this.mod_FingergripType_matrix.CShapeOverlapBelow! + this.mod_FingergripType_matrix.CShapeOverlapAbove!);
          p.mod_FrontHeight! = p.mod_FrontHeightSelection! - tmpGapMid;
          StartPos += p.mod_FrontHeightSelection! - tmpGapMid - this.mod_FingergripType_matrix.CShapeOverlapBelow! + this.mod_FingergripType_matrix.CShapeHeight! - this.mod_FingergripType_matrix.CShapeOverlapAbove!;

          FingerGripLine = StartPos + this.mod_FingergripType_matrix.CShapeOverlapAbove! - (StartPosCabinet + this.mod_FingergripType_matrix.CShapeHeight! / 2);
          CountFingerGrip++;

          switch (CountFingerGrip) {
            case 1:
              carc.mod_FingergripPos1 = FingerGripLine;
              break;
            case 2:
              carc.mod_FingergripPos2 = FingerGripLine;
              break;
            case 3:
              carc.mod_FingergripPos3 = FingerGripLine;
              break;
            case 4:
              carc.mod_FingergripPos4 = FingerGripLine;
              break;
            case 5:
              carc.mod_FingergripPos5 = FingerGripLine;
              break;
            default:
              let ErrorMessage = GlobalFunc.find_ErrorList('Error 22020', 1);
              logError(ErrorMessage.Message(''));
              break;
          }
          tmpLastStartPos.push(StartPos - StartPosCabinet);
          tmpLastGap.push(-this.mod_FingergripType_matrix.CShapeOverlapAbove!);
          if (tmpLastFrontFingergrip[tmpLastFrontFingergrip.length - 1] == true) { p.mod_FingergripBtmType = carc.mod_FingergripType! }
          else { p.mod_FingergripBtmType = 'NoFingergrip' }
          tmpLastFrontFingergrip.push(true);
          p.mod_FingergripTopType = carc.mod_FingergripType!;

        }
        else {
          StartPos += p.mod_FrontHeightSelection!;
          p.mod_FrontHeight = p.mod_FrontHeightSelection! - this.mod_FrontGapHor;
          tmpLastStartPos.push(StartPos - StartPosCabinet);
          tmpLastGap.push(this.mod_FrontGapHor / 2);
          if (tmpLastFrontFingergrip[tmpLastFrontFingergrip.length - 1] == true) { p.mod_FingergripBtmType = carc.mod_FingergripType! }
          else { p.mod_FingergripBtmType = 'NoFingergrip' }
          tmpLastFrontFingergrip.push(false);
          p.mod_FingergripTopType = 'NoFingergrip';

        }
      }

      //===================================================
      // Provide the data of the last front to the carcase
      //===================================================

      if (LastFrontElem == 1) {

        // Height of the last front element
        carc.mod_LastFrontHeight = LastFrontHeight;

        // FrontName
        if (p instanceof OD_M_mf_FillerFront) {
          carc.mod_LastFrontName = "fillerfront";
        }
      }

      //===================================================
      // Manage Front Width and Construction
      //===================================================
      if (p instanceof OD_M_mf_FillerFront) {
        p.mod_FrontWidth = this.mod_Width;
        if (this.mod_CarcaseFrontConstruction_matrix.Left == "Inlayed") { p.mod_FrontWidth = p.mod_FrontWidth - this.mod_SidepanelleftThk };
        if (this.mod_CarcaseFrontConstruction_matrix.Right == "Inlayed") { p.mod_FrontWidth = p.mod_FrontWidth - this.mod_SidepanelrightThk };
      }
    }

    //===============================================================================================
    // Collect the data of the fronts to supply it to the carcase
    //===============================================================================================

    // Interface to provide the data for the carcase
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

    // All the other fronts
    //-------------------------------------------------------------------------------------
    if (p instanceof OD_M_mf_FillerFront) {
      // Create the object
      let frontInfo: FrontInfo = {
        //StartingPosition: p.mod_FrontPosStart!, //UNCOMMENT
        StartingPosition: 0,
        //FrontHeight: p.mod_FrontHeightSelection!, //UNCOMMENT
        FrontHeight: 0,
        //RealFrontHeight: p.mod_FrontHeight!, //UNCOMMENT
        RealFrontHeight: 0,
        //BackwallConstruction: p.mod_CarcaseBackwallConstruction!, //UNCOMMENT
        BackwallConstruction: 'NoBackwall',
        //BackwallPosition: p.mod_BackwallPos!, // UNCOMMENT
        BackwallPosition: 0,
        //FixedshelfBottom: p.mod_ShelffixedBtm!, //UNCOMMENT
        FixedshelfBottom: false,
        FingergripBottom: FingergripBottom,
        //FingergripTop: !!p.mod_FingergripTop, //UNCOMMENT
        FingergripTop: !! false,
        FringergripType: this.mod_FingergripType
      }

      // Stringify the object and push it to the list attribute
      carc.mod_FrontAreaInfoList.push(JSON.stringify(frontInfo));
    }
    // Save the fingergrip for the next front
    //FingergripBottom = !!p.mod_FingergripTop; //UNCOMMENT
    FingergripBottom = !! false;


    //===================================================
    // Manage the Vert Dividers
    //===================================================

    if (p instanceof OD_M_mf_FillerFront) {


      // Get the Information about the doors
      let doorInfo = GlobalFunc.process_Door(p);

      // Set the values of the attributes (will be provided to the carcase)
      VertDividerType[GlobalCount] = doorInfo.VertDivider;
      VertDividerFrontWidth[GlobalCount] = doorInfo.FrontWidthList[0]
      VertDividerFrontName[GlobalCount] = p.mod_ModuleName!;
    }
    else {
      VertDividerType[GlobalCount] = 'NoVertDivider';
    }

    //===================================================
    // Manage ModuleName and RackArea
    //===================================================

    // Save wich front we've managed so that on the next one we know it
    if (p instanceof OD_M_mf_FillerFront) {
      FrontOnBottom = p.mod_ModuleName!;
    }


  });


  //================================================================================
  //          Stringify the Divider Information and pass it to the mc_Storageunit (will be used to insert the VertDivider in the mc_Storageunit)
  //================================================================================

  let VertDividerInfo: any = {
    Type: VertDividerType,
    FrontWidth: VertDividerFrontWidth,
    FrontName: VertDividerFrontName,
    PosX: undefined,
    DimX: undefined,
    FreeSpaceWidth: undefined,
    FreeSpaceWidthStartPos: undefined
  };

  let strJson = JSON.stringify(VertDividerInfo);
  carc.mod_VertDividerInfoList.push(strJson);


  //===================================================
  // Manage the fingergrip
  //===================================================

  carc.mod_FingergripQtyMiddle = CountFingerGrip;

  //===================================================
  // Seal mc_Storageunit and get attribute with FreeSpace
  //===================================================
  let sealedCarc = carc.seal();
  let sealedCarc_CarcaseSpaceDimension = JSON.parse(sealedCarc.mod_CarcaseSpaceDimension[0]);
  let sealedCarc_VertDividerInfoList = JSON.parse(sealedCarc.mod_VertDividerInfoList[0]);
  let sealedCarc_CarcasePartInfo = JSON.parse(sealedCarc.mod_CarcasePartInfo[0]);
  let BtmShelfPosDepth = sealedCarc_CarcasePartInfo.HorizontalPartsPosZ[1];
  let BtmShelfPos = sealedCarc_CarcasePartInfo.HorizontalPartsPosY[1];
  let i = 0

  // Cycle for the child modules
  this.m.forEach(p => {

    if (p instanceof OD_M_mf_FillerFront) {

      // Set the attribute for the free space (CarcaseSpaceDimension) regarding each front
      let CarcaseSpaceDimension: any = {
        FullWidthFreeSpace: sealedCarc_CarcaseSpaceDimension.FullWidthFreeSpace,
        FullHeightFreeSpace: sealedCarc_CarcaseSpaceDimension.FullHeightFreeSpace,
        FullDepthFreeSpace: sealedCarc_CarcaseSpaceDimension.FullDepthFreeSpace,
        FullWidthStartPos: sealedCarc_CarcaseSpaceDimension.FullWidthStartPos,
        FullHeightStartPos: sealedCarc_CarcaseSpaceDimension.FullHeightStartPos,
        FullDepthStartPos: sealedCarc_CarcaseSpaceDimension.FullDepthStartPos,
        WidthFreeSpace: sealedCarc_CarcaseSpaceDimension.WidthFreeSpace[i],
        HeightFreeSpace: sealedCarc_CarcaseSpaceDimension.HeightFreeSpace[i],
        DepthFreeSpace: sealedCarc_CarcaseSpaceDimension.DepthFreeSpace[i],
        WidthFreeStartPos: sealedCarc_CarcaseSpaceDimension.WidthFreeStartPos[i],
        HeightFreeStartPos: sealedCarc_CarcaseSpaceDimension.HeightFreeStartPos[i] + StartPosCabinet,
        DepthFreeStartPos: sealedCarc_CarcaseSpaceDimension.DepthFreeStartPos[i]
      };
      let strJson = JSON.stringify(CarcaseSpaceDimension);
      p.mod_CarcaseSpaceDimension.push(strJson);

      // Sequence of the fronts
      i++

      // Set the attribute for the VertDividerInfoList info (mod_VertDividerInfoList) regarding each front (will be used for the adjustable shelves)


      // Provide the CarcasePartInfo regarding each front
      if (p instanceof OD_M_mf_FillerFront) {

        // Get the information regarding the HorizontalParts in an Array
        let HorizontalPartsType: string[] = [];
        HorizontalPartsType.push(sealedCarc_CarcasePartInfo.HorizontalPartsType[i]);
        let HorizontalPartsPosY: number[] = [];
        HorizontalPartsPosY.push(sealedCarc_CarcasePartInfo.HorizontalPartsPosY[i]);
        let HorizontalPartsPosZ: number[] = [];
        HorizontalPartsPosZ.push(sealedCarc_CarcasePartInfo.HorizontalPartsPosZ[i]);
        let HorizontalPartsDimY: number[] = [];
        HorizontalPartsDimY.push(sealedCarc_CarcasePartInfo.HorizontalPartsDimY[i]);
        let HorizontalPartsDimZ: number[] = [];
        HorizontalPartsDimZ.push(sealedCarc_CarcasePartInfo.HorizontalPartsDimZ[i]);
        let HorizontalPartsFrontAngle: number[] = [];
        HorizontalPartsFrontAngle.push(sealedCarc_CarcasePartInfo.HorizontalPartsFrontAngle[i]);

        if (this.mod_CarcaseShelftopConstruction != 'RailTopBackHorizontal' && this.mod_CarcaseShelftopConstruction != 'RailTopBackVertical') { // Only push the top part if it exists
          HorizontalPartsType.push(sealedCarc_CarcasePartInfo.HorizontalPartsType[i + 1]);
          HorizontalPartsPosY.push(sealedCarc_CarcasePartInfo.HorizontalPartsPosY[i + 1]);
          HorizontalPartsPosZ.push(sealedCarc_CarcasePartInfo.HorizontalPartsPosZ[i + 1]);
          HorizontalPartsDimY.push(sealedCarc_CarcasePartInfo.HorizontalPartsDimY[i + 1]);
          HorizontalPartsDimZ.push(sealedCarc_CarcasePartInfo.HorizontalPartsDimZ[i + 1]);
          HorizontalPartsFrontAngle.push(sealedCarc_CarcasePartInfo.HorizontalPartsFrontAngle[i + 1]);
        }

        // Set the attribute CarcasePartInfo regarding each front
        let CarcasePartInfo: any = {
          HorizontalPartsType: HorizontalPartsType,
          HorizontalPartsPosY: HorizontalPartsPosY,
          HorizontalPartsPosZ: HorizontalPartsPosZ,
          HorizontalPartsDimY: HorizontalPartsDimY,
          HorizontalPartsDimZ: HorizontalPartsDimZ,
          HorizontalPartsFrontAngle: HorizontalPartsFrontAngle,
          VerticalPartsType: sealedCarc_CarcasePartInfo.VerticalPartsType[i],
          VerticalPartsPosX: sealedCarc_CarcasePartInfo.VerticalPartsPosX[i],
          VerticalPartsPosZ: sealedCarc_CarcasePartInfo.VerticalPartsPosZ[i],
          VerticalPartsDimX: sealedCarc_CarcasePartInfo.VerticalPartsDimX[i],
          VerticalPartsDimZ: sealedCarc_CarcasePartInfo.VerticalPartsDimZ[i],
          VerticalPartsFrontAngle: sealedCarc_CarcasePartInfo.VerticalPartsFrontAngle[i]
        };

        let CarcasePartInfoJson = JSON.stringify(CarcasePartInfo);
        p.mod_CarcasePartInfo.push(CarcasePartInfoJson);
      }

    }
  });

  //===================================================
  // Calculate the toe kick position
  //===================================================

  if (this.mod_PlinthAreaDesign_matrix.PlinthAreaType !== 'None') {
    let retInfo = GlobalFunc.process_PlinthAreaLegs(this);

    // Provide the position of the legs for creation of the contour
    const legPositions = {
      LineLeft: retInfo.LineLeft,
      LineRight: retInfo.LineRight,
      LineFront: retInfo.LineFront,
      LineBack: retInfo.LineBack
    };
    this.mod_PlinthAreaPositionInfo.push(JSON.stringify(legPositions));
  }
  
  //===================================================
  //          Create vector / docking
  //===================================================

  let TopEndCabinet = StartPosCabinet + this.mod_Height; 

	// Left side
	this.addDockingInfo(Dock.LeftBottom, new Vector3(0, 0, -this.mod_CarcaseDistanceWall), new Vector3(0, 0, this.mod_Depth));
	this.addDockingInfo(Dock.LeftTop, new Vector3(0, TopEndCabinet, -this.mod_CarcaseDistanceWall), new Vector3(0, TopEndCabinet, this.mod_Depth));

	// Right side
	this.addDockingInfo(Dock.RightBottom, new Vector3(this.mod_Width, 0, -this.mod_CarcaseDistanceWall), new Vector3(this.mod_Width, 0, this.mod_Depth));
	this.addDockingInfo(Dock.RightTop, new Vector3(this.mod_Width, TopEndCabinet, -this.mod_CarcaseDistanceWall), new Vector3(this.mod_Width, TopEndCabinet, this.mod_Depth));

	// Back side
	this.addDockingInfo(Dock.BackBottom, new Vector3(0, 0, -this.mod_CarcaseDistanceWall), new Vector3(this.mod_Width, 0, -this.mod_CarcaseDistanceWall));
	this.addDockingInfo(Dock.BackTop, new Vector3(0, TopEndCabinet, -this.mod_CarcaseDistanceWall), new Vector3(this.mod_Width, TopEndCabinet, -this.mod_CarcaseDistanceWall));

  //===================================================
  //          Manage the insertion level
  //===================================================

  
  if (this.mod_HeightPosInsertion > 0) {
    let InsertionHeight = this.mod_HeightPosInsertion + this.mod_PlinthAreaHeight;
    this.addInsertLevelHeight(InsertionHeight, true);
    this.insertLevelFixed = false;
  }
  else {
    this.addInsertLevelHeight(0, true);
    this.insertLevelFixed = true;
  }
  
  
	//===================================================
	//          Call the UserExit of this module
	//===================================================

	let retInfo = GlobalFunc.ue_Filler(this);
