
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
     
      //---------------------------------------------------
      // Inset handle in segmentBtm
      //---------------------------------------------------
      let SVGPathBtm = "";
      let addBackPartToSegmentBtm = false;
      if (retFrontData.retSpecificConstruction.ConstructionType == 'InsetHandle')
      {
        //Run the function
        let retHandle = CalculateInsetHandleData(this, 0, 0);
        //Check if Handle is inside this part
        if (retHandle != undefined && retHandle.PosVertical > 0 && retHandle.PosVertical < this.mod_Width && retHandle.PosHorizontal > 0 && retHandle.PosHorizontal < segments[0] ) {
          //Generate the part Svg
          SVGPathBtm += `M0,0 ${this.mod_Width},0 ${this.mod_Width},${segments[0]} 0,${segments[0]} Z `
          //Add the pocket Svg
          SVGPathBtm += retHandle.SvgHandle;
          addBackPartToSegmentBtm = true;
        }
      }

      //---------------------------------------------------
      // Inset handle in segmentMid
      //---------------------------------------------------
      let SVGPathMid = "";
      let addBackPartToSegmentMid = false;
      if (retFrontData.retSpecificConstruction.ConstructionType == 'InsetHandle') {
        //Run the function
        let retHandle = CalculateInsetHandleData(this, 0, segments[0]);
        //Check if Handle is inside this part
        if (retHandle != undefined && retHandle.PosVertical > 0 && retHandle.PosVertical < this.mod_Width && retHandle.PosHorizontal > segments[0] && retHandle.PosHorizontal < segments[0] + segments[1]) {
          //Generate the part Svg
          SVGPathMid += `M0,0 ${this.mod_Width},0 ${this.mod_Width},${segments[1]} 0,${segments[1]} Z `
          //Add the pocket Svg
          SVGPathMid += retHandle.SvgHandle;
          addBackPartToSegmentMid = true;
        }
      }

      //---------------------------------------------------
      // Inset handle in segmentTop
      //---------------------------------------------------
      let SVGPathTop = "";
      let addBackPartToSegmentTop = false;
      if (retFrontData.retSpecificConstruction.ConstructionType == 'InsetHandle') {
        //Run the function
        let retHandle = CalculateInsetHandleData(this, 0, segments[0] + segments[1]);
        //Check if Handle is inside this part
        if (retHandle != undefined && retHandle.PosVertical > 0 && retHandle.PosVertical < this.mod_Width && retHandle.PosHorizontal > segments[0] + segments[1] && retHandle.PosHorizontal < segments[0] + segments[1] + segments[2]) {
          //Generate the part Svg
          SVGPathTop += `M0,0 ${this.mod_Width},0 ${this.mod_Width},${segments[2]} 0,${segments[2]} Z `
          //Add the pocket Svg
          SVGPathTop += retHandle.SvgHandle;
          addBackPartToSegmentTop = true;
        }
      }

      //---------------------------------------------------
      // Extrude the parts if needed
      //---------------------------------------------------
      SVGPathBtm != "" ? segmentBtm.extrude(`<svg><path d="${SVGPathBtm}"></path></svg>`, 'z') : "";
      SVGPathMid != "" ? segmentMid.extrude(`<svg><path d="${SVGPathMid}"></path></svg>`, 'z') : "";
      SVGPathTop != "" ? segmentTop.extrude(`<svg><path d="${SVGPathTop}"></path></svg>`, 'z') : "";

      // Add material
      GlobalFunc.process_AddMaterialFront(segmentBtm, this, 'FrontPanel01', retFrontData.retSpecificConstruction.FrontGrainDirection, FrontEdgeColor, 'None', SVGPathBtm != "" ? true : false);
      GlobalFunc.process_AddMaterialFront(segmentMid, this, 'SegmentedFront01', FrontSegmentGrain, FrontSegmentColor, 'None', SVGPathMid != "" ? true : false);
      GlobalFunc.process_AddMaterialFront(segmentTop, this, 'FrontPanel01', retFrontData.retSpecificConstruction.FrontGrainDirection, FrontEdgeColor, 'None', SVGPathTop != "" ? true : false);

      // Front opening
      if (opening) {
        this.assignOpenGroup(this.mod_FrontId, segmentBtm);
        this.assignOpenGroup(this.mod_FrontId, segmentMid);
        this.assignOpenGroup(this.mod_FrontId, segmentTop);
      }

          
      //---------------------------------------------------
      // Add back part on segmentBtm
      //---------------------------------------------------
      if (addBackPartToSegmentBtm) {
        const VirtualPartOnBack = this.addpart_VirtualFront(0, 0, 0, this.mod_Width, segments[0], 0.5);
        // Add the material
        GlobalFunc.process_AddMaterialFront(VirtualPartOnBack, this, 'FrontPanel01', retFrontData.retSpecificConstruction.FrontGrainDirection, FrontEdgeColor, 'None', false);
        if (opening) {
          this.assignOpenGroup(this.mod_FrontId, VirtualPartOnBack);
        }
      }

      //---------------------------------------------------
      // Add back part on segmentMid
      //---------------------------------------------------
      if (addBackPartToSegmentMid) {
        const VirtualPartOnBack = this.addpart_VirtualFront(0,segments[0],depthPos,this.mod_Width, segments[1], 0.5);
        // Add the material
        GlobalFunc.process_AddMaterialFront(VirtualPartOnBack, this, 'SegmentedFront01', FrontSegmentGrain, FrontSegmentColor, 'None', false);
        if (opening) {
          this.assignOpenGroup(this.mod_FrontId, VirtualPartOnBack);
        }
      }

      //---------------------------------------------------
      // Add back part on segmentTop
      //---------------------------------------------------
      if (addBackPartToSegmentTop) {
        const VirtualPartOnBack = this.addpart_VirtualFront(0, segments[0] + segments[1], 0, this.mod_Width, segments[2], 0.5);
        // Add the material
        GlobalFunc.process_AddMaterialFront(VirtualPartOnBack, this, 'FrontPanel01', retFrontData.retSpecificConstruction.FrontGrainDirection, FrontEdgeColor, 'None', false);
        if (opening) {
          this.assignOpenGroup(this.mod_FrontId, VirtualPartOnBack);
        }
      }

      //===================================================
      //          Helper functions
      //===================================================
      function CalculateInsetHandleData(m: any, partInsertionPointHorizontal: number, partInsertionPointVertical: number) {
        // Declare variables for handleData and enhance with sVGHandle
        interface HandleData {
          Model3D?: any;
          Model3DGroupName: string;
          ColorId: string;
          Length: number;
          Depth: number;
          Thickness: number;
          Weight: number;
          Rotation: number;
          PosVertical: number;
          PosHorizontal: number;
          ProcessingId: string;
          HardwareId: string;
          SvgHandle: string;
        }

        let retHandle: HandleData | undefined;

        // Get Handle Data
        //--------------------------------------------------- 
        const handleJson = m.mod_HardwareTypeList?.[0];

        retHandle = handleJson
          ? JSON.parse(handleJson)
          : undefined;

        if (retHandle) {
          retHandle.SvgHandle = "";
        }

        // Get the handle ProcessingItem
        let handleProcessings = GlobalFunc.find_ProcessingMapping(retFrontData.retSpecificConstruction.ProcessingItem);

        // Get the millings
        handleProcessings.forEach(handleProcessing => {
          if (handleProcessing.ProcessingLibrary == "Milling") {
            let handleMillings = GlobalFunc.find_HardwareMilingLibrary(handleProcessing.ProcessingId!, 'Front')
            handleMillings.forEach(handleMilling => {
              //Add SvgPath for the Pocket (Rotation of Handle affects the SvgPath)
              if (retHandle?.Rotation == 0) {
                let posV = retHandle.PosVertical - handleMilling.BR(0, 0, 0, 0) / 2 - partInsertionPointHorizontal;
                let posH = retHandle.PosHorizontal - handleMilling.LA(0, 0, 0, 0) / 2 - partInsertionPointVertical;
                retHandle.SvgHandle += `M${posV},${posH} l0,${handleMilling.LA(0, 0, 0, 0)} l${handleMilling.BR(0, 0, 0, 0)},0 l0,-${handleMilling.LA(0, 0, 0, 0)} Z`;
              }
              else if (retHandle?.Rotation == 90) {
                let posV = retHandle.PosVertical - handleMilling.LA(0, 0, 0, 0) / 2 - partInsertionPointHorizontal;
                let posH = retHandle.PosHorizontal - handleMilling.BR(0, 0, 0, 0) / 2 - partInsertionPointVertical;
                retHandle.SvgHandle += `M${posV},${posH} l0,${handleMilling.BR(0, 0, 0, 0)} l${handleMilling.LA(0, 0, 0, 0)},0 l0,-${handleMilling.BR(0, 0, 0, 0)} Z`;
              }
              else if (retHandle?.Rotation == 180) {
                let posV = retHandle.PosVertical - handleMilling.BR(0, 0, 0, 0) / 2 - partInsertionPointHorizontal;
                let posH = retHandle.PosHorizontal - handleMilling.LA(0, 0, 0, 0) / 2 - partInsertionPointVertical;
                retHandle.SvgHandle += `M${posV},${posH} l0,${handleMilling.LA(0, 0, 0, 0)} l${handleMilling.BR(0, 0, 0, 0)},0 l0,-${handleMilling.LA(0, 0, 0, 0)} Z`;
              }
              else if (retHandle?.Rotation == 270) {
                let posV = retHandle.PosVertical - handleMilling.LA(0, 0, 0, 0) / 2 - partInsertionPointHorizontal;
                let posH = retHandle.PosHorizontal - handleMilling.BR(0, 0, 0, 0) / 2 - partInsertionPointVertical;
                retHandle.SvgHandle += `M${posV},${posH} l0,${handleMilling.BR(0, 0, 0, 0)} l${handleMilling.LA(0, 0, 0, 0)},0 l0,-${handleMilling.BR(0, 0, 0, 0)} Z`;
              }
            })
          }
        })
        return retHandle;
      }













    }
  

    //===================================================
    //          Error handling
    //===================================================

    catch (error: any) {
      logError(error.message);
    }
  }



