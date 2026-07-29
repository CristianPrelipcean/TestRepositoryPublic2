
  // Schuler Consulting
  // Schuler Consulting
  // Create: Jun 2024
  // By Joao Lisboa
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_HangerSystem
  // Add a single hanger
  //
  // Revisions:
  // 
  //===================================================

  //====================================================================
  // Get Hanger Data
  //====================================================================

  const hangerInfo = JSON.parse(this.mod_HangerInfo[0]);

  //====================================================================
  // Hanger Drawing + WallPlate Drawing + CoverCap Drawing
  //====================================================================

  const hangerGraphLibMap = GlobalFunc.find_GraphicLibraryMapping(hangerInfo.GraphicItem);
  const hangerData: { fitting: any; graphic: any | null }[] = [];

  hangerGraphLibMap.forEach(x => {
    const [FittingInfo, GraphicInfo] = GlobalFunc.process_GraphicLibraryData(x.Model3DGroupName ?? '');

    // If we got data in FittingInfo, then we can add it to the hangerData array
    if (FittingInfo) {
      hangerData.push({ fitting: FittingInfo, graphic: GraphicInfo ?? null });
    }
  });

  hangerData.forEach(x => {
    if (this.mod_HangerPosX_matrix.Left && (x.fitting.Identifier == 'HangerLeftVisible' || x.fitting.Identifier == 'HangerLeftInvisible')) {
      let positionHangerLeft = GlobalFunc.process_GraphicInsertionHelper("020", x.fitting.in_Model3DGroupName!, x.fitting.DimensionX!, x.fitting.DimensionY!, x.fitting.DimensionZ!);
      let posx = positionHangerLeft.InsertionPointX! + positionHangerLeft.GraphicLibrary.PartOffsetX!;
      let posy = positionHangerLeft.InsertionPointY! + positionHangerLeft.GraphicLibrary.PartOffsetY! + hangerInfo.VerticalOffset!;
      let posz = positionHangerLeft.InsertionPointZ! + positionHangerLeft.GraphicLibrary.PartOffsetZ!;
      if (x.fitting.Identifier == 'HangerLeftInvisible') {
        posz = - x.fitting.DimensionZ - this.mod_BackwallThk
      }
      let dimx = positionHangerLeft.DimensionX!
      let dimy = positionHangerLeft.DimensionY!
      let dimz = positionHangerLeft.DimensionZ!
      // Add Part HangerLeft
      let hangerLeft = this.addpart_HangerSystem(posx, posy, posz, dimx, dimy, dimz);
      this.assignPartGroup(this.mod_CarcaseId, hangerLeft);
      hangerLeft.assign3DModel(x.graphic.Model3D!);
      let hangerLeftDrill = this.addpart_HangerDrill(positionHangerLeft.InsertionPointX!, posy, posz, dimx + positionHangerLeft.GraphicLibrary.PartOffsetX!, dimy, dimz);
      this.assignPartGroup(this.mod_CarcaseId, hangerLeftDrill);
      hangerLeftDrill.pa_Model3DGroupName = x.fitting.in_Model3DGroupName!;
      hangerLeftDrill.pa_ProcessingId = hangerInfo.ProcessingItem!;
    }

    if (this.mod_HangerPosX_matrix.Right && (x.fitting.Identifier == 'HangerRightVisible' || x.fitting.Identifier == 'HangerRightInvisible')) {
      let positionHangerRight = GlobalFunc.process_GraphicInsertionHelper("220", x.fitting.in_Model3DGroupName!, x.fitting.DimensionX!, x.fitting.DimensionY!, x.fitting.DimensionZ!);
      let posx = positionHangerRight.InsertionPointX! + positionHangerRight.GraphicLibrary.PartOffsetX! + hangerInfo.HorizontalFreeSpace;
      let posy = positionHangerRight.InsertionPointY! + positionHangerRight.GraphicLibrary.PartOffsetY! + hangerInfo.VerticalOffset!;
      let posz = positionHangerRight.InsertionPointZ! + positionHangerRight.GraphicLibrary.PartOffsetZ!;
      if (x.fitting.Identifier == 'HangerRightInvisible') {
        posz = - x.fitting.DimensionZ - this.mod_BackwallThk
      }
      let dimx = positionHangerRight.DimensionX!
      let dimy = positionHangerRight.DimensionY!
      let dimz = positionHangerRight.DimensionZ!
      // Add Part HangerRight
      let hangerRight = this.addpart_HangerSystem(posx, posy, posz, dimx, dimy, dimz);
      this.assignPartGroup(this.mod_CarcaseId, hangerRight);
      hangerRight.assign3DModel(x.graphic.Model3D!);
      let hangerRightDrill = this.addpart_HangerDrill(positionHangerRight.InsertionPointX! + hangerInfo.HorizontalFreeSpace + positionHangerRight.GraphicLibrary.PartOffsetX!, posy, posz, dimx - positionHangerRight.GraphicLibrary.PartOffsetX!, dimy, dimz);
      this.assignPartGroup(this.mod_CarcaseId, hangerRightDrill);
      hangerRightDrill.pa_Model3DGroupName = x.fitting.in_Model3DGroupName!;
      hangerRightDrill.pa_ProcessingId = hangerInfo.ProcessingItem!;
    }
    if (this.mod_HangerPosX_matrix.Left && x.fitting.Identifier == 'WallPlate' && hangerInfo.IncludeWallPlateLeft) {
      let tmpDimX = x.fitting.DimensionX!;
      // Cuttable WallPlate has a different dimx
      if (hangerInfo.WallPlateLeftLength != 0) {
        tmpDimX = hangerInfo.WallPlateLeftLength;
      }

      let positionWallPlateLeft = GlobalFunc.process_GraphicInsertionHelper("020", x.fitting.in_Model3DGroupName!, tmpDimX, x.fitting.DimensionY!, x.fitting.DimensionZ!);
      let posx = positionWallPlateLeft.InsertionPointX! + positionWallPlateLeft.GraphicLibrary.PartOffsetX!;
      let posy = positionWallPlateLeft.InsertionPointY! + positionWallPlateLeft.GraphicLibrary.PartOffsetY! + hangerInfo.VerticalOffset! + hangerInfo.VerticalOffsetWallPlateToHanger!;
      let posz = -this.mod_Originpos[2];
      let dimx = positionWallPlateLeft.DimensionX!
      let dimy = positionWallPlateLeft.DimensionY!
      let dimz = positionWallPlateLeft.DimensionZ!

      // Add Part WallPlateLeft
      let wallPlateLeft = this.addpart_HangerSystem(posx, posy, posz, dimx, dimy, dimz);
      this.assignPartGroup(this.mod_CarcaseId, wallPlateLeft);
      wallPlateLeft.assign3DModel(x.graphic.Model3D!);
    }
    if (this.mod_HangerPosX_matrix.Right && x.fitting.Identifier == 'WallPlate' && hangerInfo.IncludeWallPlateRight) {
      let tmpDimX = x.fitting.DimensionX!;
      // Cuttable WallPlate has a different dimx and posx
      if (hangerInfo.WallPlateRightLength != 0) {
        tmpDimX = hangerInfo.WallPlateRightLength;
      }

      let positionWallPlateRight = GlobalFunc.process_GraphicInsertionHelper("220", x.fitting.in_Model3DGroupName!, tmpDimX, x.fitting.DimensionY!, x.fitting.DimensionZ!);
      let posx = positionWallPlateRight.InsertionPointX! + positionWallPlateRight.GraphicLibrary.PartOffsetX! + hangerInfo.HorizontalFreeSpace;
      let posy = positionWallPlateRight.InsertionPointY! + positionWallPlateRight.GraphicLibrary.PartOffsetY! + hangerInfo.VerticalOffset! + hangerInfo.VerticalOffsetWallPlateToHanger!;
      let posz = -this.mod_Originpos[2];
      let dimx = positionWallPlateRight.DimensionX!
      let dimy = positionWallPlateRight.DimensionY!
      let dimz = positionWallPlateRight.DimensionZ!

      // Add Part WallPlateRight
      let wallPlateRight = this.addpart_HangerSystem(posx, posy, posz, dimx, dimy, dimz);
      this.assignPartGroup(this.mod_CarcaseId, wallPlateRight);
      wallPlateRight.assign3DModel(x.graphic.Model3D!);
    }
    if (this.mod_HangerPosX_matrix.Left && x.fitting.Identifier == 'HangerCoverCapLeft') {
      let positionHangerCoverCapLeft = GlobalFunc.process_GraphicInsertionHelper("020", x.fitting.in_Model3DGroupName!, x.fitting.DimensionX!, x.fitting.DimensionY!, x.fitting.DimensionZ!);
      let posx = positionHangerCoverCapLeft.InsertionPointX! + positionHangerCoverCapLeft.GraphicLibrary.PartOffsetX!;
      let posy = positionHangerCoverCapLeft.InsertionPointY! + positionHangerCoverCapLeft.GraphicLibrary.PartOffsetY! + hangerInfo.VerticalOffset!;
      let posz = positionHangerCoverCapLeft.InsertionPointZ! + positionHangerCoverCapLeft.GraphicLibrary.PartOffsetZ!;
      let dimx = positionHangerCoverCapLeft.DimensionX!
      let dimy = positionHangerCoverCapLeft.DimensionY!
      let dimz = positionHangerCoverCapLeft.DimensionZ!
      // Add Part CoverCapLeft
      let hangerLeft = this.addpart_HangerSystem(posx, posy, posz, dimx, dimy, dimz);
      this.assignPartGroup(this.mod_CarcaseId, hangerLeft);
      hangerLeft.assign3DModel(x.graphic.Model3D!);
    }
    if (this.mod_HangerPosX_matrix.Right && x.fitting.Identifier == 'HangerCoverCapRight') {
      let positionHangerCoverCapRight = GlobalFunc.process_GraphicInsertionHelper("220", x.fitting.in_Model3DGroupName!, x.fitting.DimensionX!, x.fitting.DimensionY!, x.fitting.DimensionZ!);
      let posx = positionHangerCoverCapRight.InsertionPointX! + positionHangerCoverCapRight.GraphicLibrary.PartOffsetX! + hangerInfo.HorizontalFreeSpace;
      let posy = positionHangerCoverCapRight.InsertionPointY! + positionHangerCoverCapRight.GraphicLibrary.PartOffsetY! + hangerInfo.VerticalOffset!;
      let posz = positionHangerCoverCapRight.InsertionPointZ! + positionHangerCoverCapRight.GraphicLibrary.PartOffsetZ!;
      let dimx = positionHangerCoverCapRight.DimensionX!
      let dimy = positionHangerCoverCapRight.DimensionY!
      let dimz = positionHangerCoverCapRight.DimensionZ!
      // Add Part CoverCapRight
      let hangerRight = this.addpart_HangerSystem(posx, posy, posz, dimx, dimy, dimz);
      this.assignPartGroup(this.mod_CarcaseId, hangerRight);
      hangerRight.assign3DModel(x.graphic.Model3D!);
    }
  });


  //====================================================================
  // Hanger BOM + WallPlate BOM + CoverCap BOM
  //====================================================================
  let hardwareBOM = this.addpart_HangerSystemBom(0, 0, 0, 10, 10, 10);
  this.assignPartGroup(this.mod_CarcaseId, hardwareBOM);
  hardwareBOM.pa_HardwareId = hangerInfo.HardwareItem!;
  hardwareBOM.pa_WallPlateLengthLeft = 0;
  hardwareBOM.pa_WallPlateQtyLeft = 0;
  hardwareBOM.pa_WallPlateLengthRight = 0;
  hardwareBOM.pa_WallPlateQtyRight = 0;
  if (hangerInfo.IncludeWallPlateLeft!) {
    hardwareBOM.pa_WallPlateLengthLeft = hangerInfo.WallPlateLeftLength!;
    hardwareBOM.pa_WallPlateQtyLeft = 1
  }
  if (hangerInfo.IncludeWallPlateRight!) {
    hardwareBOM.pa_WallPlateLengthRight = hangerInfo.WallPlateRightLength!;
    hardwareBOM.pa_WallPlateQtyRight = 1
  }