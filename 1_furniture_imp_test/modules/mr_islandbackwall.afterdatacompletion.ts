
	// Schuler Consulting
	// Create: May 2025
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// AfterDataCompletion of mr_IslandBackwall
	// Intermediate solution for an island backwall for presentation purpose
	//
	// Revisions:
	//
	//===================================================

	//===================================================
	//          Add construction module
  //===================================================

  // Add the module
  const child = this.addOD_M_mc_Panel01();

  // Set attributes of the child
  child.mod_Width = this.mod_IslandBackwallWidth + this.mod_IslandBackwallOverdimension * 2;
  child.mod_Height = this.mod_Height;
  child.mod_Depth = this.mod_Depth;
  child.mod_PanelId = "IslandBackwall_01";

	// SetOrigin
	child.setOrigin(-this.mod_IslandBackwallOverdimension, 0, 0)
	
	//===================================================
	//          Create vector / docking
	//===================================================

	// Left side
	this.addDockingInfo(Dock.LeftBottom, new Vector3(0, 0, 0), new Vector3(0, 0, this.mod_Depth - this.mod_IslandBackwallOverhangFront));
	this.addDockingInfo(Dock.LeftTop, new Vector3(0, this.mod_Height, 0), new Vector3(0, this.mod_Height, this.mod_Depth - this.mod_IslandBackwallOverhangFront));

	// Right side
	this.addDockingInfo(Dock.RightBottom, new Vector3(this.mod_IslandBackwallWidth, 0, 0), new Vector3(this.mod_IslandBackwallWidth, 0, this.mod_Depth - this.mod_IslandBackwallOverhangFront));
	this.addDockingInfo(Dock.RightTop, new Vector3(this.mod_IslandBackwallWidth, this.mod_Height, 0), new Vector3(this.mod_IslandBackwallWidth, this.mod_Height, this.mod_Depth - this.mod_IslandBackwallOverhangFront));

	// Back side
	this.addDockingInfo(Dock.BackBottom, new Vector3(0, 0, 0), new Vector3(this.mod_IslandBackwallWidth, 0, 0));
	this.addDockingInfo(Dock.BackTop, new Vector3(0, this.mod_Height, 0), new Vector3(this.mod_IslandBackwallWidth, this.mod_Height, 0));

	//===================================================
	//          Manage the insertion level
	//===================================================

	/*
	this.addInsertLevelHeight(0, true);
	this.insertLevelFixed = true;
	*/
  