
  // Schuler Consulting
  // Create: Nov 2022
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_FrontPanel01
  // Add a front panel
  //
  // Revisions: August 2023
  // Stefano Cortese
  // Add the Flip Lift doors
  //
  // Revisions: November 2024
  // Ludwig Weber
  // Modifications on the code (control the errors)
  //
  // Ludwig Weber March 2025
  // Add the fixed front
  //===================================================

  //===================================================
  //          Initialize (Create the map)
  //===================================================

  // Mapping for FrontType configurations with direct method references
  let partConfig = new Map([
    ['FillerLeft',                { partGroup: 'Filler',                handlePosType: false,   opening: false,   additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_Filler(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }], // Used when Parent is mr_Filler
    ['FillerRight',               { partGroup: 'Filler',                handlePosType: false,   opening: false,   additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_Filler(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }], // Used when Parent is mr_Filler
    ['CornerStraightFillerLeft',  { partGroup: 'CornerStraightFiller',  handlePosType: false,   opening: false,   additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_Filler(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }], // Used when Parent is mr_CornerunitStraight
    ['CornerStraightFillerRight', { partGroup: 'CornerStraightFiller',  handlePosType: false,   opening: false,   additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_Filler(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }], // Used when Parent is mr_CornerunitStraight
    ['CornerFillerLeft',          { partGroup: 'CornerFiller',          handlePosType: false,   opening: false,   additionalInfo1: 'None',                  hardwareInfo: this.mod_FillerHardwareInfo,  createPart: () => this.addpart_Filler(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }], // Used when Parent is mr_Cornerfiller
    ['CornerFillerRight',         { partGroup: 'CornerFiller',          handlePosType: false,   opening: false,   additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_Filler(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }], // Used when Parent is mr_Cornerfiller
    ['DoorLeft',                  { partGroup: 'Door',                  handlePosType: true,    opening: true,    additionalInfo1: this.mod_DoorDirection,  hardwareInfo: 'None',                       createPart: () => this.addpart_Door(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['DoorRight',                 { partGroup: 'Door',                  handlePosType: true,    opening: true,    additionalInfo1: this.mod_DoorDirection,  hardwareInfo: 'None',                       createPart: () => this.addpart_Door(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['Fliplift',                  { partGroup: 'Fliplift',              handlePosType: true,    opening: true,    additionalInfo1: this.mod_FlipliftType,   hardwareInfo: 'None',                       createPart: () => this.addpart_Fliplift(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['Drawer',                    { partGroup: 'Drawer',                handlePosType: true, opening: true,       additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_Drawer(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['PantryPullout',             { partGroup: 'Drawer',                handlePosType: true,    opening: true,    additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_PantryPullout(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['Pullout',                   { partGroup: 'Drawer',                handlePosType: true,    opening: true,    additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_Pullout(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['Fixedfront',                { partGroup: 'Drawer',                handlePosType: true,    opening: false,   additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_Fixedfront(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['Dishwasher',                { partGroup: 'Dishwasher',            handlePosType: true,    opening: true,    additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_DishwasherPanel(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['BaseunitFridge',            { partGroup: 'Door',                  handlePosType: true,    opening: true,    additionalInfo1: this.mod_DoorDirection,  hardwareInfo: 'None',                       createPart: () => this.addpart_BaseunitFridgePanel(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }]
  ]);
  let config = partConfig.get(this.mod_FrontType.trim());

  //===================================================
  // Try to insert the front panel
  //===================================================

  // Check if mod_FrontType is valid (included in the map)
  if (config) {

    // If mod_FrontType is valid we get the information from the map
    let { partGroup, handlePosType, opening, additionalInfo1, hardwareInfo, createPart } = config;

    try {

      // Find handelPosType
      let handlePos = "None";
      if (handlePosType) {
        handlePos = GlobalFunc.find_HandleSettings(this.mod_HandlePosType, partGroup).HandleOrientation!;
      }     
  
      // Call function to get Frontconstruction
      let retFrontConstruction = JSON.parse(this.mod_Information);
      
      // Add part by invoking createPart method
      let element = createPart();
      
  //===================================================
  // Assign 3D model if available or extrude for fillers
  //===================================================
  if (retFrontConstruction.retSpecificConstruction.GraphicFileId != 'None' && retFrontConstruction.retSpecificConstruction.GraphicFileId != '') {
    // That's completly missing at the moment -> We have to add this later!

    let graphicFileLibrary = GlobalFunc.find_GraphicFileLibrary(retFrontConstruction.retSpecificConstruction.GraphicFileId);

    element.assign3DModel(graphicFileLibrary.Model3D!, false);


    // Add the material in the graphic
    GlobalFunc.process_AddMaterial(element, 'FrontPanel01', this.mod_FrontColor);
  } 
  else if (this.mod_ParentName == 'mf_CornerFillerFront' && this.mod_CornerunitStraightFillerConstruction_matrix.PartInCornerCabinet === 'Mitre') {
    let points = (this.mod_FrontType === 'CornerStraightFillerRight' || this.mod_FrontType === 'CornerFillerRight')
                  ? `0,0 ${this.mod_Width},0 ${this.mod_Width},${this.mod_Depth} ${this.mod_Depth},${this.mod_Depth}`
                  : `0,0 ${this.mod_Width},0 ${this.mod_Width-this.mod_Depth},${this.mod_Depth} 0,${this.mod_Depth}`;

    element.extrude(`<svg><polygon points="${points}" /></svg>`, 'y'); 
  }

  //===================================================
  // Common assignments
  //===================================================

      // Define FrontEdgeColor
      const FrontEdgeColorData = GlobalFunc.find_FrontEdgeColorMapping(this.mod_FrontProgram, this.mod_FrontColor);
      const mappedColor = FrontEdgeColorData?.StandardColor ?? this.mod_FrontColor;
      const FrontEdgeColor = this.mod_FrontEdgeColor === "Automatic" ? mappedColor : this.mod_FrontEdgeColor;

      // Attributes for part level and MaterialMapping
      this.assignPartGroup(this.mod_FrontId, element);   
      element.pa_Weight = retFrontConstruction.weight;
      element.pa_AdditionalInfo1 = additionalInfo1;
      element.pa_EdgeBackColor = FrontEdgeColor;
      element.pa_EdgeFrontColor = FrontEdgeColor;
      element.pa_EdgeLeftColor = FrontEdgeColor;
      element.pa_EdgeRightColor = FrontEdgeColor;
      element.pa_EdgeFrontType = retFrontConstruction.retFrontConstruction.EdgeTypeTop;
      element.pa_EdgeBackType = retFrontConstruction.retFrontConstruction.EdgeTypeBtm;
      element.pa_EdgeLeftType = retFrontConstruction.retFrontConstruction.EdgeTypeLeft;
      element.pa_EdgeRightType = retFrontConstruction.retFrontConstruction.EdgeTypeRight;
      element.pa_EdgeJointType = retFrontConstruction.retFrontConstruction.EdgeJointType;
      element.pa_GrainDirection = retFrontConstruction.retSpecificConstruction.GrainDirection;
      if (hardwareInfo != 'None') {
        element.pa_HardwareInfo = JSON.stringify(JSON.parse(hardwareInfo[0]));
      }
      else {
        element.pa_HardwareInfo = 'None';
      }

      // Add the material
      //GlobalFunc.process_AddMaterialFront(element, this, "FrontPanel01", retFrontConstruction.retSpecificConstruction.GrainDirection, FrontEdgeColor);

    
      // Front opening
      if (opening) {
        this.assignOpenGroup(this.mod_FrontId, element);
      }
    } 

  //===================================================
  // Catch the errors
  //===================================================
    
    catch (error:any) {
      // Log the error and stop execution if any function call fails
      let ErrorMessage = GlobalFunc.find_ErrorList('Error 21004',1);
      logError(ErrorMessage.Message(error.message));
      return;
    }
  } 
  else {
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 21003',1);
    logError(ErrorMessage.Message(''));
  }
