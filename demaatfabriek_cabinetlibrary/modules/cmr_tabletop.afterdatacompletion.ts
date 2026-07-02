 //===================================================
	//         Add the module mc_PanelTop and setOrigin
	//===================================================
	let panelTop = this.addOD_M_mc_Paneltop01();
	panelTop.setOrigin(0, 0, this.mod_Depth);

	//===================================================
	//         Assign Values to unused derived Attributes
	//===================================================
	panelTop.mod_CeilingFillerFittingPanelDepth = 150;
	panelTop.mod_CeilingFillerFittingPanelThk = 19;
	panelTop.mod_CeilingFillerHeight = 150;
	panelTop.mod_CeilingFillerRecess = 50;
	panelTop.mod_CeilingFillerThk = 19;
	panelTop.mod_PaneltopEdgeVisBack = true;
	panelTop.mod_PaneltopEdgeVisFront = true;
	panelTop.mod_PaneltopEdgeVisLeft = true;
	panelTop.mod_PaneltopEdgeVisRight = true;
	panelTop.mod_PaneltopOverhangFront = 0;
	panelTop.mod_PaneltopOversizeBack = 0
	
	
	//===================================================
	//         Assign Values to used Attributes
	//===================================================
	panelTop.mod_Depth = this.mod_Depth;
	panelTop.mod_ParentName = this.mod_ParentName;
	panelTop.mod_Width = this.mod_Width;


	//===================================================
	//          Create vector / docking for corner left
	//===================================================


	const TopEndCabinet = this.mod_PaneltopThk;

  // Left side
	this.addDockingInfo(Dock.LeftBottom, new Vector3(0, 0, 0), new Vector3(0, 0, this.mod_Depth));
	this.addDockingInfo(Dock.LeftTop, new Vector3(0, TopEndCabinet, 0), new Vector3(0, TopEndCabinet, this.mod_Depth));

	// Right side
	this.addDockingInfo(Dock.RightBottom, new Vector3(this.mod_Width, 0, 0), new Vector3(this.mod_Width, 0, this.mod_Depth));
	this.addDockingInfo(Dock.RightTop, new Vector3(this.mod_Width, TopEndCabinet, 0), new Vector3(this.mod_Width, TopEndCabinet, this.mod_Depth));

	// Back side
	this.addDockingInfo(Dock.BackBottom, new Vector3(0, 0, 0), new Vector3(this.mod_Width, 0, 0));
	this.addDockingInfo(Dock.BackTop, new Vector3(0, TopEndCabinet, 0), new Vector3(this.mod_Width, TopEndCabinet, 0));

	//===================================================
	//          Manage the insertion level
	//===================================================

	
	if (this.mod_HeightPosInsertion > 0) {
		let InsertionHeight = this.mod_HeightPosInsertion;
		this.addInsertLevelHeight(InsertionHeight, true);
		this.insertLevelFixed = this.cmod_ForceHeightPosition;
	}
	else {

	}





