ops_PushtoopenDrill(Part: string, elem: any, partSelf: any, part2: any, posRel: any) {


  try {
    //====================================================================
    // Variables Initialization and common processes
    //====================================================================
    let drills: any[] = [];
    //---------------Get all the processings for the ProcessingId-----------------
    let processings = GlobalFunc.find_ProcessingMapping(part2.pa_ProcessingId);

    //---------------Use the GraphicInsertionHelper function to get the correct position-----------------
    let insertPoint = GlobalFunc.process_GraphicInsertionHelper('112', part2.pa_Model3DGroupName, part2._dimx, part2._dimy, part2._dimz)


    //====================================================================
    // Drills for the Front
    //====================================================================

    if (Part == 'Front') {

      //---------------For each processing-----------------
      processings.forEach((processing) => {

        //---------------If it's a vertical drill-----------------
        if (processing.ProcessingLibrary == 'DrillVertical') {

          //---------------Get all the drills from the HardwareDrillVertLibrary-----------------
          drills = GlobalFunc.find_HardwareDrillVertLibrary(processing.ProcessingId!, Part);

          //---------------For each drilling (insert the drillings)-----------------
          drills.forEach((drill) => {

            //Adjust position of drill based on rotation
            let drawingDrillPosx: number = 0;
            let drawingDrillPosy: number = 0;
            const configMap = new Map([
              [0, {
                drawingDrillPosx: posRel.x - insertPoint.InsertionPointX - drill.XA,
                drawingDrillPosy: posRel.y - insertPoint.InsertionPointY - drill.YA
              }],
              [90, {
                drawingDrillPosx: posRel.x - insertPoint.InsertionPointX - drill.XA,
                drawingDrillPosy: posRel.y - insertPoint.InsertionPointY - drill.YA
              }],
              [180, {
                drawingDrillPosx: posRel.x - insertPoint.InsertionPointX - drill.XA,
                drawingDrillPosy: posRel.y - insertPoint.InsertionPointY - drill.YA
              }],
              [270, {
                drawingDrillPosx: posRel.x - insertPoint.InsertionPointX - drill.XA,
                drawingDrillPosy: posRel.y - insertPoint.InsertionPointY - drill.YA
              }]
            ]);
            const config = configMap.get(part2.pa_Rotation ?? 0);
            if (config) {
              drawingDrillPosx = config.drawingDrillPosx;
              drawingDrillPosy = config.drawingDrillPosy;

            }
            else {
              //logError(GlobalFunc.find_ErrorList('Error 22006', 1).Message('Position not found!'));
              throw new Error('Position not found!');
            }

            // Add Vertical Drill
            let DrillVert = elem.addncout_DrillVert();
            DrillVert.nc_TOOL = "102";
            DrillVert.nc_XA = drawingDrillPosx;
            DrillVert.nc_YA = partSelf._dimy - drawingDrillPosy;
            DrillVert.nc_TI = drill.TI;
            DrillVert.nc_DU = drill.DU;

            DrillVert.nc_BM = drill.matrix_BM || "LS"
            DrillVert.nc_WI = drill.matrix_WI ?? 0;
            DrillVert.nc_AB = drill.matrix_AB ?? 1;
            DrillVert.nc_LA = drill.matrix_LA ?? 0;
            DrillVert.nc_MI = drill.matrix_MI ?? 0;
            DrillVert.nc_KO = drill.matrix_KO || "00";
            DrillVert.nc_Side = "Top";

            // Add drawing
            let drilling01 = partSelf.add3DElement('Drilling01', DrillVert, drawingDrillPosx, drawingDrillPosy, 0, drill.DU, drill.DU, drill.TI);
            drilling01.extrude('<svg><circle cx="' + 0 + '" cy="' + 0 + '" r="' + drill.DU / 2 + '" /></svg>', 'z');
          });
        }
      });
    }

    //====================================================================
    // Drills for the SidePanelLeft, SidePanelRight, ShelfTop, ShelfBtm (All are referenced as Carcase in the table)
    //====================================================================

    else if (Part == 'Carcase') {

      //---------------For each processing-----------------
      processings.forEach((processing) => {

        //---------------If it's an horizontal drill-----------------
        if (processing.ProcessingLibrary == 'DrillHorizontal') {

          //---------------Get all the drills from the HardwareDrillHorLibrary-----------------
          drills = GlobalFunc.find_HardwareDrillHorLibrary(processing.ProcessingId!, Part);

          //---------------For each drilling (insert the drillings)-----------------
          drills.forEach((drill) => {

            //Adjust position of drill based on rotation
            let drawingDrillPosx: number = 0;
            let drawingDrillPosy: number = 0;
            let nc_XA: number = 0;
            let nc_YA: number = 0;
            let nc_ZA: number = 0;
            let nc_BM: string = '';
            const configMap = new Map([
              [0, {
                drawingDrillPosx: posRel.x - insertPoint.InsertionPointX - drill.XA,
                drawingDrillPosy: posRel.y - insertPoint.InsertionPointY - drill.YA,
                nc_XA: posRel.x - insertPoint.InsertionPointX - drill.XA,
                nc_YA: 0,
                nc_ZA: posRel.y - insertPoint.InsertionPointY - drill.YA,
                nc_BM: 'YP'
              }],
              [90, {
                drawingDrillPosx: posRel.x - insertPoint.InsertionPointX - drill.XA,
                drawingDrillPosy: posRel.y - insertPoint.InsertionPointY - drill.YA,
                nc_XA: part2._dimy + posRel.y + insertPoint.InsertionPointY + drill.YA,
                nc_YA: 0,
                nc_ZA: partSelf._dimx - (posRel.x - insertPoint.InsertionPointX - drill.XA),
                nc_BM: 'YP'
              }],
              [180, {
                drawingDrillPosx: posRel.x - insertPoint.InsertionPointX - drill.XA,
                drawingDrillPosy: posRel.y - insertPoint.InsertionPointY - drill.YA,
                nc_XA: posRel.x - insertPoint.InsertionPointX - drill.XA,
                nc_YA: partSelf._dimz,
                nc_ZA: partSelf._dimy - (posRel.y - insertPoint.InsertionPointY - drill.YA),
                nc_BM: 'YM'
              }],
              [270, {
                drawingDrillPosx: posRel.x - insertPoint.InsertionPointX - drill.XA,
                drawingDrillPosy: posRel.y - insertPoint.InsertionPointY - drill.YA,
                nc_XA: partSelf._dimy - part2._dimy - posRel.y - insertPoint.InsertionPointY - drill.YA,
                nc_YA: 0,
                nc_ZA: posRel.x - insertPoint.InsertionPointX - drill.XA,
                nc_BM: 'YP'
              }]
            ]);
            const config = configMap.get(part2.pa_Rotation ?? 0);
            if (config) {
              drawingDrillPosx = config.drawingDrillPosx;
              drawingDrillPosy = config.drawingDrillPosy;
              nc_XA = config.nc_XA;
              nc_YA = config.nc_YA;
              nc_ZA = config.nc_ZA;
              nc_BM = config.nc_BM;
            }
            else {
              //logError(GlobalFunc.find_ErrorList('Error 22006', 1).Message('Position not found!'));
              throw new Error('Position not found!');
            }


            // Add Vertical Drill
            let DrillHor = elem.addncout_DrillHor();
            DrillHor.nc_TOOL = "103";
            DrillHor.nc_XA = nc_XA;
            DrillHor.nc_YA = nc_YA;
            DrillHor.nc_ZA = nc_ZA;
            DrillHor.nc_BM = nc_BM;
            DrillHor.nc_TI = drill.TI;
            DrillHor.nc_DU = drill.DU;
            DrillHor.nc_KO = drill.matrix_KO || "00"

            // Add drawing
            let drilling01 = partSelf.add3DElement('Drilling01', DrillHor, drawingDrillPosx, drawingDrillPosy, posRel.z - drill.TI, drill.DU, drill.DU, drill.TI);
            drilling01.extrude('<svg><circle cx="' + 0 + '" cy="' + 0 + '" r="' + drill.DU / 2 + '" /></svg>', 'z');
          });
        }


        //---------------If it's a vertical drill-----------------
        if (processing.ProcessingLibrary == 'DrillVertical') {

          //---------------Get all the drills from the HardwareDrillVertLibrary-----------------
          drills = GlobalFunc.find_HardwareDrillVertLibrary(processing.ProcessingId!, Part);

          //---------------For each drilling (insert the drillings)-----------------
          drills.forEach((drill) => {

            //Adjust position of drill based on rotation
            let drawingDrillPosx: number = 0;
            let drawingDrillPosy: number = 0;
            let drawingDrillPosz: number = 0;
            let drawingDrillDirection: string = '';
            let drawingDrillDimx: number = 0;
            let drawingDrillDimy: number = 0;
            let drawingDrillDimz: number = 0;
            let nc_XA: number = 0;
            let nc_YA: number = 0;
            const configMap = new Map([
              ["FromTop", {
                drawingDrillPosx: posRel.x - insertPoint.InsertionPointX - drill.XA,
                drawingDrillPosy: partSelf._dimy - drill.TI,
                drawingDrillPosz: partSelf._dimz - drill.YA,
                drawingDrillDirection: 'y',
                drawingDrillDimx: drill.DU,
                drawingDrillDimy: drill.TI,
                drawingDrillDimz: drill.DU,
                nc_XA: posRel.x - insertPoint.InsertionPointX - drill.XA,
                nc_YA: drill.YA
              }],
              ["FromBottom", {
                drawingDrillPosx: posRel.x - insertPoint.InsertionPointX - drill.XA,
                drawingDrillPosy: 0,
                drawingDrillPosz: partSelf._dimz - drill.YA,
                drawingDrillDirection: 'y',
                drawingDrillDimx: drill.DU,
                drawingDrillDimy: drill.TI,
                drawingDrillDimz: drill.DU,
                nc_XA: posRel.x - insertPoint.InsertionPointX - drill.XA,
                nc_YA: partSelf._dimz - drill.YA
              }],
              ["FromRight", {
                drawingDrillPosx: partSelf._dimx - drill.TI,
                drawingDrillPosy: posRel.y - insertPoint.InsertionPointY + drill.XA,
                drawingDrillPosz: partSelf._dimz - drill.YA,
                drawingDrillDirection: 'x',
                drawingDrillDimx: drill.TI,
                drawingDrillDimy: drill.DU,
                drawingDrillDimz: drill.DU,
                nc_XA: partSelf._dimy - (posRel.y - insertPoint.InsertionPointY + drill.XA),
                nc_YA: drill.YA
              }],
              ["FromLeft", {
                drawingDrillPosx: 0,
                drawingDrillPosy: posRel.y - insertPoint.InsertionPointY + drill.XA,
                drawingDrillPosz: partSelf._dimz - drill.YA,
                drawingDrillDirection: 'x',
                drawingDrillDimx: drill.TI,
                drawingDrillDimy: drill.DU,
                drawingDrillDimz: drill.DU,
                nc_XA: posRel.y - insertPoint.InsertionPointY + drill.XA,
                nc_YA: drill.YA
              }]
            ]);
            const config = configMap.get(elem._touchOrigin ?? '');
            if (config) {
              drawingDrillPosx = config.drawingDrillPosx;
              drawingDrillPosy = config.drawingDrillPosy;
              drawingDrillPosz = config.drawingDrillPosz;
              drawingDrillDirection = config.drawingDrillDirection;
              drawingDrillDimx = config.drawingDrillDimx;
              drawingDrillDimy = config.drawingDrillDimy;
              drawingDrillDimz = config.drawingDrillDimz;
              nc_XA = config.nc_XA;
              nc_YA = config.nc_YA;
            }
            else {
              //logError(GlobalFunc.find_ErrorList('Error 22006', 1).Message('Position not found!'));
              throw new Error('Position not found!');
            }

            if (part2.pa_Rotation == 0 && elem._touchOrigin == "FromTop" ||
              part2.pa_Rotation == 90 && elem._touchOrigin == "FromLeft" ||
              part2.pa_Rotation == 180 && elem._touchOrigin == "FromBottom" ||
              part2.pa_Rotation == 270 && elem._touchOrigin == "FromRight") {

              // Add Vertical Drill
              let DrillVert = elem.addncout_DrillVert();
              DrillVert.nc_TOOL = "102";
              DrillVert.nc_XA = nc_XA
              DrillVert.nc_YA = nc_YA;
              DrillVert.nc_TI = drill.TI;
              DrillVert.nc_DU = drill.DU;
              DrillVert.nc_BM = drill.matrix_BM || "LS"
              DrillVert.nc_WI = drill.matrix_WI ?? 0;
              DrillVert.nc_AB = drill.matrix_AB ?? 1;
              DrillVert.nc_LA = drill.matrix_LA ?? 0;
              DrillVert.nc_MI = drill.matrix_MI ?? 0;
              DrillVert.nc_KO = drill.matrix_KO || "00";
              DrillVert.nc_Side = "Top";

              // Add drawing
              let drilling01 = partSelf.add3DElement('Drilling01', DrillVert, drawingDrillPosx, drawingDrillPosy, drawingDrillPosz, drawingDrillDimx, drawingDrillDimy, drawingDrillDimz);
              drilling01.extrude('<svg><circle cx="' + 0 + '" cy="' + 0 + '" r="' + drill.DU / 2 + '" /></svg>', drawingDrillDirection);
            }
          });
        }

      });
    }
  }
  catch (error: any) {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 22006', 1);
    logError(ErrorMessage.Message(error.message));
    return;
  }
}