ops_SawingVert(ncElement: any, partSelf: any, part2: any, posRel: any, ProcessingId: string, Part2Position: string){
  
  let sawingsData = GlobalFunc.find_SawingVertLibrary(ProcessingId, Part2Position);

  try { 

    sawingsData.forEach(sawingData => {
      let sawingElement = ncElement.addncout_Groove()
      sawingElement.nc_TOOL = "109";
      sawingElement.nc_Side = sawingData.Side;
      sawingElement.nc_XA = sawingData.XA(partSelf, part2, posRel); // StartPosX
      sawingElement.nc_YA = sawingData.YA(partSelf, part2, posRel); // StartPosY
      sawingElement.nc_XE = sawingData.XE(partSelf, part2, posRel); // EndPosX
      sawingElement.nc_YE = sawingData.YE(partSelf, part2, posRel); // EndPosY
      sawingElement.nc_TI = sawingData.TI(partSelf, part2, posRel); // Depth
      sawingElement.nc_NB = sawingData.NB(partSelf, part2, posRel); // Width
      sawingElement.nc_RK = sawingData.RK;
      sawingElement.nc_EM = sawingData.EM;
      sawingElement.nc_KO = sawingData.matrix_KO || "00";
      
    })
  }
  catch (error: any) {
			
		} 
  
}