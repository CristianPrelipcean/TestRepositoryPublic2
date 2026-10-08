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
	const lineDefinition = parentModule.mod_WallHeightLines_matrix.LineDefinition;
	const linesFixed = parentModule.mod_WallHeightLines_matrix.LinesFixed;
	const baseLine = parentModule.mod_WallHeightLines_matrix.BaseLine;

	// Cabinet placed on the floor
	//-------------------------------------------------------------

	if (levels === "OnFloor") {
		parentModule.addInsertLevelHeight(0, true);
		parentModule.insertLevelFixed = true;
	}

	// Wall hanging cabinet
	//-------------------------------------------------------------

	else if (levels === "WallHanging") {

		const heightOffset = baseLine === "PlinthAreaHeight" ? parentModule.mod_PlinthAreaHeight : 0;
		const heightLevels = String(lineDefinition ?? "").split("_").map((value: string) => Number(value.trim())).filter((value: number) => Number.isFinite(value));

		heightLevels.forEach((height: number, index: number) => {
			const insertionHeight = height === 0 ? 0 : height + heightOffset; 
			parentModule.addInsertLevelHeight(insertionHeight, index === 1);
		});

		parentModule.insertLevelFixed = linesFixed;
	}
  
}