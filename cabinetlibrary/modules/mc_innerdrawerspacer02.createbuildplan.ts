  // Create: Sept 2026
  // By Lars Petersen
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_InnerDrawerSpacer02
  // Add the graphics for the inner drawer spacer
  // Add the BOM
  // Add the processings
  //
  // Revisions:
  //
  //===================================================================================

  //===================================================================================
  // Retrieve the data for the InnerDrawerSpacer
  //===================================================================================

  const idInfo = JSON.parse(this.mod_Information)

  if (idInfo) {
    //===================================================================================
    // Add the graphics for the clothing organizer
    //===================================================================================


    if (idInfo.spacer.Side === 'LeftRight') {
      let idGraphicLeft = this.addpart_InnerDrawerSpacer(idInfo.spacer.PosX[0], idInfo.spacer.PosY[0], idInfo.spacer.PosZ[0], idInfo.spacer.DimX[0], idInfo.spacer.DimY[0], idInfo.spacer.DimZ[0])
      idGraphicLeft.assign3DModel(idInfo.spacer.Model3D[0])
      GlobalFunc.process_AddMaterial(idGraphicLeft, 'hardware', "Black")

      let idGraphicRight = this.addpart_InnerDrawerSpacer(idInfo.spacer.PosX[1], idInfo.spacer.PosY[1], idInfo.spacer.PosZ[1],  idInfo.spacer.DimX[1], idInfo.spacer.DimY[1], idInfo.spacer.DimZ[1])
      idGraphicRight.assign3DModel(idInfo.spacer.Model3D[1])
      GlobalFunc.process_AddMaterial(idGraphicRight, 'hardware', "Black")
    } else {
      let idGraphic = this.addpart_InnerDrawerSpacer(idInfo.spacer.PosX, idInfo.spacer.PosY, idInfo.spacer.PosZ, idInfo.spacer.DimX, idInfo.spacer.DimY, idInfo.spacer.DimZ)
      idGraphic.assign3DModel(idInfo.spacer.Model3D)
      GlobalFunc.process_AddMaterial(idGraphic, 'hardware', "Black")
    }


  }

//}


//     //===================================================================================
//     // Add the BOM
//     //===================================================================================

//     if (coInfo.Hardware.BomId) {
//       let BomElem = this.addpart_ClothingOrganizerBOM(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
//       const bomId = this.mod_ClothingOrganizerId;
//       this.assignPartGroup(bomId, BomElem);

//       // Create an object to store the hardware id's
//       let hardwareElements: { values: string[] } = { values: [] };

//       // Add the HardwareId
//       hardwareElements.values.push(coInfo.Hardware.BomId);

//       // Convert the object to a json string
//       const jsonString: string = JSON.stringify(hardwareElements);

//       // Pass the list of HardwareId's to the part
//       BomElem.pa_HardwareId = jsonString;
//       BomElem.pa_ParentName = bomId;
//     }

//     //===================================================================================
//     // Add the processings
//     //===================================================================================

//     // Guard
//     if (coInfo?.Processing?.length) {

//       // Iterate over the array of processings
//       for (const processing of coInfo.Processing) {

//         // Processing on left side
//         if (processing.Side == 'Left') {
//           const procL = this.addpart_ClothingOrganizerDrilling(processing.RefPosX, processing.RefPosY, processing.RefPosZ, 100, 1, 1);
//           procL.pa_ProcessingId = processing.ProcessingId;
//         }

//         // Processing on right side
//         if (processing.Side == 'Right') {
//           const procR = this.addpart_ClothingOrganizerDrilling(processing.RefPosX - 100, processing.RefPosY, processing.RefPosZ, 100, 1, 1);
//           procR.pa_ProcessingId = processing.ProcessingId;
//         }
//       }
//     }
//   }
