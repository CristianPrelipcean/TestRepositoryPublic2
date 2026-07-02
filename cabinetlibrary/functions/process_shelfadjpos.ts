process_ShelfadjPos(m: IFuncParents_mc_ShelfadjGroup01) {
	
	//---------------Internal Interface for Return Object------------------------

	interface IShelfAdjInfo {
		StartPosY: number[];
		StartPosX: number;
		StartPosZ: number;
		ShelfThk: number;
		ModuleType: string;
		Color: string;
		GrainGroupId: string;
		DrillSettings: ICT_tab_ShelfadjDrillSettings;
		DrillDistance: number;
		QtyDrills: number;
		Width: number;
		Depth: number;
		OffsetFront: number;
		OffsetBack: number;
	}

	//---------------Initialize variables----------------------------------------

	let ShelfadjInfo: IShelfAdjInfo = {
		StartPosY: [],
		StartPosX: 0,
		StartPosZ: 0,
		ShelfThk: 0,
		ModuleType: '',
		Color: m.mod_ShelfadjColor,
		GrainGroupId: m.mod_ShelfadjColor_matrix.GrainGroupId,
		DrillSettings: {} as ICT_tab_ShelfadjDrillSettings,
		DrillDistance: 0,
		QtyDrills: 0,
		Width: m.mod_Width,
		Depth: m.mod_Depth,
		OffsetFront: 0,
		OffsetBack: 0
	};
	
	let descriptor = m.mod_ShelfadjDescriptor;
	let thickness = m.mod_ShelfadjThk;
	let design = m.mod_ShelfadjDesign;
	let width = m.mod_Width;
	let depth = m.mod_Depth;
	let height = m.mod_Height;

	try {

		//---------------Get information form tab_ShelfadjSettings------------------

		const retShelfadjSettings = GlobalFunc.find_ShelfadjSettings(m.mod_CarcaseColor, m.mod_FrontDesign, m.mod_FrontProgram, design, width, depth);
		if (!retShelfadjSettings) {
			throw new Error("Stop - no message, it is done in the find-function");
		}

		//---------------Set the output values based on the ShelfadjDesign----------

		ShelfadjInfo.ModuleType = retShelfadjSettings.ModuleType ? retShelfadjSettings.ModuleType : design;  // Module Type
		design = ShelfadjInfo.ModuleType;
		ShelfadjInfo.ShelfThk = thickness > 0 ? thickness : retShelfadjSettings?.ShelfadjThk ?? 0;           // Thickness
		thickness = ShelfadjInfo.ShelfThk;

		// Color = "Automatic", choose table entry
		let color = m.mod_ShelfadjColor;
		if (color === "Automatic") {
			color = retShelfadjSettings?.ShelfadjColor ?? "";
		}

		// Color = "LikeCarcaseColor", get color from carcase
		if (color === "LikeCarcaseColor") {
			ShelfadjInfo.Color = m.mod_CarcaseColor;
			ShelfadjInfo.GrainGroupId = m.mod_CarcaseColor_matrix.GrainGroupId	;
		}
		// Color = "Automatic" but not "LikeCarcaseColor", choose table entry
		else if (m.mod_ShelfadjColor === "Automatic" && retShelfadjSettings?.ShelfadjColor) {
			ShelfadjInfo.Color = retShelfadjSettings.ShelfadjColor;
			ShelfadjInfo.GrainGroupId = retShelfadjSettings.GrainGroupId ?? '';
		}

		//---------------Settings from tab_ShelfadjQtyPosSettings-------------------

		// Call table tab_ShelfadjQtyPosSettings
		const retQtyPosSetting = GlobalFunc.find_ShelfadjQtyPosSettings(m.mod_TypeElement, m.mod_ShelfadjPartParentName, m.mod_ShelfadjPartParentType, height);
		if (!retQtyPosSetting) {
			throw new Error("Stop - no message, it is done in the find-function");
		}

		// Get the descriptor from the table if the descriptor is empty
		if (descriptor == '') {
			descriptor = retQtyPosSetting.DescriptorPosY ?? '';
		}

		// Calculate quantities and usable height
		const adjustableShelfCount = descriptor.split('_').length - 1;
		const totalShelfThickness = adjustableShelfCount * thickness;
		const usableHeight = Math.max(0, height - totalShelfThickness);

		// Process  the descriptor
		let arrDescPos: number[] = []
		if (descriptor != "N/a" && descriptor != "N/A") {
			arrDescPos = GlobalFunc.process_Descriptor(descriptor, usableHeight);
		}
		

		// Compute final shelf positions
		const arrPositions: number[] = arrDescPos.map((pos, index) => {
			const adjusted = pos + thickness * index;
			return Number(adjusted.toFixed(1));
		});
		ShelfadjInfo.StartPosY = arrPositions;

		//---------------Settings from tab_ShelfadjDrillSettings--------------------

		// Call table tab_ShelfadjDrillSettings
		let retDrillSettings = GlobalFunc.find_ShelfadjDrillSettings(m.mod_TypeElement,m.mod_ShelfadjPartParentName, m.mod_ShelfadjPartParentType, m.mod_VertDividerType, design, thickness, width, depth);
		if (!retDrillSettings) {
			throw new Error("Stop - no message, it is done in the find-function");
		}

		// Manage the quantity of drills
		ShelfadjInfo.QtyDrills = m.mod_ShelfadjDrillType === "Automatic"
			? retDrillSettings?.ShelfadjDrillType ?? 0
			: m.mod_ShelfadjDrillType_matrix.NumberDrillings;

		// Manage the drill distance
		ShelfadjInfo.DrillDistance = m.mod_ShelfadjDrillDistance > 0
			? m.mod_ShelfadjDrillDistance
			: retDrillSettings?.ShelfadjDrillDistance ?? 0;

		// Set the drill settings
		ShelfadjInfo.DrillSettings = retDrillSettings;

		// Set the dimensions and positions X and Z
		const offsetFront = retDrillSettings?.ShelfadjOffsetFront(m) ?? 0;
		const offsetBack = retDrillSettings?.ShelfadjOffsetBack(m) ?? 0;
		const widthReduction = retDrillSettings?.ShelfadjWidthReduction ?? 0;

		ShelfadjInfo.StartPosX = widthReduction / 2;
		ShelfadjInfo.StartPosZ = retDrillSettings?.ShelfadjOffsetBack(m) ?? 0;
		ShelfadjInfo.Width = width - widthReduction;
		ShelfadjInfo.Depth = depth - offsetFront - offsetBack;
		ShelfadjInfo.OffsetFront = offsetFront;
		ShelfadjInfo.OffsetBack = offsetBack;
	} 

	//---------------Error Handling--------------------------------------------
	catch (error) {
		const ErrorMessage = GlobalFunc.find_ErrorList('Error 40008',1)
		logError(ErrorMessage.Message(""));
	}

	// Return the values
	return ShelfadjInfo;
}