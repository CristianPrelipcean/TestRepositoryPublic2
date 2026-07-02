
  // Schuler Consulting
  // Create: March 2026
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_SegmentFront01
  // Add a front panels
  //
  // Revisions: 
  //
  //================================================================================================

  //================================================================================================
  //          Initialize (Create the map)
  //================================================================================================

  // Mapping for FrontType configurations with direct method references
  let partConfig = new Map([
    ['DoorLeft', { partGroup: 'Door', handlePosType: true, opening: true, additionalInfo1: this.mod_DoorDirection, createPart: () => this.addpart_DoorSegmented(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['DoorRight', { partGroup: 'Door', handlePosType: true, opening: true, additionalInfo1: this.mod_DoorDirection, createPart: () => this.addpart_DoorSegmented(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
  ]);
  let config = partConfig.get(this.mod_FrontType.trim());

  //===================================================
  //          Main section to insert the parts
  //===================================================

  // Check if mod_FrontType is valid (included in the map)
  if (config) {

    // If mod_FrontType is valid we get the information from the map
    let { partGroup, handlePosType, opening, additionalInfo1, createPart } = config;

    try {

      // Read the data from process_FrontPanelConstruction stored in mod_Information
      const retFrontData = JSON.parse(this.mod_Information);

      // Define FrontEdgeColor
      const FrontEdgeColorData = GlobalFunc.find_FrontEdgeColorMapping(this.mod_FrontProgram, this.mod_FrontColor);
      const mappedColor = FrontEdgeColorData?.StandardColor ?? this.mod_FrontColor;
      const FrontEdgeColor = this.mod_FrontEdgeColor === "Automatic" ? mappedColor : this.mod_FrontEdgeColor;

      // Define segment variables
      const FrontSegmentType = retFrontData.frontSegmentType;
      const FrontSegmentColor = retFrontData.frontSegmentColor;
      const FrontSegmentGrain = retFrontData.retSpecificConstruction.SegmentGrainDirection;

      // Calcualte the segment heights
      const dividerHeight = this.mod_FrontSegmentDescriptor != '' ? this.mod_FrontSegmentDescriptor : retFrontData.retSpecificConstruction.DescriptorHeight;
      const rawSegments = GlobalFunc.process_Descriptor(dividerHeight, this.mod_Height);
      const segments = ((s: number[]) => { 
        if (s.length !== 2) throw new Error('Wrong height descriptor!');
          const b = [0, ...s, this.mod_Height];
          return b.slice(0, -1).map((v, i) => b[i + 1] - v);
        })(Array.isArray(rawSegments) ? rawSegments : []);

      // Calculate the depth position of the middle segment
      const rawDepthPos = GlobalFunc.process_Descriptor(retFrontData.retSpecificConstruction.DescriptorDepth, retFrontData.retSpecificConstruction.FrontThk);
      const depthPos = ((s: number[]) => {
        if (s.length !== 2) throw new Error('Wrong depth descriptor!');
        return s[0];
      })(Array.isArray(rawDepthPos) ? rawDepthPos : []);

      // Graphical parts
      const segmentBtm = this.addpart_SegmentedFront(0,0,0,this.mod_Width, segments[0], retFrontData.retSpecificConstruction.FrontThk);
      const segmentMid = this.addpart_SegmentedFront(0,segments[0],depthPos,this.mod_Width, segments[1], retFrontData.retSpecificConstruction.SegmentThk);
      const segmentTop = this.addpart_SegmentedFront(0,segments[0] + segments[1],0,this.mod_Width, segments[2], retFrontData.retSpecificConstruction.FrontThk);

      // Add material
      GlobalFunc.process_AddMaterialFront(segmentBtm, this, 'FrontPanel01', retFrontData.retSpecificConstruction.FrontGrainDirection, FrontEdgeColor);
      GlobalFunc.process_AddMaterialFront(segmentMid, this, 'SegmentedFront01', FrontSegmentGrain, FrontSegmentColor);
      GlobalFunc.process_AddMaterialFront(segmentTop, this, 'FrontPanel01', retFrontData.retSpecificConstruction.FrontGrainDirection, FrontEdgeColor);

      // Front opening
      if (opening) {
        this.assignOpenGroup(this.mod_FrontId, segmentBtm);
        this.assignOpenGroup(this.mod_FrontId, segmentMid);
        this.assignOpenGroup(this.mod_FrontId, segmentTop);
      }
    }

    //===================================================
    //          Error handling
    //===================================================

    catch (error: any) {
      logError(error.message);
    }
  }