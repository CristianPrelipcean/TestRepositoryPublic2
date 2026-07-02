process_FrontPanelConstruction(Module: any, Partgroup: string, Program: string, Width: number, Height: number, HandleDesignGroup: string, HandlePosType: string, FrontGrain: string, OverlayBtm = 0):
 { retFrontConstruction: any, retSpecificConstruction: any, width: number, height: number, thickness: number, posX: number, posY: number, posZ: number, weight: number, fillingColor: string, fillingGrain: string, fillingType: string, frontSegmentType: string, frontSegmentColor: string, frontSegmentGrainId: string } {

	// Interface
	let retFrontConstruction: any;
	let retSpecificConstruction: any;
	let width = 0;
	let height = 0;
	let thickness = 0;
	let posX = 0;
	let posY = 0;
	let posZ = 0;
	let weight = 0;
	let FrontDesign = Module.mod_FrontDesign;
	let fillingType = Module?.mod_FrameFillingType ?? 'None';
	let fillingColor = Module?.mod_FrameFillingColor ?? 'None';
	let fillingGrain = Module?.mod_FrameFillingColor_matrix?.GrainGroupId ?? "None";
	let frontSegmentType = Module?.mod_FrontSegmentType ?? "Automatic";
	let frontSegmentColor = Module?.mod_FrontSegmentColor ?? "None";
	let frontSegmentGrainId = Module?.mod_FrontSegmentColor_matrix?.GrainGroupId ?? 'None';
	const frontStartPos = Module?.mod_HeightPosInsertion + Module?.mod_Originpos[1];
	const frontColor = Module?.mod_FrontColor ?? 'All';

	try {

		//===================================================
		// Retrieve data from table FrontConstruction
		//===================================================

		retFrontConstruction = GlobalFunc.find_FrontConstruction(Program, HandleDesignGroup, HandlePosType, Width, Height, Partgroup, FrontDesign, frontColor);

		// Safety check: If we got no value we stop the evaluation.
		if (!retFrontConstruction?.FrontConstructionId) {

			// Retrieve error message
			let ErrorMessage = GlobalFunc.find_ErrorList('Error 61002',1);
			throw new Error(ErrorMessage.Message(''));
		}

		// Set the dimensions and positions
		width = retFrontConstruction.Width(Module);
		height = retFrontConstruction.Height(Module);
		thickness = retFrontConstruction.Thickness;
		posX = retFrontConstruction.WidthPos(Module);
		posY = retFrontConstruction.HeightPos(Module);
		posZ = retFrontConstruction.DepthPos(Module);

		//===================================================
		// Retrieve data from the specific table
		//===================================================
	
		// Depending on the moduleId we need to call different functions to retrieve the specific construction data
		const moduleId = retFrontConstruction.FrontModuleId;

		// Flatpanels
		//---------------------------------------------------
		if (moduleId == "FrontPanel01") {
			retSpecificConstruction = GlobalFunc.find_FrontPanelConstruction(Partgroup, retFrontConstruction.FrontConstructionId, FrontGrain);
		}

		// Framed fronts
		//---------------------------------------------------
		else if (moduleId == "WoodFrame01") {

			// If the filling type is "Automatic" we need to find the filling mapping to get the correct filling type, color and grain
			if (fillingType === 'Automatic') {
				const retFillingMapping = GlobalFunc.find_FrameFillingMapping(Partgroup, Module.mod_FrontProgram, FrontDesign, Module.mod_FrontColor);	
				fillingType = retFillingMapping?.FillingType ?? Module.mod_FrameFillingType;
				fillingColor = retFillingMapping?.FillingColor ?? Module.mod_FrameFillingColor;
				fillingGrain = retFillingMapping?.FillingGrain ?? Module.mod_FrameFillingColor_matrix.GrainGroupId;
			}

			// Special case: If the filling color is "LikeFrameColor" we need to set the color and grain from the frame color
			if(fillingColor === 'LikeFrameColor') {
				fillingColor = Module.mod_FrontColor;
				fillingGrain = Module.mod_FrontColor_matrix.GrainGroupId;
			}

			// Retrieve the specific construction data
			retSpecificConstruction = GlobalFunc.find_PanelWoodFrameConstruction(Partgroup, retFrontConstruction.FrontConstructionId, FrontGrain, fillingGrain, fillingType);
		}

		// Segmented fronts
		//---------------------------------------------------
		else if (moduleId == "SegmentFront01") {

			// If the segment type is "Automatic" we need to find the segment mapping to get the correct segment type, color and grain
			if (frontSegmentType === 'Automatic') {
				const retSegmentMapping = GlobalFunc.find_SegmentFrontMapping(Program, Module.mod_FrontDesign, Module.mod_FrontColor);	
				frontSegmentType = retSegmentMapping?.SegmentType ?? Module.mod_FrontSegmentType;		
				frontSegmentColor = retSegmentMapping?.SegmentColor ?? Module.mod_FrontSegmentColor;
				frontSegmentGrainId = retSegmentMapping?.SegmentGrain ?? Module.mod_FrontSegmentColor_matrix.GrainGroupId;
			}

			// Retrieve the specific construction data
			retSpecificConstruction = GlobalFunc.find_SegmentFrontConstruction(Partgroup, retFrontConstruction.FrontConstructionId, FrontGrain, frontSegmentGrainId, frontSegmentType, frontSegmentColor, frontStartPos, OverlayBtm);

		}

		// Other moduleIds are not implemented yet
		//---------------------------------------------------
		else if (moduleId == "AlluminiumFrame01") {

		}
		else if (moduleId == "ThermoformedFrame01") {

		}

		// If there is no valid moduleId we stop the evaluation
		//---------------------------------------------------
		else {
			let ErrorMessage = GlobalFunc.find_ErrorList('Error 22035', 1);
			logError(ErrorMessage.Message(''));
		}

		//===================================================
		// Frontweight calculation
		//===================================================

		// Call the user exit
		//---------------------------------------------------
		if (Module.g.basic_FrontpanelWeightLogic === 'Custom') {

			weight = GlobalFunc.ue_FrontpanelWeightCalculations(Module, Partgroup, Program, Width, Height, HandleDesignGroup, HandlePosType, FrontGrain)

			if (!weight || weight === undefined) {
				weight = 0;    

				// Retrieve error message
				let ErrorMessage = GlobalFunc.find_ErrorList('Error 30005',1);
				throw new Error(ErrorMessage.Message(''));        
			}
		}

		// Library solution
		//---------------------------------------------------
		else if (Module.g.basic_FrontpanelWeightLogic === 'Library') {
            
			const frontweight = retSpecificConstruction.Weight;

			if (width === undefined || height === undefined || frontweight === undefined) {

			// Retrieve error message
			let ErrorMessage = GlobalFunc.find_ErrorList('Error 61001',1);
			throw new Error(ErrorMessage.Message(''));
			}

			weight = (width / 1000) * (height / 1000) * frontweight;
		}

		// Error not implemented weight calculation
		//---------------------------------------------------
		else {
			// Retrieve error message
			let ErrorMessage = GlobalFunc.find_ErrorList('Error 61003',1);
			throw new Error(ErrorMessage.Message(''));  
		}
	} 

	//===================================================
	// Control the errors
	//===================================================

	catch (error:any) {

		// Log the error; return what we could do before we stopped
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 40002',1);
		logError(ErrorMessage.Message(error.message));
	}

	return {
		retFrontConstruction,
		retSpecificConstruction,
		width,
		height,
		thickness,
		posX,
		posY,
		posZ,
		weight,
		fillingColor,
		fillingGrain,
		fillingType,
		frontSegmentType,
		frontSegmentColor,
		frontSegmentGrainId
	};
}