  // Schuler Consulting
	// Create: Nov 2022
	// By Ludwig Weber
	// Purpose: CabinetLibrary
	//
	// Description:
	// CreateBuildPlan of mc_StorageUnitSide
	// Add an element for the top shelf including rails
	//
	// Revisions:
	// 
	//===================================================

	let Elem:any;

	//===================================================
	//          Add the Sloped Ceiling Cabinet top shelf (Horizontal)
	//===================================================

	if (this.mod_PartInfo == 'part_SlopedCeilingShelftopHor') {
		Elem = this.addpart_SlopedCeilingShelftopHor(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
		this.assignPartGroup(this.mod_CarcaseId,Elem);

		// Add Shape to the part in case of SlopeCeiling Cabinet
		let tmpShape = false;
		if (this.mod_SlopeAngle != 0) {
			let shape = GlobalFunc.process_CarcasePartsShape(this,this.mod_PartInfo,'All','SlopedCeiling',this.mod_SlopedCeilingConstruction,'All','All');
			if (shape.SvgPath) {
				Elem.extrude(`<svg><path d="${shape.SvgPath}"></path></svg>`, shape.ExtrudeDirection!);
				tmpShape = true;
			}
			Elem.pa_AngleBack = (270 - this.mod_SlopeAngle) / 2;
		}

		// Add the material
		GlobalFunc.process_AddMaterialCarcase(Elem, this, 'shelf', true, this.mod_CarcaseVisTop, 'bottom');
	
	}
	else if (this.mod_PartInfo == 'part_SlopedCeilingShelftopAngle') {
		Elem = this.addpart_SlopedCeilingShelftopAngle(0, 0, 0, this.mod_Width, this.mod_Height, this.mod_Depth);
		this.assignPartGroup(this.mod_CarcaseId,Elem);

		// Add Shape to the part in case of SlopeCeiling Cabinet
		let tmpShape = false;
		if (this.mod_SlopeAngle != 0) {
			let shape = GlobalFunc.process_CarcasePartsShape(this, this.mod_PartInfo, 'All', 'SlopedCeiling', this.mod_SlopedCeilingConstruction, 'All','All');
			if (shape.SvgPath) {
				Elem.extrude(`<svg><path d="${shape.SvgPath}"></path></svg>`, shape.ExtrudeDirection!);
				tmpShape = true;
			}
			Elem.pa_AngleFront = this.mod_SlopeAngle / 2;
			Elem.pa_AngleBack = (270 - this.mod_SlopeAngle) / 2;
		}

		// Add the material
		GlobalFunc.process_AddMaterialCarcase(Elem, this, 'shelf', true, this.mod_CarcaseVisTop, 'bottom');
	
	}