process_FrameFrontGraphicDrilling(elem: any, partSelf: any){

  let DrillHor = elem.addncout_DrillHor();
  DrillHor.nc_DrawingRelevant = false;
  DrillHor.nc_MprRelevant = false;

  //###############################################################################################################
  // Query tables
  //###############################################################################################################

  //Variables
  let FrameWidth = partSelf.pa_PanelWoodFrameType == "HeightCoveredWidth" ? partSelf.pa_FramePartsWidthHor : partSelf.pa_FramePartsWidthVert;

  //Get data from table PartSettings
  let PartSettings = GlobalFunc.find_PartSettings(partSelf._partId, partSelf.pa_AdditionalInfo1);

  // Find parts and Connection
  let FramePartConnection = GlobalFunc.find_FramePartConnectionMapping(PartSettings.PartGroup!, partSelf.pa_TypeElement, partSelf.pa_Program, partSelf._dimz);

  let PartConnection = GlobalFunc.find_PartConnectionSettings(FramePartConnection.ConnectionHardwarePositioning!, FrameWidth!, partSelf._dimz);

  let Object = GlobalFunc.find_ObjectMapping(FramePartConnection.Object!);

  //###############################################################################################################
  // Frame Type Height Covered Width
  //###############################################################################################################

  if (partSelf.pa_PanelWoodFrameType == 'HeightCoveredWidth') {

    let ProcItem = GlobalFunc.find_ProcessingMapping(Object.ProcessingItem!);
    ProcItem.forEach(Processing => {
      let DrillData = GlobalFunc.find_HardwareDrillHorLibrary(Processing.ProcessingId!, "FramePart");
      DrillData.forEach(Drill => {

        // Variables
        let wdtVert = partSelf.pa_FramePartsWidthVert;
        let wdtHor = partSelf.pa_FramePartsWidthHor;
        let drillDptFull = Drill.TI;
        let drillDpt = drillDptFull / 2;
        let drillDia = Drill.DU;
        let descr = PartConnection.LengthDescriptor!;
        let descrZ = PartConnection.WidthDescriptor!;

        // Connection points for each corner
        let ConnectionPoints: [number, number, string][] = [
          [wdtVert - drillDpt, 0, "btm"],
          [partSelf._dimx - wdtVert - drillDpt, 0, "btm"],
          [partSelf._dimx - wdtVert - drillDpt, partSelf._dimy, "top"],
          [wdtVert - drillDpt, partSelf._dimy, "top"],
        ]

        // process the descriptor
        let positions = GlobalFunc.process_Descriptor(descr, wdtHor)
        let positionsZ = GlobalFunc.process_Descriptor(descrZ, partSelf._dimz)

        // create the drawing (for each descriptor position and positionZ)
        positions.forEach(position => {
          positionsZ.forEach(positionZ => {

            // for each corner
            ConnectionPoints.forEach(([x, y, situation]) => {

              let posY = situation == "btm" ? y + position : y - position;
              let drilling01 = partSelf.add3DElement('Drilling01', DrillHor, x, posY, positionZ, drillDptFull, drillDia, drillDia);
              drilling01.extrude('<svg><circle cx="' + 0 + '" cy="' + 0 + '" r="' + drillDia / 2 + '" /></svg>', 'x');
            });
          });
        });
      });
    });
  }

  //###############################################################################################################
  // Frame Type Width Covered Height
  //###############################################################################################################

  else if (partSelf.pa_PanelWoodFrameType == 'WidthCoveredHeight') {

    let ProcItem = GlobalFunc.find_ProcessingMapping(Object.ProcessingItem!);
    ProcItem.forEach(Processing => {
      let DrillData = GlobalFunc.find_HardwareDrillHorLibrary(Processing.ProcessingId!, "FramePart");
      DrillData.forEach(Drill => {

        // Variables
        let wdtVert = partSelf.pa_FramePartsWidthVert;
        let wdtHor = partSelf.pa_FramePartsWidthHor;
        let drillDptFull = Drill.TI;
        let drillDpt = drillDptFull / 2;
        let drillDia = Drill.DU;
        let descr = PartConnection.LengthDescriptor!;
        let descrZ = PartConnection.WidthDescriptor!;

        // Connection points for each corner
        let ConnectionPoints: [number, number, string][] = [
          [0, wdtHor - drillDpt, "left"],
          [partSelf._dimx, wdtHor - drillDpt, "right"],
          [partSelf._dimx, partSelf._dimy - wdtHor - drillDpt, "right"],
          [0, partSelf._dimy - wdtHor - drillDpt, "left"],
        ]

        // process the descriptor
        let positions = GlobalFunc.process_Descriptor(descr, wdtVert)
        let positionsZ = GlobalFunc.process_Descriptor(descrZ, partSelf._dimz)

        // create the drawing (for each descriptor position and positionZ)
        positions.forEach(position => {
          positionsZ.forEach(positionZ => {

            // for each corner
            ConnectionPoints.forEach(([x, y, situation]) => {

              let posX = situation == "left" ? x + position : x - position;
              let drilling01 = partSelf.add3DElement('Drilling01', DrillHor, posX, y, positionZ, drillDia, drillDptFull, drillDia);
              drilling01.extrude('<svg><circle cx="' + 0 + '" cy="' + 0 + '" r="' + drillDia / 2 + '" /></svg>', 'y');
            });
          });
        });
      });
    });
  }

  //###############################################################################################################
  // Frame Type Mitre
  //###############################################################################################################

  else if (partSelf.pa_PanelWoodFrameType == 'Mitre') {

    let ProcItem = GlobalFunc.find_ProcessingMapping(Object.ProcessingItem!);
    ProcItem.forEach(Processing => {
      let DrillData = GlobalFunc.find_HardwareDrillHorLibrary(Processing.ProcessingId!, "FramePart");
      DrillData.forEach(Drill => {

        // Variables
        let wdtVert = partSelf.pa_FramePartsWidthVert;
        let wdtHor = partSelf.pa_FramePartsWidthHor;
        let drillDptFull = Drill.TI;
        let drillDpt = drillDptFull / 2;
        let drillDia = Drill.DU;
        let descr = PartConnection.LengthDescriptor!;
        let descrZ = PartConnection.WidthDescriptor!;

        // Connection points for each corner
        let ConnectionPoints: [number, number, string, string, number][] = [
          [wdtHor, wdtHor, "left", "bottom", 225],
          [partSelf._dimx - wdtHor, wdtHor, "right", "bottom", 135],
          [partSelf._dimx - wdtHor, partSelf._dimy - wdtHor, "right", "top", 45],
          [wdtHor, partSelf._dimy - wdtHor, "left", "top", 315],
        ]

        // process the descriptor
        let positions = GlobalFunc.process_Descriptor(descr, wdtVert)
        let positionsZ = GlobalFunc.process_Descriptor(descrZ, partSelf._dimz)

        // create the drawing (for each descriptor position and positionZ)
        positions.forEach(position => {
          positionsZ.forEach(positionZ => {

            // for each corner
            ConnectionPoints.forEach(([x, y, situation, situation2, angle]) => {

              let distance = drillDpt / Math.sqrt(2);
              let posX = situation == "left" ? x - position - distance : x + position + distance;
              let posY = situation2 == "top" ? y + position - distance : y - position + distance;

              let drilling01 = partSelf.add3DElement('Drilling01', DrillHor, posX, posY, positionZ, drillDia, drillDptFull, drillDia);
              drilling01.extrude('<svg><circle cx="' + 0 + '" cy="' + 0 + '" r="' + drillDia / 2 + '" /></svg>', 'y');
              let partMatrix = PartHelper.rotateZ(drilling01, angle, new Vector3(0, 0, 0));
              drilling01.setMatrix(partMatrix);
            });
          });
        });
      });
    });
  }
}