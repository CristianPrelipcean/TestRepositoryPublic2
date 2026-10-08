ops_SawingAngle(ncElement: any, ProcessingId: string, StartPointX: number, StartPointY: number, EndPointX: number, EndPointY: number, Angle: number){
  
  let sawingsData = GlobalFunc.find_SawingAngleLibrary(ProcessingId);

  try { 

    sawingsData.forEach(sawingData => {
      let angleSaw = ncElement.addncout_SawingAngle()
      angleSaw.nc_TOOL = "124";
      angleSaw.nc_Side = "Top";
      angleSaw.nc_XA = sawingData.XA(StartPointX);
      angleSaw.nc_YA = sawingData.YA(StartPointY);
      angleSaw.nc_XE = sawingData.XE(EndPointX);
      angleSaw.nc_YE = sawingData.YE(EndPointY);
      angleSaw.nc_XY = sawingData.XY
      angleSaw.nc_WI = sawingData.WI(Angle);
      angleSaw.nc_EM = sawingData.EM;
      angleSaw.nc_Z_ = sawingData.Z_;
      angleSaw.nc_VZ = sawingData.VZ;
      angleSaw.nc_RK = sawingData.RK;
      angleSaw.nc_VT = sawingData.VT;
      angleSaw.nc_AB = sawingData.AB;
      angleSaw.nc_KO = sawingData.matrix_KO || "00";
      if (sawingData.matrix_NB) { angleSaw.nc_NB = sawingData.matrix_NB };
      if (sawingData.matrix_T_) { angleSaw.nc_NB = sawingData.matrix_T_ };
      
    })
  }
  catch (error: any) {
			
		} 
  
}