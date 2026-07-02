ops_FingergripPocketVert  (elem: any, partSelf: any, part2: any, posRel: any, ProcessingId: string, Part: string) {

  try {

    //====================================================================
    // Calculate Fingergrip position
    //====================================================================
    
    //--------------- Initialize variables-----------------
	
    interface iFingergripInfo {
      Position?: number[];
      Height?: number[];
      Depth?: number[];
	  }
    let fingergripInfo: iFingergripInfo = JSON.parse(partSelf.pa_FingergripInfo);

    for (let i = 0; i <= fingergripInfo.Position!.length - 1; i++) {
      //====================================================================
      // Get data from table HardwareMillingLibrary for the ProcessingId and part
      //====================================================================

      let pocketsData = GlobalFunc.find_HardwareMilingLibrary(ProcessingId, Part);

      //====================================================================
      // Cycle through all the grooves (in case there's more than 1)
      //====================================================================

      pocketsData.forEach(pocket => {
        let pocketElement = elem.addncout_Pocket()
        pocketElement.nc_TOOL = "112";
        pocketElement.nc_Side = pocket.Side;
        pocketElement.nc_XA = pocket.XA(fingergripInfo.Position![i], partSelf, '', ''); // CenterPosX
        pocketElement.nc_YA = pocket.YA(0, partSelf, '', ''); // CenterPosY
        pocketElement.nc_LA = pocket.LA(fingergripInfo.Height![i], partSelf, '', ''); // Length
        pocketElement.nc_BR = pocket.BR(fingergripInfo.Depth![i], partSelf, '', ''); // Width
        pocketElement.nc_TI = pocket.TI(0, partSelf, '', ''); // Depth
        pocketElement.nc_RD = pocket.matrix_RD || 0;
        pocketElement.nc_KO = pocket.matrix_KO || "00";
        if (pocket.matrix_T_ != '') {
          pocketElement.nc_T_ = pocket.matrix_T_;
        }
        
      });
    }



  }

  catch (error: any) {

  } 

}


