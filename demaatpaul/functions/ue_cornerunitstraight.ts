ue_CornerunitStraight (parentModule: any){

	//===================================================
	// POS Data
	//===================================================
	
  parentModule._posData.set('depth', parentModule.mod_Depth);
  parentModule._posData.set('width', parentModule.mod_Width);
  parentModule._posData.set('height', parentModule.mod_Height);
  parentModule._posData.set('color', parentModule.mod_FrontColor);
  parentModule._posData.set('carcaseColor', parentModule.mod_CarcaseColor);
  parentModule._posData.set('doorDirection', parentModule.mod_DoorDirection);

	//===================================================
	//          Manage the insertion level
	//===================================================

	/*
	if (this.mod_HeightPosInsertion > 0) {
		let InsertionHeight = this.mod_HeightPosInsertion + this.mod_PlinthAreaHeight;
		this.addInsertLevelHeight(InsertionHeight, true);
		this.insertLevelFixed = false;
	}
	else {
		this.addInsertLevelHeight(0, true);
		this.insertLevelFixed = true;
	}
	*/
  
}