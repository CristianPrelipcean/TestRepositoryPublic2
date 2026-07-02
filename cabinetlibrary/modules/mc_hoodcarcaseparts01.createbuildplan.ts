
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
    ['part_HoodShelftop',         {createPart: (posx:number,posy:number,posz:number,w:number,h:number,d:number) => this.addpart_HoodShelftop(posx, posy, posz, w,h,d) }],
//    ['part_HoodShelftop',         {createPart: () => this.addpart_HoodShelftop(0, 0, 0, this.mod_CarcaseWidth, this.mod_CarcaseHeight, this.mod_CarcaseDepth) }],
    ['part_HoodShelfbtm',		      {createPart: (posx:number,posy:number,posz:number, w:number,h:number,d:number) => this.addpart_HoodShelfbtm(posx, posy, posz, w,h,d) }],
    ['part_HoodBackwall',         {createPart: (posx:number,posy:number,posz:number,w:number,h:number,d:number) => this.addpart_HoodBackwall(posx, posy, posz, w,h,d) }],
    ['part_HoodRail',             {createPart: (posx:number,posy:number,posz:number,w:number,h:number,d:number) => this.addpart_HoodRail(posx, posy, posz, w,h,d) }],
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

	
	//===================================================
	// Add the carcase parts for the hood
  //===================================================
  let t1Depth = hoodAssInfo.Tower1Depth;
  let t2Depth = hoodAssInfo.Tower2Depth;
  let h1 = hoodAssInfo.Tower1Height; 
  let cutOutDepthMin = hoodAssInfo.CutOutDepthMin;

	partList.forEach(part => {
		const partData = part;

    let config = partConfig.get(partData.PartID ?? "");
    if(config){
      let {createPart} = config;
      try {
          let posHeight = partData.PositionHeight(this,h1);
          let posDepth 		= partData.PositionDepth(this,t2Depth);
          let partDepth  	= partData.Depth(this,t2Depth,hoodRearOffset);
          let partHeight  = partData.Height(this,h1);

          if (hoodInformation.ConstructionId == "HoodConstructId01") {
            if (partData.PartID === "part_HoodShelfbtm") {
              //posHeight += hoodAssInfo.Tower1Height;
              //partDepth -= hoodAssInfo.Tower2Depth;
              //posDepth += hoodAssInfo.Tower2Depth;
            }
            else if (partData.PartID === "part_HoodBackwall") {
              //posHeight += hoodAssInfo.Tower1Height;
              //posHeight += this.mod_HoodRailverttopbackthk; // bsp. Stärke Boden 

              //posDepth += hoodAssInfo.Tower2Depth;
              //posDepth += 10;

              //partHeight -= hoodAssInfo.Tower1Height;
            }
            else if (partData.PartID === "part_HoodShelftop") {
              //posDepth += hoodAssInfo.Tower2Depth;
              //partDepth -= hoodAssInfo.Tower2Depth;
              //partDepth -= 8; // To Do Backwall thk
              //partDepth -= 10; // To Do Groove Pos

            }
            else if (partData.PartID === "part_HoodRail") {
              //partHeight = hoodAssInfo.Tower1Height;
            }            
          }
        //let element = createPart(partData.PositionWidth(this), partData.PositionHeight(this), partData.PositionDepth(this), partData.Width(this), partData.Height(this), partData.Depth(this));
          let element = createPart(partData.PositionWidth(this,0), posHeight, posDepth, partData.Width(this,0), partHeight, partDepth);
          
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

