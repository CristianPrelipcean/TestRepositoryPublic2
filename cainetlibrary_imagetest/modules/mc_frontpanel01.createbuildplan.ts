
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
  //================================================================================================

  //================================================================================================
  //          Initialize (Create the map)
  //================================================================================================

  // Mapping for FrontType configurations with direct method references
  let partConfig = new Map([
    ['FillerLeft',                {opening: false,   additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_Filler(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['FillerRight',               {opening: false,   additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_Filler(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['CornerStraightFillerLeft',  {opening: false,   additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_Filler(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['CornerStraightFillerRight', {opening: false,   additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_Filler(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['CornerFillerLeft',          {opening: false,   additionalInfo1: 'None',                  hardwareInfo: this.mod_FillerHardwareInfo,  createPart: () => this.addpart_Filler(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['CornerFillerRight',         {opening: false,   additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_Filler(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['DoorLeft',                  {opening: true,    additionalInfo1: this.mod_DoorDirection,  hardwareInfo: 'None',                       createPart: () => this.addpart_Door(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['DoorRight',                 {opening: true,    additionalInfo1: this.mod_DoorDirection,  hardwareInfo: 'None',                       createPart: () => this.addpart_Door(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['Fliplift',                  {opening: true,    additionalInfo1: this.mod_FlipliftType,   hardwareInfo: 'None',                       createPart: () => this.addpart_Fliplift(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['Drawer',                    {opening: true,    additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_Drawer(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['PantryPullout',             {opening: true,    additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_PantryPullout(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['Pullout',                   {opening: true,    additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_Pullout(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['Fixedfront',                {opening: false,   additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_Fixedfront(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['Dishwasher',                {opening: true,    additionalInfo1: 'None',                  hardwareInfo: 'None',                       createPart: () => this.addpart_DishwasherPanel(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['BaseunitFridge',            {opening: true,    additionalInfo1: this.mod_DoorDirection,  hardwareInfo: 'None',                       createPart: () => this.addpart_BaseunitFridgePanel(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }]
  ]);
  let config = partConfig.get(this.mod_FrontType.trim());

  //================================================================================================
  // Try to insert the front panel
  //================================================================================================

  // Check if mod_FrontType is valid (included in the map)
  if (config) {

    // If mod_FrontType is valid we get the information from the map
    let {opening, additionalInfo1, hardwareInfo, createPart} = config;

    try {

      // Declare variables
      let materialCategory = "FrontPanel01";
  
      // Call function to get Frontconstruction
      let retFrontConstruction = JSON.parse(this.mod_Information);
      
      // Add part by invoking createPart method
      let element = createPart();

      //================================================================================================
      // Assign 3D model if available or extrude for fillers
      //================================================================================================

      if (retFrontConstruction.retSpecificConstruction.GraphicFileId != 'None' && retFrontConstruction.retSpecificConstruction.GraphicFileId != '') {

        // Get the obj file
        let graphicFileLibrary = GlobalFunc.find_GraphicFileLibrary(retFrontConstruction.retSpecificConstruction.GraphicFileId);

        //Assign the obj file
        element.assign3DModel(graphicFileLibrary.Model3D!, false);

        // Set materialCategory
        materialCategory = "FrontPanelObj01";
      } 
      else if (this.mod_ParentName == 'mf_CornerFillerFront' && this.mod_CornerunitStraightFillerConstruction_matrix.PartInCornerCabinet === 'Mitre') {
        let points = (this.mod_FrontType === 'CornerStraightFillerRight' || this.mod_FrontType === 'CornerFillerRight')
                      ? `0,0 ${this.mod_Width},0 ${this.mod_Width},${this.mod_Depth} ${this.mod_Depth},${this.mod_Depth}`
                      : `0,0 ${this.mod_Width},0 ${this.mod_Width-this.mod_Depth},${this.mod_Depth} 0,${this.mod_Depth}`;

        element.extrude(`<svg><polygon points="${points}" /></svg>`, 'y'); 
      }

      //================================================================================================
      // Common assignments
      //================================================================================================

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
        element.pa_HardwareInfo = hardwareInfo[0];
      }
      else {
        element.pa_HardwareInfo = 'None';
      }
      if (retFrontConstruction.retSpecificConstruction.ProcessingItem! != '') {
        element.pa_ProcessingId = retFrontConstruction.retSpecificConstruction.ProcessingItem!;
      }

      // Add the material
      GlobalFunc.process_AddMaterialFront(element, this, materialCategory, retFrontConstruction.retSpecificConstruction.GrainDirection, FrontEdgeColor);

      // Front opening
      if (opening) {
        this.assignOpenGroup(this.mod_FrontId, element);
      }
    } 

  //================================================================================================
  // Catch the errors
  //================================================================================================
    
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
