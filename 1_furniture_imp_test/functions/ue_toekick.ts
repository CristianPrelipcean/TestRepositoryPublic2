ue_Toekick (parentModule: any, posLength: number = 0, posHeight: number = 0){

  //==========================================================================================================
  //          Manage POS Data
  //==========================================================================================================
  
  parentModule._posData.set('depth', parentModule.mod_ToekickThk);
  parentModule._posData.set('width', posLength);
  if (posHeight) {
    parentModule._posData.set('height', posHeight ?? 0);
  }
  parentModule._posData.set('color', parentModule.mod_ToekickColor);

}