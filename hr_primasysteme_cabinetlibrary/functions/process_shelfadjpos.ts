process_ShelfadjPos(m: IFuncParents_mc_ShelfadjGroup01): {
	IsComplete: boolean;
	ErrorCode: string;
	StartPosY: number[];
	StartPosX: number;
	StartPosZ: number;
	ShelfThk: number;
	ModuleType: string;
	Color: string;
	GrainGroupId: string;
	DrillSettings?: ICT_tab_ShelfadjDrillSettings;
	DrillDistance: number;
	QtyDrills: number;
	Width: number;
	Depth: number;
	OffsetFront: number;
	OffsetBack: number;
} {
	
	//---------------Initialize return object-----------------------------------

	const ShelfadjInfo: {
		IsComplete: boolean;
		ErrorCode: string;
		StartPosY: number[];
		StartPosX: number;
		StartPosZ: number;
		ShelfThk: number;
		ModuleType: string;
		Color: string;
		GrainGroupId: string;
		DrillSettings?: ICT_tab_ShelfadjDrillSettings;
		DrillDistance: number;
		QtyDrills: number;
		Width: number;
		Depth: number;
		OffsetFront: number;
		OffsetBack: number;
	} = {
		IsComplete: false,
		ErrorCode: '',
		StartPosY: [],
		StartPosX: 0,
		StartPosZ: 0,
		ShelfThk: 0,
		ModuleType: '',
		Color: m.mod_ShelfadjColor,
		GrainGroupId: m.mod_ShelfadjColor_matrix.GrainGroupId,
		DrillSettings: undefined,
		DrillDistance: 0,
		QtyDrills: 0,
		Width: m.mod_Width,
		Depth: m.mod_Depth,
		OffsetFront: 0,
		OffsetBack: 0
	};
	
	//---------------Initialize variables---------------------------------------

	let descriptor = m.mod_ShelfadjDescriptor;
	let thickness = m.mod_ShelfadjThk;
	let design = m.mod_ShelfadjDesign;
	const width = m.mod_Width;
	const depth = m.mod_Depth;
	const height = m.mod_Height;


	//---------------Settings from tab_ShelfadjSettings--------------------------

	const shelfadjSettings = GlobalFunc.find_ShelfadjSettings(m.mod_CarcaseColor, m.mod_FrontDesign, m.mod_FrontProgram, design, width, depth, m.mod_ShelfadjPartParentName, m.mod_ShelfadjPartParentType);

	if (!shelfadjSettings) {
		return ShelfadjInfo;
	}

	//---------------Set module type and thickness------------------------------

	ShelfadjInfo.ModuleType = shelfadjSettings.ModuleType || design;
	design = ShelfadjInfo.ModuleType;
	ShelfadjInfo.ShelfThk = thickness > 0 ? thickness : shelfadjSettings.ShelfadjThk ?? 0;
	thickness = ShelfadjInfo.ShelfThk;

	//---------------Set shelf color--------------------------------------------

	let color = m.mod_ShelfadjColor;

	// Color = "Automatic", choose table entry
	if (color === 'Automatic') {
		color = shelfadjSettings.ShelfadjColor ?? '';
	}

	// Color = "LikeCarcaseColor", get color from carcase
	if (color === 'LikeCarcaseColor') {
		ShelfadjInfo.Color = m.mod_CarcaseColor;
		ShelfadjInfo.GrainGroupId = m.mod_CarcaseColor_matrix.GrainGroupId;
	}

	// Color = "Automatic" but not "LikeCarcaseColor", choose table entry
	else if (m.mod_ShelfadjColor === 'Automatic' && shelfadjSettings.ShelfadjColor) {
		ShelfadjInfo.Color = shelfadjSettings.ShelfadjColor;
		ShelfadjInfo.GrainGroupId = shelfadjSettings.GrainGroupId ?? '';
	}

	//---------------Settings from tab_ShelfadjQtyPosSettings-------------------

	// Call table tab_ShelfadjQtyPosSettings
	const qtyPosSettings = GlobalFunc.find_ShelfadjQtyPosSettings(m.mod_TypeElement, m.mod_ShelfadjPartParentName, m.mod_ShelfadjPartParentType, height, depth);

	if (!qtyPosSettings) {
		return ShelfadjInfo;
	}

	// Get descriptor from table if no explicit descriptor is set
	if (descriptor == '') {
		descriptor = qtyPosSettings.DescriptorPosY ?? '';
	}

	//---------------Calculate shelf positions----------------------------------

	// Calculate quantities and usable height
	const adjustableShelfCount = descriptor.split('_').length - 1;
	const totalShelfThickness = adjustableShelfCount * thickness;
	const usableHeight = Math.max(0, height - totalShelfThickness);

	// Process  the descriptor
	const descriptorPositions = descriptor !== 'N/a' && descriptor !== 'N/A' ? GlobalFunc.process_Descriptor(descriptor, usableHeight) : [];

	ShelfadjInfo.StartPosY = descriptorPositions.map(
		(position, index) => Number((position + thickness * index).toFixed(1))
	);

	//---------------Settings from tab_ShelfadjDrillSettings--------------------	

	// Call table tab_ShelfadjDrillSettings
	let drillSettings = GlobalFunc.find_ShelfadjDrillSettings(m.mod_TypeElement,m.mod_ShelfadjPartParentName, m.mod_ShelfadjPartParentType, m.mod_VertDividerType, design, thickness, width, depth);

	if (!drillSettings) {
		return ShelfadjInfo;
	}

	ShelfadjInfo.DrillSettings = drillSettings;

	//---------------Set drilling quantity and distance-------------------------

	// Manage the quantity of drills
	ShelfadjInfo.QtyDrills = m.mod_ShelfadjDrillType === "Automatic"
		? drillSettings?.ShelfadjDrillType ?? 0
		: m.mod_ShelfadjDrillType_matrix.NumberDrillings;

	// Manage the drill distance
	ShelfadjInfo.DrillDistance = m.mod_ShelfadjDrillDistance > 0
		? m.mod_ShelfadjDrillDistance
		: drillSettings?.ShelfadjDrillDistance ?? 0;

	//---------------Set dimensions and positions-------------------------------	

	// Set the dimensions and positions X and Z
	const offsetFront = drillSettings?.ShelfadjOffsetFront(m) ?? 0;
	const offsetBack = drillSettings?.ShelfadjOffsetBack(m) ?? 0;
	const widthReduction = drillSettings?.ShelfadjWidthReduction ?? 0;

	ShelfadjInfo.StartPosX = widthReduction / 2;
	ShelfadjInfo.StartPosZ = drillSettings?.ShelfadjOffsetBack(m) ?? 0;
	ShelfadjInfo.Width = width - widthReduction;
	ShelfadjInfo.Depth = depth - offsetFront - offsetBack;
	ShelfadjInfo.OffsetFront = offsetFront;
	ShelfadjInfo.OffsetBack = offsetBack;

	//---------------Result is complete-----------------------------------------

	ShelfadjInfo.IsComplete = true;
	return ShelfadjInfo;
}