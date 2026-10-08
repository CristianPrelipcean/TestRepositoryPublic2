ue_Countertop (parentModule: any, posDepth: number = 0, posLength: number = 0){

  //==========================================================================================================
  //          Manage POS Data
  //==========================================================================================================
  
  if (posDepth) {
    parentModule._posData.set('depth', posDepth);
  }
  parentModule._posData.set('width', posLength);
  parentModule._posData.set('height', parentModule.mod_CountertopThk);
  parentModule._posData.set('color', parentModule.mod_CountertopColor);
  parentModule._posData.set('doorDirection', parentModule.mod_CountertopConnectionSequence);

}