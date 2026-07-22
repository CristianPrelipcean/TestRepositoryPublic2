
	// Homag Digital
	// Create: May 2026
	// By Reto Schuler
	// Purpose: CabinetLibrary
	//
	// Description:
	// CreateBuildPlan of mc_HoodCarcaseParts01
	// Add the carcase parts for the hood
	//
  //===================================================

  // Read the table
	const partList = ct_tab_HoodAssemblyParts.filter(p=> p.in_CarcaseConstructionID === "ID1");
	//const partList = GlobalFunc.find_HoddAssemblyParts("ID1");
	//===================================================
	// Add the carcase parts for the hood
	//===================================================

	partList.forEach(part => {
		const partData = part;
		if (partData.PartID === "part_HoodShelftop") {
			const shelfTop = this.addpart_HoodShelftop(partData.PositionWidth(this), partData.PositionHeight(this), partData.PositionDepth(this), partData.Width(this), partData.Height(this), partData.Depth(this));
		}
		if (partData.PartID === "part_HoodBackwall") {
			const hoodbackw = this.addpart_HoodBackwall(partData.PositionWidth(this), partData.PositionHeight(this), partData.PositionDepth(this), partData.Width(this), partData.Height(this), partData.Depth(this));
		}
	});



	/*
		const hoodRail = this.addpart_HoodRail(0, 0, 0, this.mod_CarcaseWidth, 100, 19);
		//const hoodMiddleSide1 = this.addpart_HoodMiddleSide(0, 0, 0, 19, this.mod_CarcaseHeight, this.mod_CarcaseDepth);
		const hoodbtm = this.addpart_Hoodbtm(0, 0, 50, this.mod_CarcaseWidth, 19,225);
		const hoodBackwall = this.addpart_HoodBackwall(0, 0, 0, this.mod_CarcaseWidth, 300,8);
	const hoodTop = this.addpart_HoodShelftop(0,0,0,this.mod_CarcaseWidth, 19,225)
	*/

	