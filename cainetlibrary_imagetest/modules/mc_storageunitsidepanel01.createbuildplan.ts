  // Schuler Consulting
  // Create: Nov 2022
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_StorageUnitSide
  // Add left sidepanel, right sidepanel and middle sidepanel
  // Manage shape and extrution for cutouts of fingergrip and mitrecut
  //
  // Revisions:
  //
  //===================================================

  //===================================================
  //          Create cut outs for fingergrip
  //===================================================

  let boolSvg = false;

  // Check if we should cut the sidepanel or not
  let allowFingergripCuts = true;
  try {
    const isCorner = this.mod_ParentName === 'mr_CornerunitStraight';
    const isLeft = this.mod_SidepanelType === 'Left';
    const isRight = this.mod_SidepanelType === 'Right';

    // Block the cuts for fingergrips if it is a finished sidepanel
    const visibleBlocked = (isLeft && this.mod_CarcaseVisLeft) || (isRight && this.mod_CarcaseVisRight);
    if (visibleBlocked) { allowFingergripCuts = false; }

    // Do not cut the outer side panel of the corner units. [Jiri Polcar]
    else if (isCorner && this.mod_CarcaseDirection === this.mod_SidepanelType) {
      allowFingergripCuts = false;
    }
  }
  catch {
    logWarning('Could not check for CornerUnitStraight in mc_StorageunitSidepanel01 because of determining fingergrip cuts. This can cause that the outer panel of a corner has fingegrip cuts.');
  }

  //===================================================
  //          Create fingergrip info
  //===================================================
   
  //--------------- Initialize variables-----------------
	
	interface iFingergripInfo {
    Position?: number[];
    Height?: number[];
    Depth?: number[];
	}

  let fingergripInfo: iFingergripInfo = {
    Position: [],
    Height: [],
    Depth: []
  };

  let strJson = '';

  //--------------- Generate Fingergrip Info -----------------
  if (allowFingergripCuts) {

    // Fingergrip Top
    if (this.mod_FingergripTop) {
      fingergripInfo.Position!.push(this.mod_Height - (this.mod_FingergripType_matrix.LShapeHeight! / 2));
      fingergripInfo.Height!.push(this.mod_FingergripType_matrix.LShapeHeight!);
      fingergripInfo.Depth!.push(this.mod_FingergripType_matrix.LShapeDepth!);
    }

    // Fingergrip Middle
      this.mod_FingergripPos1! != 0 ? fingergripInfo.Position!.push(this.mod_FingergripPos1!) : '';
      this.mod_FingergripPos1! != 0 ? fingergripInfo.Height!.push(this.mod_FingergripType_matrix.CShapeHeight!) : '';
      this.mod_FingergripPos1! != 0 ? fingergripInfo.Depth!.push(this.mod_FingergripType_matrix.CShapeDepth!) : '';

      this.mod_FingergripPos2! != 0 ? fingergripInfo.Position!.push(this.mod_FingergripPos2!) : '';
      this.mod_FingergripPos2! != 0 ? fingergripInfo.Height!.push(this.mod_FingergripType_matrix.CShapeHeight!) : '';
      this.mod_FingergripPos2! != 0 ? fingergripInfo.Depth!.push(this.mod_FingergripType_matrix.CShapeDepth!) : '';

      this.mod_FingergripPos3! != 0 ? fingergripInfo.Position!.push(this.mod_FingergripPos3!) : '';
      this.mod_FingergripPos3! != 0 ? fingergripInfo.Height!.push(this.mod_FingergripType_matrix.CShapeHeight!) : '';
      this.mod_FingergripPos3! != 0 ? fingergripInfo.Depth!.push(this.mod_FingergripType_matrix.CShapeDepth!) : '';

      this.mod_FingergripPos4! != 0 ? fingergripInfo.Position!.push(this.mod_FingergripPos4!) : '';
      this.mod_FingergripPos4! != 0 ? fingergripInfo.Height!.push(this.mod_FingergripType_matrix.CShapeHeight!) : '';
      this.mod_FingergripPos4! != 0 ? fingergripInfo.Depth!.push(this.mod_FingergripType_matrix.CShapeDepth!) : '';

      this.mod_FingergripPos5! != 0 ? fingergripInfo.Position!.push(this.mod_FingergripPos5!) : '';
      this.mod_FingergripPos5! != 0 ? fingergripInfo.Height!.push(this.mod_FingergripType_matrix.CShapeHeight!) : '';
      this.mod_FingergripPos5! != 0 ? fingergripInfo.Depth!.push(this.mod_FingergripType_matrix.CShapeDepth!) : '';


    // Stringuify
    strJson = JSON.stringify(fingergripInfo);
  }


  //===================================================
  //          Add left sidepanel
  //===================================================

  if (this.mod_SidepanelType == 'Left') {
    let SpL = this.addpart_Sidepanelleft(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
    SpL.pa_FingergripInfo = strJson;

    //---------------Get the Shape and Extrude if needed-----------------
    if (allowFingergripCuts) {
      let shape = GlobalFunc.process_StorageunitSidepanelShape(this, 'part_SidePanel');
      if (shape.SvgPath) {
        SpL.extrude(`<svg><path d="${shape.SvgPath}"></path></svg>`, shape.ExtrudeDirection!);
        boolSvg = true
        if (this.mod_SlopeAngle != 0) {
          // Read Settings table
          let slopedCeilingSettings = GlobalFunc.find_SlopedCeilingSettings(this.mod_SlopedCeilingConstruction!);
          SpL.pa_TopDepth = slopedCeilingSettings.SidePanelTopDepth(this) ?? 0;
          SpL.pa_BackHeight = slopedCeilingSettings.SidePanelBackHeight(this) ?? 0;
        }       
      }
    }

    GlobalFunc.process_AddMaterialCarcase(SpL, this, 'sidepanel', boolSvg, this.mod_CarcaseVisLeft, 'right');
    this.assignPartGroup(this.mod_CarcaseId, SpL);
    
  }

  //===================================================
  //          Add right sidepanel
  //===================================================

  else if (this.mod_SidepanelType == 'Right') {
    let SpR = this.addpart_Sidepanelright(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
    SpR.pa_FingergripInfo = strJson;

    //---------------Get the Shape and Extrude if needed-----------------
    if (allowFingergripCuts) {
      let shape = GlobalFunc.process_StorageunitSidepanelShape(this, 'part_SidePanel');
      if (shape.SvgPath) {
        SpR.extrude(`<svg><path d="${shape.SvgPath}"></path></svg>`, shape.ExtrudeDirection!);
        boolSvg = true
        if (this.mod_SlopeAngle != 0) {
          // Read Settings table
          let slopedCeilingSettings = GlobalFunc.find_SlopedCeilingSettings(this.mod_SlopedCeilingConstruction!);
          SpR.pa_TopDepth = slopedCeilingSettings.SidePanelTopDepth(this) ?? 0;
          SpR.pa_BackHeight = slopedCeilingSettings.SidePanelBackHeight(this) ?? 0;
        }  
      }
    }

    GlobalFunc.process_AddMaterialCarcase(SpR, this, 'sidepanel', boolSvg, this.mod_CarcaseVisRight, 'left');
    this.assignPartGroup(this.mod_CarcaseId, SpR);

  }

  //===================================================
  //          Add middle sidepanel
  //===================================================

  else {
    let SpM = this.addpart_Sidepanelmiddle(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
    SpM.pa_FingergripInfo = strJson;

    //---------------Get the Shape and Extrude if needed-----------------
    if (allowFingergripCuts) {
      let shape = GlobalFunc.process_StorageunitSidepanelShape(this, 'part_SidePanel');
      if (shape.SvgPath) {
        SpM.extrude(`<svg><path d="${shape.SvgPath}"></path></svg>`, shape.ExtrudeDirection!);
        boolSvg = true
        if (this.mod_SlopeAngle != 0) {
          // Read Settings table
          let slopedCeilingSettings = GlobalFunc.find_SlopedCeilingSettings(this.mod_SlopedCeilingConstruction!);
          SpM.pa_TopDepth = slopedCeilingSettings.SidePanelTopDepth(this) ?? 0;
          SpM.pa_BackHeight = slopedCeilingSettings.SidePanelBackHeight(this) ?? 0;
        }  
      }
    }

    GlobalFunc.process_AddMaterialCarcase(SpM, this, 'sidepanel', boolSvg, false, 'None');
    this.assignPartGroup(this.mod_CarcaseId, SpM);

  }

  //===================================================
  //          Carcase with mitre cut
  //===================================================
