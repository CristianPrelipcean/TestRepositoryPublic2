

  // Header is missing!!!
  //=======================================================================
 
  const baseboardThickness = this.mod_BaseboardThk;
  const baseboardWidth = this.mod_BaseboardLength;
  const baseboardDepth = this.mod_BaseboardDepth;
  const part_Baseboard = this.addpart_Baseboard(0, -baseboardThickness, 0, baseboardWidth, baseboardThickness, baseboardDepth);

    
  GlobalFunc.process_AddMaterial(part_Baseboard, 'shelf', this.mod_BaseboardColor, this.mod_BaseboardColor, this.mod_BaseboardEdgeColor, this.mod_BaseboardEdgeFrontColor, 'None', false, true);
