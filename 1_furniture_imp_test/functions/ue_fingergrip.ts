ue_Fingergrip (parentModule: any, posLength: number = 0){

  //==========================================================================================================
  //          Manage POS Data
  //==========================================================================================================
	
	parentModule._posData.set('depth', parentModule.mod_FingergripType_matrix.LShapeDepth);
	parentModule._posData.set('width', posLength);
	parentModule._posData.set('height', parentModule.mod_FingergripType_matrix.LShapeHeight);
	parentModule._posData.set('color', parentModule.mod_FingergripColor);

}