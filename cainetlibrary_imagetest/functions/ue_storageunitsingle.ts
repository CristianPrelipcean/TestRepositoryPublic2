ue_StorageunitSingle(parentModule: any){

	//==========================================================================================================
	// 					Manage POS Data
	//==========================================================================================================

	parentModule._posData.set('depth', parentModule.mod_Depth);
	parentModule._posData.set('width', parentModule.mod_Width);
	parentModule._posData.set('height', parentModule.mod_Height);
	parentModule._posData.set('color', parentModule.mod_FrontColor);
	parentModule._posData.set('carcaseColor', parentModule.mod_CarcaseColor);
	parentModule._posData.set('doorDirection', parentModule.mod_DoorDirection);

	//===================================================
	//          Manage the insertion level
	//===================================================

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