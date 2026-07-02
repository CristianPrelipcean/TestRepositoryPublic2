ops_BackwallGroove(elem: any, partSelf: any, part2: any, posRel: any, ProcessingId: string, PartSelfOrientation: string) {

  try {

    // Create variables
    let overcut: number = partSelf._g.basic_GrooveThroughOversizeSecurityDistance; // Over dimension on each side of the groove, in case of through groove
    let part2Position: string = '';
    let partSelfLength: number = 0;
    //====================================================================
    // Calculate part2Position
    //====================================================================
    if (PartSelfOrientation == 'Vertical') {
      partSelfLength = partSelf._dimy;
      if (posRel.x > 0) {
        part2Position = 'Right'
      }
      else if (posRel.x < 0) {
        part2Position = 'Left'
      }
      else {
        throw new Error('ops_BackwallGroove: Cannot identify the side of the collision. Groove could not be generated');
      }
    }
    else if (PartSelfOrientation == 'Horizontal') {
      partSelfLength = partSelf._dimx;
      if (posRel.y > 0) {
        part2Position = 'Top'
      }
      else if (posRel.y < 0) {
        part2Position = 'Btm'
      }
      else {
        throw new Error('ops_BackwallGroove: Cannot identify the side of the collision. Groove could not be generated');
      }
    }
    else { 
      throw new Error('ops_BackwallGroove: Cannot identify the orienttaion of the part. Groove could not be generated');
    }

    //====================================================================
    // Get GrooveData
    //====================================================================
    let groovesData = GlobalFunc.find_SawingVertLibrary(ProcessingId, part2Position);


    groovesData.forEach(grooveData => {
      let grooveElement = elem.addncout_Groove()
      grooveElement.nc_TOOL = "109";
      grooveElement.nc_Side = grooveData.Side;
      grooveElement.nc_XA = grooveData.XA(partSelf, part2, posRel) < 0 ? 0 - overcut : grooveData.XA(partSelf, part2, posRel); // StartPosX
      grooveElement.nc_YA = grooveData.YA(partSelf, part2, posRel); // StartPosY
      grooveElement.nc_XE = grooveData.XE(partSelf, part2, posRel) > partSelfLength ? partSelfLength + overcut : grooveData.XE(partSelf, part2, posRel); // EndPosX
      grooveElement.nc_YE = grooveData.YE(partSelf, part2, posRel); // EndPosY
      grooveElement.nc_TI = grooveData.TI(partSelf, part2, posRel); // Depth
      grooveElement.nc_NB = grooveData.NB(partSelf, part2, posRel); // Width
      grooveElement.nc_RK = grooveData.RK;
      grooveElement.nc_EM = grooveData.EM;
      grooveElement.nc_KO = grooveData.matrix_KO || "00";
    })
  }

  catch (error: any) {

  } 











}


