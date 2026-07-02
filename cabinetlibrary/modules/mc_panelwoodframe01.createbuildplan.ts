
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
        // Vertical left
        //---------------------------------------------------
        const FrameLeft = m.addpart_PanelWoodFrameLeft(0, posVert, 0, frameWidthVert, vertHeight, m.mod_Depth);
        //Use SVG if we have an inset handle
        let addBackPartToFrameLeft = false;
        if (retFrontData.retSpecificConstruction.ConstructionType == 'InsetHandle')
        {
          //Run the function
          let retHandle = CalculateInsetHandleData(m, 0, posVert);
          //Check if Handle is inside this part
          if(retHandle != undefined && retHandle.PosVertical > 0 && retHandle.PosVertical < frameWidthVert && retHandle.PosHorizontal > posVert && retHandle.PosHorizontal < posVert + vertHeight) {
            //Generate the part Svg
            let sVGFrameLeft = `M0,${posVert} ${frameWidthVert},0 ${frameWidthVert},${vertHeight} 0,${vertHeight} 0,0 Z`
            //Add the pocket Svg
            sVGFrameLeft += retHandle.SvgHandle;
            // Extrude element (FrameLeft + pocket)
            FrameLeft.extrude('<svg><path d="' + sVGFrameLeft + '"></path></svg>', 'z');
            addBackPartToFrameLeft = true;
          }
        }
        //Add a back part if we need it
        if (addBackPartToFrameLeft) {
          const VirtualPartOnBack = m.addpart_VirtualFront(0, posVert, 0, frameWidthVert, vertHeight, 0.5)
           // Add the material
          GlobalFunc.process_AddMaterialFront(VirtualPartOnBack, m, 'FrameVertical01', frameVertGrain, FrontEdgeColor, mitre, fillingColor);
          if (opening) {
            m.assignOpenGroup(m.mod_FrontId, VirtualPartOnBack);
          }
        }
        GlobalFunc.process_AddMaterialFront(FrameLeft, m, 'FrameVertical01', frameVertGrain, FrontEdgeColor, mitre, fillingColor);
        if (opening) {
          m.assignOpenGroup(m.mod_FrontId, FrameLeft);
        }

        //---------------------------------------------------
        // Vertical right
        //---------------------------------------------------
        const FrameRight = m.addpart_PanelWoodFrameRight(m.mod_Width - frameWidthVert, posVert, 0, frameWidthVert, vertHeight, m.mod_Depth);
        //Use SVG if we have an inset handle
        let addBackPartToFrameRight = false;
        if (retFrontData.retSpecificConstruction.ConstructionType == 'InsetHandle')
        {
          //Run the function
          let retHandle = CalculateInsetHandleData(m, (m.mod_Width - frameWidthVert), posVert);
          //Check if Handle is inside this part
          if(retHandle != undefined && retHandle.PosVertical > m.mod_Width - frameWidthVert && retHandle.PosVertical < m.mod_Width - frameWidthVert + frameWidthVert && retHandle.PosHorizontal > posVert && retHandle.PosHorizontal < posVert + vertHeight) {
            //Generate the part Svg
            let sVGFrameRight = `M0,${posVert} ${frameWidthVert},0 ${frameWidthVert},${vertHeight} 0,${vertHeight} 0,0 Z`
            //Add the pocket Svg
            sVGFrameRight += retHandle.SvgHandle;
            // Extrude element (FrameRight + pocket)
            FrameRight.extrude('<svg><path d="' + sVGFrameRight + '"></path></svg>', 'z');
            addBackPartToFrameRight = true;
          }
        }
        //Add a back part if we need it
        if (addBackPartToFrameRight) {
          const VirtualPartOnBack = m.addpart_VirtualFront(m.mod_Width - frameWidthVert, posVert, 0, frameWidthVert, vertHeight, 0.5)
           // Add the material
          GlobalFunc.process_AddMaterialFront(VirtualPartOnBack, m, 'FrameVertical01', frameVertGrain, FrontEdgeColor, mitre, fillingColor);
          if (opening) {
            m.assignOpenGroup(m.mod_FrontId, VirtualPartOnBack);
          }
        }
        GlobalFunc.process_AddMaterialFront(FrameRight, m, 'FrameVertical01', frameVertGrain, FrontEdgeColor, mitre, fillingColor);
        if (opening) {
          m.assignOpenGroup(m.mod_FrontId, FrameRight);
        }

        //---------------------------------------------------
        // Horizontal bottom
        //---------------------------------------------------
        const FrameBtm = m.addpart_PanelWoodFrameBtm(posHor, 0, 0, horLength, frameWidthHor, m.mod_Depth);
        //Use SVG if we have an inset handle
        let addBackPartToFrameBtm = false;
        if (retFrontData.retSpecificConstruction.ConstructionType == 'InsetHandle')
        {
          //Run the function
          let retHandle = CalculateInsetHandleData(m, posHor, 0);
          //Check if Handle is inside this part
          if (retHandle != undefined && retHandle.PosVertical > posHor && retHandle.PosVertical < posHor + horLength && retHandle.PosHorizontal > 0 && retHandle.PosHorizontal < frameWidthHor) {
            //Generate the part Svg
            let sVGFrameBtm = `M${posHor},0 ${horLength},0 ${horLength},${frameWidthHor} 0,${frameWidthHor} 0,0 Z`
            //Add the pocket Svg
            sVGFrameBtm += retHandle.SvgHandle;
            // Extrude element (FrameBtm + pocket)
            FrameBtm.extrude('<svg><path d="' + sVGFrameBtm + '"></path></svg>', 'z');
            addBackPartToFrameBtm = true;
          }
        }
        //Add a back part if we need it
        if (addBackPartToFrameBtm) {
          const VirtualPartOnBack = m.addpart_VirtualFront(posHor, 0, 0, horLength, frameWidthHor, 0.5)
           // Add the material
          GlobalFunc.process_AddMaterialFront(VirtualPartOnBack, m, 'FrameHorizontal01', frameHorGrain, FrontEdgeColor, mitre, fillingColor);
          if (opening) {
            m.assignOpenGroup(m.mod_FrontId, VirtualPartOnBack);
          }
        }
        GlobalFunc.process_AddMaterialFront(FrameBtm, m, 'FrameHorizontal01', frameHorGrain, FrontEdgeColor, mitre, fillingColor);
        if (opening) {
          m.assignOpenGroup(m.mod_FrontId, FrameBtm);
        }

        //---------------------------------------------------
        // Horizontal top
        //---------------------------------------------------
        const FrameTop = m.addpart_PanelWoodFrameTop(posHor, m.mod_Height - frameWidthHor, 0, horLength, frameWidthHor, m.mod_Depth);
        //Use SVG if we have an inset handle
        let addBackPartToFrameTop = false;
        if (retFrontData.retSpecificConstruction.ConstructionType == 'InsetHandle') {
          //Run the function
          let retHandle = CalculateInsetHandleData(m, posHor, m.mod_Height - frameWidthHor);
          //Check if Handle is inside this part
          if (retHandle != undefined && retHandle.PosVertical > posHor && retHandle.PosVertical < posHor + horLength && retHandle.PosHorizontal > m.mod_Height - frameWidthHor && retHandle.PosHorizontal < m.mod_Height - frameWidthHor + frameWidthHor) {
            //Generate the part Svg
            let sVGFrameTop = `M${posHor},0 ${horLength},0 ${horLength},${frameWidthHor} 0,${frameWidthHor} 0,0 Z`
            //Add the pocket Svg
            sVGFrameTop += retHandle.SvgHandle;
            // Extrude element (FrameTop + pocket)
            FrameTop.extrude('<svg><path d="' + sVGFrameTop + '"></path></svg>', 'z');
            addBackPartToFrameTop = true;
          }
        }
        //Add a back part if we need it
        if (addBackPartToFrameTop) {
          const VirtualPartOnBack = m.addpart_VirtualFront(posHor, m.mod_Height - frameWidthHor, 0, horLength, frameWidthHor, 0.5)
          // Add the material
          GlobalFunc.process_AddMaterialFront(VirtualPartOnBack, m, 'FrameHorizontal01', frameHorGrain, FrontEdgeColor, mitre, fillingColor);
          if (opening) {
            m.assignOpenGroup(m.mod_FrontId, VirtualPartOnBack);
          }
        }
        GlobalFunc.process_AddMaterialFront(FrameTop, m, 'FrameHorizontal01', frameHorGrain, FrontEdgeColor, mitre, fillingColor);
        if (opening) {
          m.assignOpenGroup(m.mod_FrontId, FrameTop);
        }

        //---------------------------------------------------
        // Filling
        //---------------------------------------------------
        const FrameFilling = m.addpart_PanelWoodFrameFilling(fillingStartPosX, fillingStartPosY, fillingStartPosZ, fillingWidth, fillingHeight, fillingThk);
        GlobalFunc.process_AddMaterialFront(FrameFilling, m, 'Filling01', fillingGrain, FrontEdgeColor, mitre, fillingColor);

        if (opening) {
          m.assignOpenGroup(m.mod_FrontId, FrameFilling);
        }
        FrameFilling.pa_EdgeBackType = 'NOE';
        FrameFilling.pa_EdgeLeftType = 'NOE';
        FrameFilling.pa_EdgeRightType = 'NOE';
        FrameFilling.pa_EdgeFrontType = 'NOE';
        FrameFilling.pa_EdgeJointType = 'FFFF';







        // Mitre cut
        if (mitre) {

          // Create the contour for mitre cut
          let TotalFrameWidth = horLength;
          let TotalFrameHeight = vertHeight;
          let MitreFrameWidth = frameWidthHor || frameWidthVert;
          let SVGPathTop = `M0,${MitreFrameWidth} h${TotalFrameWidth} l${-MitreFrameWidth},${-MitreFrameWidth} H${MitreFrameWidth} Z`;
          let SVGPathLeft = `M0,0 v${TotalFrameHeight}  l${MitreFrameWidth},${-MitreFrameWidth} V${MitreFrameWidth} Z`;
          let SVGPathBtm = `M0,0 h${TotalFrameWidth} l${-MitreFrameWidth},${MitreFrameWidth} H${MitreFrameWidth} Z`;
          let SVGPathRight = `M${MitreFrameWidth},0 v${TotalFrameHeight}  l${-MitreFrameWidth},${-MitreFrameWidth} V${MitreFrameWidth} Z`;
          SVGPathRight += `M20,20 l0,35 96,0 l0,-35 Z`;

          // Extrude the parts
          FrameTop.extrude(`<svg><path d="${SVGPathTop}"></path></svg>`, 'z');
          FrameLeft.extrude(`<svg><path d="${SVGPathLeft}"></path></svg>`, 'z');
          FrameBtm.extrude(`<svg><path d="${SVGPathBtm}"></path></svg>`, 'z');
          FrameRight.extrude(`<svg><path d="${SVGPathRight}"></path></svg>`, 'z');
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