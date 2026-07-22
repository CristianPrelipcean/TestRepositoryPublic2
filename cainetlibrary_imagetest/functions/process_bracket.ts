process_Bracket(m: any) {

	let retBrackets: any={};


	let retPartSettings = GlobalFunc.find_BracketMapping(m.mod_ShelvesBrackets_matrix.Supplier, m.mod_ShelvesBrackets_matrix.SupItemCode);
	let ConstructionId = retPartSettings.ConstructionId;
	let GraphicId = retPartSettings.GraphicId;
	let retGraphSettings = GlobalFunc.find_GraphicLibrary(GraphicId!);

	retBrackets.model3D = retGraphSettings.Model3D;
	retBrackets.xDim = retGraphSettings.DimensionX;
	retBrackets.yDim = retGraphSettings.DimensionY;
	retBrackets.zDim = retGraphSettings.DimensionZ;
	retBrackets.xIns = retGraphSettings.InsertionPointX;
	retBrackets.yIns = retGraphSettings.InsertionPointY;
	retBrackets.zIns = retGraphSettings.InsertionPointZ;


	let retConstrSettings = GlobalFunc.find_BracketConstruction(ConstructionId!,m.mod_ShelvesThk,m.mod_Depth,m.mod_Width);
	//find_BracketConstruction(ConstructionId: string, ShelfThk : number, Shelfdepth: number, ShelfWidth: number)
	retBrackets.BrNo = retConstrSettings.BracketNo;
	retBrackets.Pos1 = retConstrSettings.Position1;
	retBrackets.Pos2 = retConstrSettings.Position2;
	retBrackets.Pos3 = retConstrSettings.Position3;
	retBrackets.Pos4 = retConstrSettings.Position4;
	retBrackets.Pos5 = retConstrSettings.Position5;
	retBrackets.Pos6 = retConstrSettings.Position6;

	let test = retConstrSettings.TestColumn(m);

	
	return retBrackets;	

}