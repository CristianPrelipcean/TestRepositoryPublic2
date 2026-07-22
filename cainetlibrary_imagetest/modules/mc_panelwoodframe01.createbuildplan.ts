
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
        addFrameParts(this, this.mod_Height, 0, this.mod_Width - 2 * frameWidthVert, frameWidthVert, false, opening, fillingType)
      }

      // Vertical frame short
      else if (frameType == 'WidthCoveredHeight') {
        addFrameParts(this, this.mod_Height - 2 * frameWidthHor, frameWidthHor, this.mod_Width, 0, false, opening, fillingType)
      }

      // Mitre cut
      else if (frameType == 'Mitre') {
        if (frameWidthHor == frameWidthVert) {
          addFrameParts(this, this.mod_Height, 0, this.mod_Width, 0, true, opening, fillingType)
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

      function addFrameParts(m: any, vertHeight: number, posVert: number, horLength: number, posHor: number, mitre: boolean, opening: boolean, material: string = 'Chipboard') {

        // Vertical left
        const FrameLeft = m.addpart_PanelWoodFrameLeft(0, posVert, 0, frameWidthVert, vertHeight, m.mod_Depth);
        GlobalFunc.process_AddMaterialFront(FrameLeft, m, 'FrameVertical01', frameVertGrain, FrontEdgeColor, mitre, fillingColor);
        if (opening) {
          m.assignOpenGroup(m.mod_FrontId, FrameLeft);
        }

        // Vertical right
        const FrameRight = m.addpart_PanelWoodFrameRight(m.mod_Width - frameWidthVert, posVert, 0, frameWidthVert, vertHeight, m.mod_Depth);
        GlobalFunc.process_AddMaterialFront(FrameRight, m, 'FrameVertical01', frameVertGrain, FrontEdgeColor, mitre, fillingColor);
        if (opening) {
          m.assignOpenGroup(m.mod_FrontId, FrameRight);
        }

        // Horizontal bottom
        const FrameBtm = m.addpart_PanelWoodFrameBtm(posHor, 0, 0, horLength, frameWidthHor, m.mod_Depth);
        GlobalFunc.process_AddMaterialFront(FrameBtm, m, 'FrameHorizontal01', frameHorGrain, FrontEdgeColor, mitre, fillingColor);
        if (opening) {
          m.assignOpenGroup(m.mod_FrontId, FrameBtm);
        }

        // Horizontal top
        const FrameTop = m.addpart_PanelWoodFrameTop(posHor, m.mod_Height - frameWidthHor, 0, horLength, frameWidthHor, m.mod_Depth);
        GlobalFunc.process_AddMaterialFront(FrameTop, m, 'FrameHorizontal01', frameHorGrain, FrontEdgeColor, mitre, fillingColor);
        if (opening) {
          m.assignOpenGroup(m.mod_FrontId, FrameTop);
        }

        // Filling
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

          // Extrude the parts
          FrameTop.extrude(`<svg><path d="${SVGPathTop}"></path></svg>`, 'z');
          FrameLeft.extrude(`<svg><path d="${SVGPathLeft}"></path></svg>`, 'z');
          FrameBtm.extrude(`<svg><path d="${SVGPathBtm}"></path></svg>`, 'z');
          FrameRight.extrude(`<svg><path d="${SVGPathRight}"></path></svg>`, 'z');
        }
      }
    }

    //===================================================
    //          Error handling
    //===================================================

    catch (error: any) {
      logError(error.message);
    }
  }