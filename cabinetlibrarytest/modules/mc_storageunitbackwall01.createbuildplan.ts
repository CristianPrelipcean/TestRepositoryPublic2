  // Schuler Consulting
  // Create: Nov 2022
  // By Ludwig Weber
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_StorageUnitBackwall
  // Add a single backwall
  //
  // Revisions:
  // 
  //===================================================

  //===================================================
  //          Add a single backwall
  //===================================================

  let Elem = this.addpart_Backwall(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
  this.assignPartGroup(this.mod_CarcaseId,Elem);

  // Add Shape to the part in case of SlopeCeiling Cabinet
  let boolSvg = false;
  if (this.mod_SlopeAngle != 0) {
    let shape = GlobalFunc.process_CarcasePartsShape(this, 'part_Backwall', 'All', 'SlopedCeiling', this.mod_SlopedCeilingConstruction, 'All','All');
    if (shape.SvgPath) {
      Elem.extrude(`<svg><path d="${shape.SvgPath}"></path></svg>`, shape.ExtrudeDirection!);
      boolSvg = true;
    }
    Elem.pa_AngleBack = this.mod_SlopeAngle / 2;
  }

  GlobalFunc.process_AddMaterialCarcase(Elem, this, 'backwall', boolSvg, this.mod_CarcaseVisBack, 'front');
    