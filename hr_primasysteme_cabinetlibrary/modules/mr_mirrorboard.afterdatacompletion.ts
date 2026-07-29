
	// Schuler Consulting
	// Create: Dec 2025
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of mr_CoatBoard
	// Add Construction Module and Docking Infos
	//
	// Revisions:
	//
	//===================================================

	//===================================================
	//          Add construction module
	//===================================================

	// Add the module
	const child = this.addOD_M_mc_MirrorBoard(0);

	// Set attributes of the child
	child.mod_MirrorBoardId = "Mirrorboard_01";

	// SetOrigin
	child.setOrigin(0, 0, 0)

	//===================================================
	//          Manage the child modules
	//===================================================

	this.m.forEach((p => {

		// BoardShelf
		if (p instanceof OD_M_mf_BoardShelf) {

			p.setOrigin(0, 0, this.mod_MirrorBoardThickness);
			p.mod_FrontId = "Mirrorboard_01";
		}

	}))

	//===================================================
	//          Create vector / docking
	//===================================================

	// Left side
	this.addDockingInfo(Dock.LeftBottom, new Vector3(0, 0, 0), new Vector3(0, 0, this.mod_MirrorBoardThickness));
	this.addDockingInfo(Dock.LeftTop, new Vector3(0, this.mod_Height, 0), new Vector3(0, this.mod_Height, this.mod_MirrorBoardThickness));

	// Right side
	this.addDockingInfo(Dock.RightBottom, new Vector3(this.mod_Width, 0, 0), new Vector3(this.mod_Width, 0, this.mod_MirrorBoardThickness));
	this.addDockingInfo(Dock.RightTop, new Vector3(this.mod_Width, this.mod_Height, 0), new Vector3(this.mod_Width, this.mod_Height, this.mod_MirrorBoardThickness));

	// Back side
	this.addDockingInfo(Dock.BackBottom, new Vector3(0, 0, 0), new Vector3(this.mod_Width, 0, 0));
	this.addDockingInfo(Dock.BackTop, new Vector3(0, this.mod_Height, 0), new Vector3(this.mod_Width, this.mod_Height, 0));

	//===================================================
	//          Manage the insertion level
	//===================================================

	if (this.mod_HeightPosInsertion > 0) {
		this.addInsertLevelHeight(this.mod_HeightPosInsertion, true);
		this.insertLevelFixed = false;
	}
	