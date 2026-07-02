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

	//==========================================================================================================
	//          Manage the insertion level
	//==========================================================================================================

	const levels = parentModule.mod_PlacementLevels;
	if (levels === 'OnFloor') {
		parentModule.addInsertLevelHeight(0, true);
		parentModule.insertLevelFixed = true;
	}
	else{
		const heightLevels = levels.split('_').map((x: string) => Number(x)).filter((x: number) => !isNaN(x));
		heightLevels.forEach((height: number, index: number) => {
			const insertionHeight = height + parentModule.mod_PlinthAreaHeight;
			parentModule.addInsertLevelHeight(insertionHeight, index === 0);
		});
		parentModule.insertLevelFixed = false;
	}
  
}