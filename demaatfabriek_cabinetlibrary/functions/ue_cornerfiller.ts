ue_CornerFiller (parentModule: any){

  //==========================================================================================================
  //          Manage POS Data
  //==========================================================================================================

  parentModule._posData.set('depth', parentModule.mod_TotalDimLeft);
  parentModule._posData.set('width', parentModule.mod_TotalDimRight);
  parentModule._posData.set('height', parentModule.mod_Height);
  parentModule._posData.set('color', parentModule.mod_FrontColor);

  //==========================================================================================================
  //          Manage the insertion level
  //==========================================================================================================

  /*
  if (parentModule.mod_HeightPosInsertion > 0) {
    let InsertionHeight = parentModule.mod_HeightPosInsertion + parentModule.mod_PlinthAreaHeight;
    parentModule.addInsertLevelHeight(InsertionHeight, true);
    parentModule.insertLevelFixed = false;
  }
  else {
    parentModule.addInsertLevelHeight(0, true);
    parentModule.insertLevelFixed = true;
  }
  */

}