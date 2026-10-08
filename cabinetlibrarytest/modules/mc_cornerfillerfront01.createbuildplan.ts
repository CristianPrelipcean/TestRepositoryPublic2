


  //====================================================================
  // Add FillerHardware for the Corner filler only (the CornerunitStraightFiller does not need it)
  //====================================================================

  if (this.mod_FrontType == 'CornerFiller') {


    // Get the Information of the mod_FillerHardwareInfo
    interface iFillerHardwareInfo {
      Object: string[];
      ConnectionSide: string[];
      PosY: number[];
      PosX: number[];
      HardwareItem: string[];
      ProcessingItem: string[];
      GraphicItem: string[];
    }

    let fillerHardwareInfo: iFillerHardwareInfo = JSON.parse(this.mod_FillerHardwareInfo[0]);

    // Declare variable to share info to left filler to generate processings
    interface iFillerLeftHardwareInfo {
      Model3D: string[];
      ProcessingItem: string[];
      PosX: number[];
      PosY: number[];
    }
    let fillerLeftHardwareInfo: iFillerLeftHardwareInfo = {
      Model3D: [],
      ProcessingItem: [],
      PosX: [],
      PosY: []
    };

    //====================================================================
    // Add Filler Hardware Drawing
    //====================================================================
    let i = 0;
    fillerHardwareInfo.GraphicItem.forEach(item => {

      /*

      let graphicItem = GlobalFunc.find_GraphicLibraryMapping(fillerHardwareInfo.GraphicItem[i])

      graphicItem.forEach(graphic => {
        let model3D = GlobalFunc.find_GraphicLibrary(graphic.Model3DGroupName!);
        // Calculate Position of FillerHardware BoundaryBox
        let positionFillerHardware = GlobalFunc.process_GraphicInsertionHelper("012", model3D.in_Model3DGroupName!, model3D.DimensionX!, model3D.DimensionY!, model3D.DimensionZ!);

        let dimxDrawing = positionFillerHardware.DimensionX!;
        let dimyDrawing = positionFillerHardware.DimensionY!;
        let dimzDrawing = positionFillerHardware.DimensionZ!;
        let posxDrawing: number;
        if (this.mod_Direction == "Right") {
          posxDrawing = retDoorInfo.width + fillerHardwareInfo.PosX[i] + positionFillerHardware.InsertionPointX + positionFillerHardware.OffsetX;
        }
        else { 
          posxDrawing = fillerHardwareInfo.PosX[i] + positionFillerHardware.InsertionPointX + positionFillerHardware.OffsetX;
        }
        
        let posyDrawing = fillerHardwareInfo.PosY[i] + positionFillerHardware.InsertionPointY + positionFillerHardware.OffsetY;
        let poszDrawing: number;
        if (this.mod_Direction == "Right") {
          poszDrawing = 0 + positionFillerHardware.InsertionPointZ + positionFillerHardware.OffsetZ - positionFillerHardware.OversizeZ;
        }
        else { 
          poszDrawing = retDoorInfo.posZ + positionFillerHardware.InsertionPointZ + positionFillerHardware.OffsetZ - positionFillerHardware.OversizeZ;
        }

        // Pass information of fillerLeftHardwareInfo
        fillerLeftHardwareInfo.Model3D.push(graphic.Model3DGroupName!);
        fillerLeftHardwareInfo.ProcessingItem.push(fillerHardwareInfo.ProcessingItem[i]);
        fillerLeftHardwareInfo.PosX.push(posxDrawing - retDoorInfo.posX);
        fillerLeftHardwareInfo.PosY.push(posyDrawing + dimyDrawing / 2);

        // Get the rotation
        let rotation = 0;
        let test = 0;
        switch (fillerHardwareInfo.ConnectionSide[i]) {
          case 'Right':
            rotation = 180;
            //test = -80;
            break;
          case 'Left':
            rotation = 0;
            break
          case 'Top':
            rotation = 270;
            break
          case 'Btm':
            rotation = 90;
            break
        }

        // Get the correction in positioning based on the rotation
        let graphicsRotation = GlobalFunc.find_PartsGraphicRotation('012', 'Z', rotation);

        // Add Part FillerHardware
        let posX = graphicsRotation.AdditionalX(dimxDrawing, dimyDrawing, dimzDrawing) + test;
        let posZ = graphicsRotation.AdditionalZ(dimxDrawing, dimyDrawing, dimzDrawing);
        let fillerHardware = this.addpart_FillerHardware(
          posxDrawing + posX,
          posyDrawing + graphicsRotation.AdditionalY(dimxDrawing, dimyDrawing, dimzDrawing), 
          poszDrawing + posZ, 
          dimxDrawing, 
          dimyDrawing, 
          dimzDrawing
        );

        // Assign3DModel
        fillerHardware.assign3DModel(model3D.Model3D!);

        // Add Material
        let fittingColor = GlobalFunc.process_HardwareColor(fillerHardwareInfo.HardwareItem[i]);
        GlobalFunc.process_AddMaterial(fillerHardware, 'fitting', fittingColor!);

        // Rotate 3DModel
        let partMatrix = PartHelper.rotateZ(fillerHardware, rotation, new Vector3(graphicsRotation.RotationVectorX(dimxDrawing, dimyDrawing, dimzDrawing), graphicsRotation.RotationVectorY(dimxDrawing, dimyDrawing, dimzDrawing), graphicsRotation.RotationVectorZ(dimxDrawing, dimyDrawing, dimzDrawing)));
        fillerHardware.setMatrix(partMatrix);

        // Set attributes to the part
        fillerHardware.pa_HardwareId = fillerHardwareInfo.HardwareItem[i];


        // Assign to PartGroup
        this.assignPartGroup(this.mod_FrontId, fillerHardware);


        //====================================================================
        // Add Filler Hardware Processing
        //====================================================================
        let fillerProcessing: any;
        switch (fillerHardwareInfo.ConnectionSide[i]) {
          case 'Right':
            fillerProcessing = this.addpart_FillerHardware(retDoorInfo.posX + fillerHardwareInfo.PosX[i] - 1, fillerHardwareInfo.PosY[i], poszDrawing, 1, 1, dimzDrawing + positionFillerHardware.OversizeZ);
            break;
          case 'Left':
            if (this.mod_Direction == "Right") {
              fillerProcessing = this.addpart_FillerHardwareProcessing(this.mod_FrontGapVert / 2 + fillerHardwareInfo.PosX[i], fillerHardwareInfo.PosY[i], poszDrawing, 1, 1, dimzDrawing + positionFillerHardware.OversizeZ);
            }
            else {
              fillerProcessing = this.addpart_FillerHardwareProcessing(fillerHardwareInfo.PosX[i]-1, fillerHardwareInfo.PosY[i], poszDrawing, 1, 1, dimzDrawing + positionFillerHardware.OversizeZ); // Nummer 1
            }
            break
          case 'Top':
            fillerProcessing = this.addpart_FillerHardwareProcessing(this.mod_FrontGapVert / 2 + fillerHardwareInfo.PosX[i], fillerHardwareInfo.PosY[i] - 1, poszDrawing, 1, 1, dimzDrawing + positionFillerHardware.OversizeZ);
            break
          case 'Btm':
            fillerProcessing = this.addpart_FillerHardwareProcessing(this.mod_FrontGapVert / 2 + fillerHardwareInfo.PosX[i], fillerHardwareInfo.PosY[i], poszDrawing, 1, 1, dimzDrawing + positionFillerHardware.OversizeZ);
            break
        }

        fillerProcessing.pa_ProcessingId = fillerHardwareInfo.ProcessingItem[i];
        fillerProcessing.pa_FrontGapCarcase = this.mod_FrontGapCarcase;
        fillerProcessing.pa_Model3DGroupName = model3D.in_Model3DGroupName!;
        fillerProcessing.pa_Rotation = rotation;
        fillerProcessing.pa_HardwareIdentifier = model3D.Identifier;
      });

      i++
      */
    });


    this.m.forEach(child => {
      if (child instanceof OD_M_mc_FrontPanel01) {
        child.mod_FillerHardwareInfo.push(JSON.stringify(fillerLeftHardwareInfo));
      }
    })

  }
  let FillerUnit=this.addpart_FillerUnit(0,0,0,this.mod_FrontWidth,this.mod_FrontHeight,this.mod_FrontThk);
  this.createPartGroup(this.mod_FrontId, FillerUnit);
