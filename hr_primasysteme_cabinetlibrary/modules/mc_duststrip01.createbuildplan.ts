	// Schuler Consulting
	// Create: Aug 2024
	// By Henning Wiesbrock
	// Purpose: CabinetLibrary
	//
	// Description:
	// CreateBuildPlan of mc_Duststrip01
	// Processing of the Duststrip
	//
	// Revisions:
	//
	//===================================================

	// Get the FreeSpace and StartPosition
		let CarcaseSpaceDimension = JSON.parse(this.mod_CarcaseSpaceDimension[0]);

	//====================================================================
	// Duststrip
	//====================================================================

	let DuststripType = GlobalFunc.find_DuststripMapping(this.mod_FrontProgram, this.mod_FrontColor, this.mod_FrontDesign)

	let DuststripObject = GlobalFunc.find_ObjectMapping(DuststripType.DuststripObject!)

	let DuststripModel3DGroup = GlobalFunc.find_GraphicLibraryMapping(DuststripObject.GraphicItem!)

	//---------------Find data from tab_GraphicLibrary--------------------

	let retGraphicLib: any;
	let i = 0;
	DuststripModel3DGroup.forEach((Item) => {
		retGraphicLib = GlobalFunc.find_GraphicLibrary(Item.Model3DGroupName!);
		i++;
		if (i > 1) {
			logError('There is more than 1 graphic item in the table tab_GraphicLibraryMapping for the plinth area! This was not expected!');
		}
	});

	// Calculations
	let PosX = -this.mod_FrontGapVert/2 + retGraphicLib.InsertionPointX;
	let PosY = this.g.basic_DuststripHeightReduction/2;
	let PosZ = retGraphicLib.InsertionPointZ;
	let Width = retGraphicLib.DimensionX;
	let Height = CarcaseSpaceDimension.HeightFreeSpace - this.g.basic_DuststripHeightReduction;
	let Depth = retGraphicLib.DimensionZ;

	// Add Part 
	let Duststrip = this.addpart_Duststrip(PosX, PosY, PosZ, Width, Height, Depth)
	this.assignPartGroup(this.mod_FrontId, Duststrip);
	this.assignOpenGroup(this.mod_FrontId,Duststrip);
	Duststrip.assign3DModel(retGraphicLib.Model3D);

	// Set attributes of the part
	Duststrip.pa_HardwareId = DuststripObject.HardwareItem!;

	//If it's a Right Door then rotate the drawing
	if (this.mod_VertDividerType == 'DustStripRight') {
		let partMatrix = PartHelper.rotateZ(Duststrip, 180, new Vector3(-retGraphicLib.InsertionPointX + this.mod_FrontGapVert/2, (CarcaseSpaceDimension.HeightFreeSpace - this.g.basic_DuststripHeightReduction)/2, 0));
		Duststrip.setMatrix(partMatrix);
	}

	//====================================================================
	// Duststrip Processing
	//====================================================================




