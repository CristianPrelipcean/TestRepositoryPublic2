
	const activate = true;

	// const partList = GlobalFunc.find_HoddAssemblyParts(hoodInformation.ConstructionId);
	// Function um die Bauräume zu ermitteln
	// Dann lesen wir die FachbodenKonstruktion aus mod_HoodInformation
	// Offene Fragen:
	// Wie kommen wir auf die Gitterböden -> Abmessungen sind fix / Aufteilung? / BeschlagsId? / Verbauen über die Beschlagslogik
	// Wie machen wir das mit den Fachböden? Da fehlen gerade Attribute für die Konfiguration -> Auch über HoodInformation setzen?


	if (!this.mod_HoodInformation && this.mod_HoodInformation == "") {
		return;
	}
	const hoodInformation = JSON.parse(this.mod_HoodInformation);

 	// Installationinfo hood
  const hoodAssInfo = hoodInformation.HoodAssemblyInfo;

	
 	const hoodNicheInfo = hoodInformation.HoodNicheConstruction;
  if(!hoodNicheInfo || hoodNicheInfo.length === 0){
   // return;
	}

	//Find all Parts for the current construction
  const partList = GlobalFunc.find_HoddAssemblyParts(hoodInformation.ConstructionId);

  if(!partList || partList.length === 0){
    return;
	}

	let hoodRearOffset = hoodInformation.RearOffset;
	let shelfadjDrillType = hoodInformation.AdjShelfDrillType;

	let freeSpaceDepth = 0;
	let freeSpaceWidth = 0;
	let freeSpaceWidth2 = 0;
	let freeSpaceHeight = 0;
	let backOffset = 0;
	let bottomOffset  = 0;
	let positionShelf2 = 0;

	// Parts for Calculation
	const relBtlBottom 	= partList.find(part => part.PartID === "part_Shelfbtm");
  const relBtlTop 		= partList.find(part => part.PartID === "part_Shelftop");
	const relBtlDepth 	= partList.find(part => part.PartID === "part_HoodBackwall");
	// optional Construction....
	// To Null
 	const relBtlSideLeft = partList.find(part => part.PartID === "part_Sidepanelleft");
 	const relBtlSideRight = partList.find(part => part.PartID === "part_Sidepanelright");

	if (hoodInformation.ConstructionId == "HoodCarcase01") {
		
	}

	if (!relBtlBottom || !relBtlTop || !relBtlDepth) {
      logWarning("Required parts 'part_Shelfbtm' or 'part_Shelftop' or 'part_HoodBackwall' not found in partList.");
	}
	else if (hoodInformation.ConstructionId == "HoodCarcase01" && (!relBtlSideLeft || !relBtlSideRight)) {
      logWarning("Required parts 'part_Sidepanelleft' or 'part_Sidepanelright' for HoodCarcase01 not found in partList.");
	}
	else {
		bottomOffset 		= relBtlBottom.PositionHeight(this, hoodAssInfo, hoodNicheInfo) + relBtlBottom.Height(this, hoodAssInfo, hoodNicheInfo);
		let distHeight 	= relBtlTop.PositionHeight(this, hoodAssInfo,hoodNicheInfo) - relBtlBottom.PositionHeight(this, hoodAssInfo,hoodNicheInfo) + relBtlBottom.Height(this, hoodAssInfo,hoodNicheInfo) ;
		let distDepth 	= this.mod_CarcaseDepth -   (relBtlDepth.PositionDepth(this, hoodAssInfo,hoodNicheInfo,hoodRearOffset)+ relBtlDepth.Depth(this, hoodAssInfo,hoodNicheInfo,hoodRearOffset));
		let distWidth 	= this.mod_CarcaseWidth;
		let distWidth2 	= 0;


		if (hoodInformation.ConstructionId == "HoodCarcase01"
				&& relBtlSideRight ) {
			distWidth = relBtlSideRight.PositionWidth(this, hoodAssInfo,hoodNicheInfo) ;
		}
 		if (hoodInformation.ConstructionId == "HoodCarcase01"
			  	&& relBtlSideLeft ) {
			  distWidth2 =  this.mod_CarcaseWidth - (relBtlSideLeft.PositionWidth(this, hoodAssInfo,hoodNicheInfo) + relBtlSideLeft.Width(this, hoodAssInfo,hoodNicheInfo));
        positionShelf2 = relBtlSideLeft.PositionWidth(this, hoodAssInfo,hoodNicheInfo) + relBtlSideLeft.Width(this, hoodAssInfo,hoodNicheInfo);
		}
		freeSpaceDepth = distDepth;
		freeSpaceWidth = distWidth;
		freeSpaceWidth2 = distWidth2;
		freeSpaceHeight = distHeight;

		backOffset = this.mod_CarcaseDepth - freeSpaceDepth;

		//logInfo("*Construction: " + hoodInformation.ConstructionId + " freeSpaceDepth:" +  freeSpaceDepth  + " freeSpaceWidth: " + freeSpaceWidth + " freeSpaceHeight: " + freeSpaceHeight + " backOffset: " + backOffset);
		//logInfo("* freeSpaceWidth2: " + freeSpaceWidth2 + " positionShelf2:" +  positionShelf2 );
	}
	//=============================================================
	// 
	let CarcaseSpaceDimension: any = {
        FullWidthFreeSpace: freeSpaceWidth,
        FullHeightFreeSpace: freeSpaceHeight,
        FullDepthFreeSpace: freeSpaceDepth,
        FullWidthStartPos: 0,
        FullHeightStartPos: bottomOffset,
        FullDepthStartPos: backOffset,
        WidthFreeSpace: freeSpaceWidth,
        HeightFreeSpace:freeSpaceHeight,
        DepthFreeSpace: freeSpaceDepth,
        WidthFreeStartPos: 0,
        HeightFreeStartPos: bottomOffset,
        DepthFreeStartPos: backOffset
      };
      let strJson = JSON.stringify(CarcaseSpaceDimension);
			this.mod_CarcaseSpaceDimension.push(strJson)
	//=============================================================

	if (activate) {
		// Add the module
		const shelfadjgroup = this.addOD_M_mc_ShelfadjGroup01();

		// Set the attributes to the child 
		shelfadjgroup.mod_Width = freeSpaceWidth;
		shelfadjgroup.mod_Depth = freeSpaceDepth;  // this.mod_CarcaseDepth;
		shelfadjgroup.mod_Height = freeSpaceHeight;  //this.mod_CarcaseHeight;
		shelfadjgroup.mod_ShelfadjPartParentName = "Door";
		shelfadjgroup.mod_ShelfadjPartParentType = "Hood";
		//shelfadjgroup.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);
		shelfadjgroup.mod_CarcaseSpaceDimension.push(strJson);
		shelfadjgroup.mod_VertDividerType = "NoVertdivider";
		shelfadjgroup.mod_VertDividerPosition = 0;

		shelfadjgroup.mod_ShelfadjDesign = this.mod_HoodShelfadjDesign;  //'Wood';
		shelfadjgroup.mod_ShelfadjDescriptor = '';
		shelfadjgroup.mod_ShelfadjOffsetFront = 5;
		shelfadjgroup.mod_ShelfadjOffsetBack = 0;
		//shelfadjgroup.mod_ShelfadjDrillType = "Group3Drills";
		shelfadjgroup.mod_ShelfadjDrillType = shelfadjDrillType;
		shelfadjgroup.mod_ShelfadjDrillDistance = 0;
		shelfadjgroup.mod_ShelfadjOffsetBack = 0;

		// SetOrigin of the child
		shelfadjgroup.setOrigin(0, bottomOffset, backOffset)
	}	
	if (activate && freeSpaceWidth2 >0 )  {
		// Add the module
		CarcaseSpaceDimension.WidthFreeStartPos = positionShelf2;
		CarcaseSpaceDimension.freeSpaceWidth = freeSpaceWidth2;
		let strJson = JSON.stringify(CarcaseSpaceDimension);
		const shelfadjgroup = this.addOD_M_mc_ShelfadjGroup01();

		// Set the attributes to the child 
		shelfadjgroup.mod_Width = freeSpaceWidth2;
		shelfadjgroup.mod_Depth = freeSpaceDepth;  // this.mod_CarcaseDepth;
		shelfadjgroup.mod_Height = freeSpaceHeight;  //this.mod_CarcaseHeight;
		shelfadjgroup.mod_ShelfadjPartParentName = "Door";
		shelfadjgroup.mod_ShelfadjPartParentType = "Hood";
		//shelfadjgroup.mod_CarcaseSpaceDimension.push(this.mod_CarcaseSpaceDimension[0]);
		shelfadjgroup.mod_CarcaseSpaceDimension.push(strJson);
		shelfadjgroup.mod_VertDividerType = "NoVertdivider";
		shelfadjgroup.mod_VertDividerPosition = 0;

		shelfadjgroup.mod_ShelfadjDesign = this.mod_HoodShelfadjDesign; // 'Wood';
		shelfadjgroup.mod_ShelfadjDescriptor = '';
		shelfadjgroup.mod_ShelfadjOffsetFront = 5;
		shelfadjgroup.mod_ShelfadjOffsetBack = 0;
		//shelfadjgroup.mod_ShelfadjDrillType = "Group3Drills";
		shelfadjgroup.mod_ShelfadjDrillType = shelfadjDrillType;	
		shelfadjgroup.mod_ShelfadjDrillDistance = 0;
		shelfadjgroup.mod_ShelfadjOffsetBack = 0;

		// SetOrigin of the child
		shelfadjgroup.setOrigin(positionShelf2, bottomOffset, backOffset)
	}	


      