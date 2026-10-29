ue_Upright (parentModule: any) {

  //==========================================================================================================
  // manage POS Data
  //==========================================================================================================

  parentModule._posData.set('depth', parentModule.mod_UprightDepth);
  parentModule._posData.set('width', parentModule.mod_UprightThk);
  parentModule._posData.set('height', parentModule.mod_UprightHeight);

	//==========================================================================================================
	//          Manage the insertion level
	//==========================================================================================================

  if (parentModule.mod_HeightPosInsertion > 0) {
    let InsertionHeight = parentModule.mod_HeightPosInsertion + parentModule.mod_PlinthAreaHeight;
    parentModule.addInsertLevelHeight(InsertionHeight, true);
    parentModule.insertLevelFixed = false;
	}
	else {
		parentModule.addInsertLevelHeight(0, true);
    parentModule.insertLevelFixed = true;
	}

}