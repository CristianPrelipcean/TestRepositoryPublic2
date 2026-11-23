
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
	//================================================================================================
	//          Initialize (Create the map)
	//================================================================================================
	// Mapping for Part configurations with direct method references
  let partConfig = new Map([
    ['part_HoodShelftop',             { createPart: (posx:number,posy:number,posz:number,w:number,h:number,d:number) => this.addpart_HoodShelftop(posx, posy, posz, w,h,d) }],
//    ['part_HoodShelftop',           { createPart: () => this.addpart_HoodShelftop(0, 0, 0, this.mod_CarcaseWidth, this.mod_CarcaseHeight, this.mod_CarcaseDepth) }],
    ['part_HoodShelfbtm',		          { createPart: (posx:number,posy:number,posz:number, w:number,h:number,d:number) => this.addpart_HoodShelfbtm(posx, posy, posz, w,h,d) }],
    ['part_HoodBackwall',             { createPart: (posx:number,posy:number,posz:number,w:number,h:number,d:number) => this.addpart_HoodBackwall(posx, posy, posz, w,h,d) }],
    ['part_HoodRail',                 { createPart: (posx: number, posy: number, posz: number, w: number, h: number, d: number) => this.addpart_HoodRail(posx, posy, posz, w, h, d) }],
    ['part_HoodSidepanelleft',        { createPart: (posx: number, posy: number, posz: number, w: number, h: number, d: number) => this.addpart_HoodSidepanelleft(posx, posy, posz, w, h, d) }],
    ['part_HoodSidepanelright',       { createPart: (posx: number, posy: number, posz: number, w: number, h: number, d: number) => this.addpart_HoodSidepanelright(posx, posy, posz, w, h, d) }],
    ['part_HoodConstructionRail',     { createPart: (posx: number, posy: number, posz: number, w: number, h: number, d: number) => this.addpart_HoodConstructionRail(posx, posy, posz, w, h, d) }],
    ['part_HoodShelfadj',             { createPart: (posx: number, posy: number, posz: number, w: number, h: number, d: number) => this.addpart_HoodShelfadj(posx, posy, posz, w, h, d) }],
    ['part_HoodFrontPanelDemontable', { createPart: (posx: number, posy: number, posz: number, w: number, h: number, d: number) => this.addpart_HoodFrontPanelDemontable(posx, posy, posz, w, h, d) }],
//neu 01.10.2026 StdBtl
    ['part_Railhortopback',       { createPart: (posx: number, posy: number, posz: number, w: number, h: number, d: number) => this.addpart_Railhortopback(posx, posy, posz, w, h, d) }],
    ['part_Shelfbtm',             { createPart: (posx: number, posy: number, posz: number, w: number, h: number, d: number) => this.addpart_Shelfbtm(posx, posy, posz, w, h, d) }],
    ['part_Shelftop',             { createPart: (posx: number, posy: number, posz: number, w: number, h: number, d: number) => this.addpart_Shelftop(posx, posy, posz, w, h, d) }],
    ['part_Sidepanelmiddle',      { createPart: (posx: number, posy: number, posz: number, w: number, h: number, d: number) => this.addpart_Sidepanelmiddle(posx, posy, posz, w, h, d) }],
    ['part_Sidepanelright',       { createPart: (posx: number, posy: number, posz: number, w: number, h: number, d: number) => this.addpart_Sidepanelright(posx, posy, posz, w, h, d) }],
    ['part_Sidepanelleft',        { createPart: (posx: number, posy: number, posz: number, w: number, h: number, d: number) => this.addpart_Sidepanelleft(posx, posy, posz, w, h, d) }],
    ['part_Railverttopback',      { createPart: (posx: number, posy: number, posz: number, w: number, h: number, d: number) => this.addpart_Railverttopback(posx, posy, posz, w, h, d) }],
    ['part_Railverttopfront',     { createPart: (posx: number, posy: number, posz: number, w: number, h: number, d: number) => this.addpart_Railverttopfront(posx, posy, posz, w, h, d) }],
    ['part_Backwall',             { createPart: (posx: number, posy: number, posz: number, w: number, h: number, d: number) => this.addpart_Backwall(posx, posy, posz, w, h, d) }],
  ]);



	if (!this.mod_HoodInformation && this.mod_HoodInformation == "") {
		return;
	}
	const hoodInformation = JSON.parse(this.mod_HoodInformation);

	if (!hoodInformation.constructionId && hoodInformation.ConstructionId == "") {
		return;
	}
	let hoodRearOffset = hoodInformation.RearOffset;

	// Find all Parts for the current construction
  const partList = GlobalFunc.find_HoddAssemblyParts(hoodInformation.ConstructionId);

  if(!partList || partList.length === 0){
    return;
	}
 	// Installationinfo hood
  const hoodAssInfo = hoodInformation.HoodAssemblyInfo;

  const hoodNicheInfo = hoodInformation.HoodNicheConstruction;
  if(!hoodNicheInfo || hoodNicheInfo.length === 0){
   // return;
	}

  // Flags using standard Parts
  let useStandardShelfTop: Boolean = false;
  let useStandardShelfBot: Boolean = false;
  let useStandardBackwall: Boolean = false;
  const hoodCarcaseInfo = hoodInformation.HoodCarcaseAssemblyInfo;
  if(!hoodCarcaseInfo || hoodCarcaseInfo.length === 0){
    // return;
  }
  else {
    useStandardShelfTop = hoodCarcaseInfo.UseStandardCarcaseShelfTop;
    useStandardBackwall =  hoodCarcaseInfo.UseStandardCarcaseBackwall;
  }

  //===================================================
  // Carcase Original Depth
  //===================================================
  let carcaseDepthParent = this.parent.mod_CarcaseDepth ?? 0;
  let carcaseSpace = 0;
  let carcaseDepth = this.mod_CarcaseDepth ?? 0;

  //===================================================
	// Add the carcase parts for the hood
  //===================================================
  /*
  let t1Depth = hoodAssInfo.Tower1Depth;
  let t2Depth = hoodAssInfo.Tower2Depth;
  let h1 = hoodAssInfo.Tower1Height; 
  let cutOutDepthMin = hoodAssInfo.CutOutDepthMin;
  let hoodheight = hoodAssInfo.Height;
  let hoodDepth = hoodAssInfo.Depth;
  let hoodWidth = hoodAssInfo.Width;
  */
  
  if(hoodRearOffset ===0){
    //hoodRearOffset = this.mod_CarcaseDepth - hoodDepth;
     hoodRearOffset = carcaseDepthParent- carcaseDepth ;
  }

	partList.forEach(part => {
		const partData = part;

    let config = partConfig.get(partData.PartID ?? "");
    if(config){
      let {createPart} = config;
      try {
        let posHeight   = partData.PositionHeight(this, hoodAssInfo,hoodNicheInfo);
        let posDepth = partData.PositionDepth(this, hoodAssInfo, hoodNicheInfo, hoodRearOffset);
        let posWidth = partData.PositionWidth(this, hoodAssInfo, hoodNicheInfo);

        // tbd: Minimaler Abstand KpTeile zu Hood.
        // posDepth -= this.mod_HoodMinCarcaseSpaceHor;
        let partDepth  	= partData.Depth(this, hoodAssInfo,hoodNicheInfo,hoodRearOffset);
        let partHeight  = partData.Height(this,hoodAssInfo,hoodNicheInfo);
        let partWidth   = partData.Width(this, hoodAssInfo,hoodNicheInfo)


        //let element = createPart(partData.PositionWidth(this), partData.PositionHeight(this), partData.PositionDepth(this), partData.Width(this), partData.Height(this), partData.Depth(this));

        if ((useStandardShelfTop && (partData.PartID === "part_HoodShelftop" || partData.PartID === "part_Shelftop" || partData.PartID === "part_Railhortopback"))
              || (useStandardBackwall && (partData.PartID === "part_Backwall"))
        )
        {
          //nix tun
          //logInfo("nixtun");
          logWarning("Standard part " + partData.PartID+  "allready used by HoodAssemblyMapping configuration!");
        }
        else {
          let element = createPart(posWidth, posHeight, posDepth, partWidth, partHeight, partDepth);      
          
        }




      }
      catch (error:any) {
				// Log the error and stop execution if any function call fails
			// ToD Add new Error Message
      let ErrorMessage = GlobalFunc.find_ErrorList('Error 21004',1);
      logError(ErrorMessage.Message(error.message));
      return;
      }
    }
	});

