
  // Schuler Consulting
  // Create: Jan 2025
  // By Henning Wiesbrock
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_PanelWoodFrame01
  // Add a front panel
  //
  // Revisions:
  //
  //===================================================

  //===================================================
  //          Initialize
  //===================================================

  // Mapping for FrontType configurations with direct method references
  let partConfig = new Map([
    ['DoorLeft', { partGroup: 'Door', handlePosType: true, opening: true, additionalInfo1: this.mod_DoorDirection, createPart: () => this.addpart_DoorPanelWoodFrame(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['DoorRight', { partGroup: 'Door', handlePosType: true, opening: true, additionalInfo1: this.mod_DoorDirection, createPart: () => this.addpart_DoorPanelWoodFrame(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['Drawer', { partGroup: 'Drawer', handlePosType: true, opening: true, additionalInfo1: 'None', createPart: () => this.addpart_DrawerPanelWoodFrame(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['Pullout', { partGroup: 'Drawer', handlePosType: true, opening: true, additionalInfo1: 'None', createPart: () => this.addpart_DrawerPanelWoodFrame(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['PantryPullout', { partGroup: 'Drawer', handlePosType: true, opening: true, additionalInfo1: 'None', createPart: () => this.addpart_DrawerPanelWoodFrame(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['Fliplift', { partGroup: 'Fliplift', handlePosType: true, opening: true, additionalInfo1: this.mod_FlipliftType, createPart: () => this.addpart_FlipliftPanelWoodFrame(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['Fixedfront', { partGroup: 'Drawer', handlePosType: true, opening: false, additionalInfo1: 'None', createPart: () => this.addpart_FixedfrontPanelWoodFrame(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['Dishwasher', { partGroup: 'Dishwasher', handlePosType: true, opening: true, additionalInfo1: 'None', createPart: () => this.addpart_DishwasherPanelWoodFrame(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }],
    ['BaseunitFridge', { partGroup: 'Door', handlePosType: true, opening: true, additionalInfo1: this.mod_DoorDirection, createPart: () => this.addpart_BaseunitFridgePanelWoodFrame(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth) }]
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

      // Variables for the frame
      const frameWidthHor = retFrontData.retSpecificConstruction.FramePartsWidthHor;
      const frameWidthVert = retFrontData.retSpecificConstruction.FramePartsWidthVert;
      const frameType = retFrontData.retSpecificConstruction.FrameType;

      // Variables for the filling
      const fillingThk = retFrontData.retSpecificConstruction.FrameFillingThk;
      const fillingType = retFrontData.fillingType;
      const fillingColor = retFrontData.fillingColor;
      const fillingStartPosX = frameWidthVert - this.g.basic_FramePanelGrooveDepth + this.g.basic_FillingGrooveGap;
      const fillingStartPosY = frameWidthHor - this.g.basic_FramePanelGrooveDepth + this.g.basic_FillingGrooveGap;
      const fillingStartPosZ = (this.mod_Depth - fillingThk) / 2;
      const fillingWidth = this.mod_Width - 2 * frameWidthVert + 2 * this.g.basic_FramePanelGrooveDepth - this.g.basic_FillingGrooveGap;
      const fillingHeight = this.mod_Height - 2 * frameWidthHor + 2 * this.g.basic_FramePanelGrooveDepth - this.g.basic_FillingGrooveGap;

      // Manage the grain direction
      const frameVertGrain = retFrontData.retSpecificConstruction?.FrameVertGrainDirection;
      const frameHorGrain = retFrontData.retSpecificConstruction?.FrameHorGrainDirection;
      const fillingGrain = retFrontData.retSpecificConstruction?.FillingGrainDirection;

      const grainCombi = {
        frameVertGrain,
        frameHorGrain,
        fillingGrain,
      };
      const grainInfo = JSON.stringify(grainCombi);

      // Define FrontEdgeColor
      const FrontEdgeColorData = GlobalFunc.find_FrontEdgeColorMapping(this.mod_FrontProgram, this.mod_FrontColor);
      const mappedColor = FrontEdgeColorData?.StandardColor ?? this.mod_FrontColor;
      const FrontEdgeColor = this.mod_FrontEdgeColor === "Automatic" ? mappedColor : this.mod_FrontEdgeColor;

      // Add the ghost parts for BOM and machinings
      let element = createPart();
      this.assignPartGroup(this.mod_FrontId, element);
      element.pa_Weight = retFrontData.weight;
      element.pa_FramePartsWidthHor = frameWidthHor;
      element.pa_FramePartsWidthVert = frameWidthVert;
      element.pa_PanelWoodFrameType = frameType;
      element.pa_FrameFillingMaterial = fillingType;
      element.pa_FrameFillingThk = fillingThk;
      element.pa_AdditionalInfo1 = additionalInfo1;
      element.pa_FrameFillingColor = fillingColor;
      element.pa_EdgeBackColor = FrontEdgeColor;
      element.pa_EdgeFrontColor = FrontEdgeColor;
      element.pa_EdgeLeftColor = FrontEdgeColor;
      element.pa_EdgeRightColor = FrontEdgeColor;
      element.pa_EdgeFrontType = retFrontData.retFrontConstruction.EdgeTypeTop;
      element.pa_EdgeBackType = retFrontData.retFrontConstruction.EdgeTypeBtm;
      element.pa_EdgeLeftType = retFrontData.retFrontConstruction.EdgeTypeLeft;
      element.pa_EdgeRightType = retFrontData.retFrontConstruction.EdgeTypeRight;
      element.pa_EdgeJointType = retFrontData.retFrontConstruction.EdgeJointType;
      element.pa_GrainDirection = grainInfo;

      if (opening) {
        this.assignOpenGroup(this.mod_FrontId, element);
      }

      // Vertical frame long
      if (frameType == 'HeightCoveredWidth') {
        addFrameParts(this, this.mod_Height, 0, this.mod_Width - 2 * frameWidthVert, frameWidthVert, false, opening, fillingType, retFrontData)
      }

      // Vertical frame short
      else if (frameType == 'WidthCoveredHeight') {
        addFrameParts(this, this.mod_Height - 2 * frameWidthHor, frameWidthHor, this.mod_Width, 0, false, opening, fillingType, retFrontData)
      }

      // Mitre cut
      else if (frameType == 'Mitre') {
        if (frameWidthHor == frameWidthVert) {
          addFrameParts(this, this.mod_Height, 0, this.mod_Width, 0, true, opening, fillingType, retFrontData)
        }
        else {
          // Frame vertical and horizontal is not equal
          throw new Error(String(GlobalFunc.find_ErrorList('Info 22004', 1)));
        }
      }
      else {
        // Should never happen, because it is an attribute with a selection (Only for the development team)
        throw new Error("This construction is not implemented! Framed Front mod_PanelWoodFrameType, mc_PanelWoodFrame createBuildPlan!")
      }

      //===================================================
      //          Helper functions
      //===================================================

      // Add the graphical parts
      //---------------------------------------------------

      function addFrameParts(m: any, vertHeight: number, posVert: number, horLength: number, posHor: number, mitre: boolean, opening: boolean, material: string = 'Chipboard', retFrontData: any) {

        //---------------------------------------------------
        // Add the Vertical and Horizontal Parts
        //---------------------------------------------------
        // Vertical left
        const FrameLeft = m.addpart_PanelWoodFrameLeft(0, posVert, 0, frameWidthVert, vertHeight, m.mod_Depth);
        let SVGPathLeft: string = "";

        // Vertical right
        const FrameRight = m.addpart_PanelWoodFrameRight(m.mod_Width - frameWidthVert, posVert, 0, frameWidthVert, vertHeight, m.mod_Depth);
        let SVGPathRight: string = "";

        // Horizontal bottom
        const FrameBtm = m.addpart_PanelWoodFrameBtm(posHor, 0, 0, horLength, frameWidthHor, m.mod_Depth);
        let SVGPathBtm: string = "";

        // Horizontal top
        const FrameTop = m.addpart_PanelWoodFrameTop(posHor, m.mod_Height - frameWidthHor, 0, horLength, frameWidthHor, m.mod_Depth);
        let SVGPathTop: string = "";

        //---------------------------------------------------
        // Add the Filling Part
        //---------------------------------------------------
        const FrameFilling = m.addpart_PanelWoodFrameFilling(fillingStartPosX, fillingStartPosY, fillingStartPosZ, fillingWidth, fillingHeight, fillingThk);
        GlobalFunc.process_AddMaterialFront(FrameFilling, m, 'Filling01', fillingGrain, FrontEdgeColor, fillingColor, false);

        if (opening) {
          m.assignOpenGroup(m.mod_FrontId, FrameFilling);
        }
        FrameFilling.pa_EdgeBackType = 'NOE';
        FrameFilling.pa_EdgeLeftType = 'NOE';
        FrameFilling.pa_EdgeRightType = 'NOE';
        FrameFilling.pa_EdgeFrontType = 'NOE';
        FrameFilling.pa_EdgeJointType = 'FFFF';

        //---------------------------------------------------
        // Generate SVG for Mitre cut parts
        //---------------------------------------------------
        if (mitre) {

          // Create the contour for mitre cut
          let TotalFrameWidth = horLength;
          let TotalFrameHeight = vertHeight;
          let MitreFrameWidth = frameWidthHor || frameWidthVert;
          SVGPathTop = `M0,${MitreFrameWidth} h${TotalFrameWidth} l${-MitreFrameWidth},${-MitreFrameWidth} H${MitreFrameWidth} Z `;
          SVGPathLeft = `M0,0 v${TotalFrameHeight}  l${MitreFrameWidth},${-MitreFrameWidth} V${MitreFrameWidth} Z `;
          SVGPathBtm = `M0,0 h${TotalFrameWidth} l${-MitreFrameWidth},${MitreFrameWidth} H${MitreFrameWidth} Z `;
          SVGPathRight = `M${MitreFrameWidth},0 v${TotalFrameHeight}  l${-MitreFrameWidth},${-MitreFrameWidth} V${MitreFrameWidth} Z `;          
        }

        //---------------------------------------------------
        // Inset handle in Vertical left
        //---------------------------------------------------
        let addBackPartToFrameLeft = false;
        if (retFrontData.retSpecificConstruction.ConstructionType == 'InsetHandle')
        {
          //Run the function
          let retHandle = CalculateInsetHandleData(m, 0, posVert);
          //Check if Handle is inside this part
          if(retHandle != undefined && retHandle.PosVertical > 0 && retHandle.PosVertical < frameWidthVert && retHandle.PosHorizontal > posVert && retHandle.PosHorizontal < posVert + vertHeight) {
            //Generate the part Svg
            if (!mitre) {
              SVGPathLeft += `M0,0 ${frameWidthVert},0 ${frameWidthVert},${vertHeight} 0,${vertHeight} Z `
            }
            //Add the pocket Svg
            SVGPathLeft += retHandle.SvgHandle;
            addBackPartToFrameLeft = true;
          }
        }
        
        //---------------------------------------------------
        // Inset handle in Vertical right
        //---------------------------------------------------
        let addBackPartToFrameRight = false;
        if (retFrontData.retSpecificConstruction.ConstructionType == 'InsetHandle')
        {
          //Run the function
          let retHandle = CalculateInsetHandleData(m, (m.mod_Width - frameWidthVert), posVert);
          //Check if Handle is inside this part
          if(retHandle != undefined && retHandle.PosVertical > m.mod_Width - frameWidthVert && retHandle.PosVertical < m.mod_Width - frameWidthVert + frameWidthVert && retHandle.PosHorizontal > posVert && retHandle.PosHorizontal < posVert + vertHeight) {
            //Generate the part Svg
            if (!mitre) {
              SVGPathRight = `M0,0 ${frameWidthVert},0 ${frameWidthVert},${vertHeight} 0,${vertHeight} Z `
            }
            //Add the pocket Svg
            SVGPathRight += retHandle.SvgHandle;
            addBackPartToFrameRight = true;
          }
        }
        
        //---------------------------------------------------
        // Inset handle in Horizontal bottom
        //---------------------------------------------------
        let addBackPartToFrameBtm = false;
        if (retFrontData.retSpecificConstruction.ConstructionType == 'InsetHandle')
        {
          //Run the function
          let retHandle = CalculateInsetHandleData(m, posHor, 0);
          //Check if Handle is inside this part
          if (retHandle != undefined && retHandle.PosVertical > posHor && retHandle.PosVertical < posHor + horLength && retHandle.PosHorizontal > 0 && retHandle.PosHorizontal < frameWidthHor) {
            //Generate the part Svg
            if (!mitre) {
              SVGPathBtm = `M0,0 ${horLength},0 ${horLength},${frameWidthHor} 0,${frameWidthHor} Z `
            }
            //Add the pocket Svg
            SVGPathBtm += retHandle.SvgHandle;
            addBackPartToFrameBtm = true;
          }
        }

        //---------------------------------------------------
        // Inset handle in Horizontal top
        //---------------------------------------------------
        let addBackPartToFrameTop = false;
        if (retFrontData.retSpecificConstruction.ConstructionType == 'InsetHandle') {
          //Run the function
          let retHandle = CalculateInsetHandleData(m, posHor, m.mod_Height - frameWidthHor);
          //Check if Handle is inside this part
          if (retHandle != undefined && retHandle.PosVertical > posHor && retHandle.PosVertical < posHor + horLength && retHandle.PosHorizontal > m.mod_Height - frameWidthHor && retHandle.PosHorizontal < m.mod_Height - frameWidthHor + frameWidthHor) {
            //Generate the part Svg
            if (!mitre) {
              SVGPathTop = `M0,0 ${horLength},0 ${horLength},${frameWidthHor} 0,${frameWidthHor} Z `
            }
            //Add the pocket Svg
            SVGPathTop += retHandle.SvgHandle;
            addBackPartToFrameTop = true;
          }
        }

        //---------------------------------------------------
        // Extrude the parts if needed
        //---------------------------------------------------
        SVGPathLeft != "" ? FrameLeft.extrude(`<svg><path d="${SVGPathLeft}"></path></svg>`, 'z') : "";
        SVGPathRight != "" ? FrameRight.extrude(`<svg><path d="${SVGPathRight}"></path></svg>`, 'z') : "";
        SVGPathBtm != "" ? FrameBtm.extrude(`<svg><path d="${SVGPathBtm}"></path></svg>`, 'z') : "";
        SVGPathTop != "" ? FrameTop.extrude(`<svg><path d="${SVGPathTop}"></path></svg>`, 'z') : "";

        //---------------------------------------------------
        // Assign Materials to vertical and horizontal parts if needed
        //---------------------------------------------------
        // Vertical left
        GlobalFunc.process_AddMaterialFront(FrameLeft, m, 'FrameVertical01', frameVertGrain, FrontEdgeColor, fillingColor, SVGPathLeft != "" ? true : false);
        if (opening) {
          m.assignOpenGroup(m.mod_FrontId, FrameLeft);
        }

        // Vertical right
        GlobalFunc.process_AddMaterialFront(FrameRight, m, 'FrameVertical01', frameVertGrain, FrontEdgeColor, fillingColor, SVGPathRight != "" ? true : false);
        if (opening) {
          m.assignOpenGroup(m.mod_FrontId, FrameRight);
        }

        // Horizontal bottom
        GlobalFunc.process_AddMaterialFront(FrameBtm, m, 'FrameHorizontal01', frameHorGrain, FrontEdgeColor, fillingColor, SVGPathBtm != "" ? true : false);
        if (opening) {
          m.assignOpenGroup(m.mod_FrontId, FrameBtm);
        }

        // Horizontal top
        GlobalFunc.process_AddMaterialFront(FrameTop, m, 'FrameHorizontal01', frameHorGrain, FrontEdgeColor, fillingColor, SVGPathTop != "" ? true : false);
        if (opening) {
          m.assignOpenGroup(m.mod_FrontId, FrameTop);
        }

        //---------------------------------------------------
        // Add back part on Frame left if needed
        //---------------------------------------------------
        if (addBackPartToFrameLeft) {
          const VirtualPartOnBack = m.addpart_VirtualFront(0, posVert, 0, frameWidthVert, vertHeight, 0.5)
           // Add the material
          GlobalFunc.process_AddMaterialFront(VirtualPartOnBack, m, 'FrameVertical01', frameVertGrain, FrontEdgeColor, fillingColor, false);
          if (opening) {
            m.assignOpenGroup(m.mod_FrontId, VirtualPartOnBack);
          }
        }

        //---------------------------------------------------
        // Add back part on Frame right if needed
        //---------------------------------------------------
        if (addBackPartToFrameRight) {
          const VirtualPartOnBack = m.addpart_VirtualFront(m.mod_Width - frameWidthVert, posVert, 0, frameWidthVert, vertHeight, 0.5)
           // Add the material
          GlobalFunc.process_AddMaterialFront(VirtualPartOnBack, m, 'FrameVertical01', frameVertGrain, FrontEdgeColor, fillingColor, false);
          if (opening) {
            m.assignOpenGroup(m.mod_FrontId, VirtualPartOnBack);
          }
        }

        //---------------------------------------------------
        // Add back part on Frame bottom if needed
        //---------------------------------------------------
        if (addBackPartToFrameBtm) {
          const VirtualPartOnBack = m.addpart_VirtualFront(posHor, 0, 0, horLength, frameWidthHor, 0.5)
           // Add the material
          GlobalFunc.process_AddMaterialFront(VirtualPartOnBack, m, 'FrameHorizontal01', frameHorGrain, FrontEdgeColor, fillingColor, false);
          if (opening) {
            m.assignOpenGroup(m.mod_FrontId, VirtualPartOnBack);
          }
        }

        //---------------------------------------------------
        // Add back part on Frame top if needed
        //---------------------------------------------------
        if (addBackPartToFrameTop) {
          const VirtualPartOnBack = m.addpart_VirtualFront(posHor, m.mod_Height - frameWidthHor, 0, horLength, frameWidthHor, 0.5)
          // Add the material
          GlobalFunc.process_AddMaterialFront(VirtualPartOnBack, m, 'FrameHorizontal01', frameHorGrain, FrontEdgeColor, fillingColor, false);
          if (opening) {
            m.assignOpenGroup(m.mod_FrontId, VirtualPartOnBack);
          }
        }
      }

      function CalculateInsetHandleData(m: any, partInsertionPointHorizontal: number, partInsertionPointVertical: number)  {
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
        handleProcessings.forEach(handleProcessing =>
        {
          if (handleProcessing.ProcessingLibrary == "Milling") {
            let handleMillings = GlobalFunc.find_HardwareMilingLibrary(handleProcessing.ProcessingId!, 'Front')
            handleMillings.forEach(handleMilling => {
              //Add SvgPath for the Pocket (Rotation of Handle affects the SvgPath)
              if (retHandle?.Rotation == 0) {
                let posV = retHandle.PosVertical - handleMilling.BR(0, 0, 0, 0)/2 - partInsertionPointHorizontal;
                let posH = retHandle.PosHorizontal - handleMilling.LA(0, 0, 0, 0) / 2 - partInsertionPointVertical;              
                retHandle.SvgHandle += `M${posV},${posH} l0,${handleMilling.LA(0, 0, 0, 0)} l${handleMilling.BR(0, 0, 0, 0)},0 l0,-${handleMilling.LA(0, 0, 0, 0)} Z`;
              }
              else if (retHandle?.Rotation == 90) {
                let posV = retHandle.PosVertical - handleMilling.LA(0, 0, 0, 0)/2 - partInsertionPointHorizontal;
                let posH = retHandle.PosHorizontal - handleMilling.BR(0, 0, 0, 0) / 2 - partInsertionPointVertical;              
                retHandle.SvgHandle += `M${posV},${posH} l0,${handleMilling.BR(0, 0, 0, 0)} l${handleMilling.LA(0, 0, 0, 0)},0 l0,-${handleMilling.BR(0, 0, 0, 0)} Z`;
              }
              else if (retHandle?.Rotation == 180) {
                let posV = retHandle.PosVertical - handleMilling.BR(0, 0, 0, 0)/2 - partInsertionPointHorizontal;
                let posH = retHandle.PosHorizontal - handleMilling.LA(0, 0, 0, 0) / 2 - partInsertionPointVertical;              
                retHandle.SvgHandle += `M${posV},${posH} l0,${handleMilling.LA(0, 0, 0, 0)} l${handleMilling.BR(0, 0, 0, 0)},0 l0,-${handleMilling.LA(0, 0, 0, 0)} Z`;
              }
              else if (retHandle?.Rotation == 270) {
                let posV = retHandle.PosVertical - handleMilling.LA(0, 0, 0, 0)/2 - partInsertionPointHorizontal;
                let posH = retHandle.PosHorizontal - handleMilling.BR(0, 0, 0, 0) / 2 - partInsertionPointVertical;              
                retHandle.SvgHandle += `M${posV},${posH} l0,${handleMilling.BR(0, 0, 0, 0)} l${handleMilling.LA(0, 0, 0, 0)},0 l0,-${handleMilling.BR(0, 0, 0, 0)} Z`;
              }
            })
          }5
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