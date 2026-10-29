process_Hinge(m: parent, iFrontOverlay: any) {

	//---------------Initialize output variable---------------------------
	interface IHingeData {
		HingeType?: string;
		Descriptor?: string;
		MountingPlateType?: string;
		MountingPlateHeight?: string;
		CarcaseFrontAngle?: number;
		FrontOverlay?: number;
		DrillingDistance?: number;
		FrontHardwareItem?: string;
		FrontProcessingItem?: string;
		FrontGraphic?: string;
		CarcaseHardwareItem?: string;
		CarcaseProcessingItem?: string;
		CarcaseGraphic?: string;
		HingeGapCarcase?: number;
		OpeningAngle?: number;
	}

	let HingeData: IHingeData = {
		HingeType: undefined,
		Descriptor: undefined,
		MountingPlateType: undefined,
		MountingPlateHeight: undefined,
		CarcaseFrontAngle: undefined,
		FrontOverlay: undefined,
		DrillingDistance: undefined,
		FrontHardwareItem: undefined,
		FrontProcessingItem: undefined,
		FrontGraphic: undefined,
		CarcaseHardwareItem: undefined,
		CarcaseProcessingItem: undefined,
		CarcaseGraphic: undefined,
		HingeGapCarcase: undefined,
		OpeningAngle: undefined
	};

	// Get the Information of the Carcase Parts Info
	let carcasePartInfo = JSON.parse(m.mod_CarcasePartInfo[0]);

	// Get the Information of the Frontconstruction
	let retFrontConstruction = JSON.parse(m.mod_Information);
	//========================================================================
	// Hinge positioning
	//========================================================================
	
	//---------------Calculate Hingeposition in height----------------

	if(m.mod_HingeLogic_matrix.HingePositioning == 'Custom')
	{	
		//=====================================
		// Call user exit for customization
		//=====================================
		
		// Call the user exit
		let retValUe = GlobalFunc.ue_HingePositioning(m);
	
		// Set the Output values
		HingeData.Descriptor = retValUe.Descriptor;
	}
	else if (m.mod_HingeLogic_matrix.HingePositioning == 'Automatic')
	{
		//=====================================
		// Standard Library Solution
		//=====================================
		
		// Get data from table HingePosition
		let retHingePos: any;
		if (m.mod_ModuleName == 'mc_Door01')
		{
			retHingePos= GlobalFunc.find_HingePosition(m.mod_TypeElement, retFrontConstruction.retFrontConstruction.FrontConstructionId, 'All', 'All', m.mod_FrontHeight, m.mod_FrontWidth, 0, m.mod_FingergripTopType, m.mod_FingergripBtmType, m.mod_HandleDesign, m.mod_HandlePosLogic); ////////////////////////////////// CALCULATION OF WEIGHT PENDING!!!!!!!!!
		}
		else if (m.mod_ModuleName == 'mc_Fliplift01')
		{
			retHingePos= GlobalFunc.find_HingePosition(m.mod_TypeElement,retFrontConstruction.retFrontConstruction.FrontConstructionId, m.mod_FlipliftType, m.mod_FlipliftHardwareType, m.mod_FrontHeight, m.mod_FrontWidth, 0, m.mod_FingergripTopType, m.mod_FingergripBtmType, m.mod_HandleDesign, m.mod_HandlePosLogic); ////////////////////////////////// CALCULATION OF WEIGHT PENDING!!!!!!!!!
		}
	
		// Set the Output values
		HingeData.Descriptor = retHingePos.Descriptor!;
	}
	else { // m.mod_HingeLogic_matrix.HingePositioning == 'Manual'
		HingeData.Descriptor = 'ManualPosition';
	}
		
	//---------------Calculate FrontOverlay---------------------------

	let FrontOverlay: number = 0;
	let FrontAngle: number = 0;

	if (m.mod_ModuleName == 'mc_Door01')
	{
		if (m.mod_DoorDirection == 'Left'){
			FrontOverlay = iFrontOverlay.Left;
			FrontAngle = carcasePartInfo.VerticalPartsFrontAngle[0];
		}
		else if (m.mod_DoorDirection == 'Right'){
			FrontOverlay = iFrontOverlay.Right;
			FrontAngle = carcasePartInfo.VerticalPartsFrontAngle[1];
		}
	}
	else if (m.mod_ModuleName == 'mc_Fliplift01')
	{
		if (m.mod_FrontType == 'FlipliftDown'){
			FrontOverlay = iFrontOverlay.Bottom;
			FrontAngle = carcasePartInfo.HorizontalPartsFrontAngle[0];
		}
		else if (m.mod_FrontType == 'FlipliftUp'){
			FrontOverlay = iFrontOverlay.Top;
			FrontAngle = carcasePartInfo.HorizontalPartsFrontAngle[1];
		}
	}

	//========================================================================
	// Hinge Selection
	//========================================================================
		
	if(m.mod_HingeLogic_matrix.HingeSelection == 'Custom'){
		
		//=====================================
		// Call user exit for customization
		//=====================================
	
		// Call the user exit
		let retValUe = GlobalFunc.ue_HingeSelection(m, iFrontOverlay);
	
		// Set the Output values
		HingeData.HingeType = retValUe.HingeType!;
		HingeData.MountingPlateType = retValUe.MountingPlateType!;
		HingeData.MountingPlateHeight = retValUe.MountingPlateHeight!;
		HingeData.CarcaseFrontAngle = retValUe.CarcaseFrontAngle;
		HingeData.FrontOverlay = retValUe.FrontOverlay;
		HingeData.DrillingDistance = retValUe.DrillingDistance;
		HingeData.FrontHardwareItem = retValUe.FrontHardwareItem;
		HingeData.FrontProcessingItem = retValUe.FrontProcessingItem;
		HingeData.FrontGraphic = retValUe.FrontGraphic;
		HingeData.CarcaseHardwareItem = retValUe.CarcaseHardwareItem;
		HingeData.CarcaseProcessingItem = retValUe.CarcaseProcessingItem;
		HingeData.CarcaseGraphic = retValUe.CarcaseGraphic;
		HingeData.HingeGapCarcase=retValUe.HingeGapCarcase!;
		HingeData.OpeningAngle=retValUe.OpeningAngle!;
	}
	else if (m.mod_HingeLogic_matrix.HingeSelection == 'Automatic')
	{
		//=====================================
		// Standard Library Solution
		//=====================================

		try {
			//---------------Get data from table HingeSettings---------------------------

			let hingeSettings: any;
			if (m.mod_ModuleName == 'mc_Door01') {
				hingeSettings = GlobalFunc.find_HingeSettings(m.mod_TypeElement, 'Doors', 'All', 'All', retFrontConstruction.retFrontConstruction.FrontConstructionId, m.mod_FrontThk, FrontAngle, m.mod_InteriorEquipmentHinge);
			}
			else if (m.mod_ModuleName == 'mc_Fliplift01') {
				hingeSettings = GlobalFunc.find_HingeSettings(m.mod_TypeElement, m.mod_FrontType, m.mod_FlipliftType, m.mod_FlipliftHardwareType, retFrontConstruction.retFrontConstruction.FrontConstructionId, m.mod_FrontThk, FrontAngle, m.mod_InteriorEquipmentHinge);
			}
		
			//---------------Get data from table DrillingDistance---------------------------
			let hingeDrillingDistance = GlobalFunc.find_HingeDrillingDistance(hingeSettings.HingeType!,FrontOverlay,hingeSettings.HingeDrillingsType!);

			if (hingeDrillingDistance === undefined){
				throw new Error('Incomplete hinge data!'); 
			}

			let drillDistance = 0;
			if(hingeDrillingDistance.in_DrillingDistanceType == 'CalculationBasedMin')
			{
			drillDistance = FrontOverlay - hingeDrillingDistance.in_FrontOverlayMin! + hingeDrillingDistance.DrillingDistance!;
			}
			else if(hingeDrillingDistance.in_DrillingDistanceType == 'CalculationBasedMax')
			{
			drillDistance = hingeDrillingDistance.DrillingDistance! - hingeDrillingDistance.in_FrontOverlayMax! + FrontOverlay;
			}
			else //(hingeDrillingDistance.in_DrillingDistanceType == 'Fixed')
			{
			drillDistance = hingeDrillingDistance.DrillingDistance!;
			}

			//---------------Get data from table HingeMapping---------------------------
			let hingeMapping = GlobalFunc.find_HingeMapping(hingeSettings.HingeType!,hingeDrillingDistance.Application!, hingeSettings.MountingPlateType!, hingeDrillingDistance.MountingPlateHeight!,m.mod_OpeningType,m.mod_HingeColor);
			
			//---------------Get Graphics data for Front and Carcase---------------------------
			let hingeFront = GlobalFunc.calc_HardwareObjectInfo(hingeMapping.ObjectFront!);
			let hingeCarcase = GlobalFunc.calc_HardwareObjectInfo(hingeMapping.ObjectCarcase!);

			//---------------Set output values---------------------------
			HingeData.HingeType = hingeSettings.HingeType!;
			HingeData.MountingPlateType = hingeSettings.MountingPlateType!;
			HingeData.MountingPlateHeight = hingeDrillingDistance.MountingPlateHeight!;
			HingeData.CarcaseFrontAngle = FrontAngle;
			HingeData.FrontOverlay = FrontOverlay;
			HingeData.DrillingDistance = drillDistance;
			HingeData.FrontHardwareItem = hingeFront.HardwareItem;
			HingeData.FrontProcessingItem = hingeFront.ProcessingItem;
			HingeData.FrontGraphic=hingeFront.Graphics;
			HingeData.CarcaseHardwareItem = hingeCarcase.HardwareItem;
			HingeData.CarcaseProcessingItem = hingeCarcase.ProcessingItem;
			HingeData.CarcaseGraphic=hingeCarcase.Graphics;
			HingeData.HingeGapCarcase=hingeMapping.HingeFrontGapCarcase!;
			HingeData.OpeningAngle=hingeMapping.OpeningAngle!;
		}
		catch (error: any) {
			// We don't need to output the error here. It will be done in the module.
			// logError('process_Hinge: ' + error.message);
			return undefined;
		}			
	}
	else //m.mod_HingeLogic_matrix.HingeSelection == 'Manual'
	{
		//---------------Get data from table DrillingDistance---------------------------
		let hingeDrillingDistance = GlobalFunc.find_HingeDrillingDistance(m.mod_HingeType!,FrontOverlay,m.mod_HingeType_matrix.DrillingDistanceType!);
		let drillDistance = 0;
		if(hingeDrillingDistance.in_DrillingDistanceType == 'CalculationBasedMin')
		{
		drillDistance = FrontOverlay - hingeDrillingDistance.in_FrontOverlayMin! + hingeDrillingDistance.DrillingDistance!;
		}
		else if(hingeDrillingDistance.in_DrillingDistanceType == 'CalculationBasedMax')
		{
		drillDistance = hingeDrillingDistance.DrillingDistance! - hingeDrillingDistance.in_FrontOverlayMax! + FrontOverlay;
		}
		else //(hingeDrillingDistance.in_DrillingDistanceType == 'Fixed')
		{
		drillDistance = hingeDrillingDistance.DrillingDistance!;
		}

		//---------------Get data from table HingeMapping---------------------------
		let hingeMapping = GlobalFunc.find_HingeMapping(m.mod_HingeType!,hingeDrillingDistance.Application!, m.mod_MountingPlateType!, hingeDrillingDistance.MountingPlateHeight!,m.mod_OpeningType,m.mod_HingeColor);

		//---------------Get Data related with HardwareItem, Processings and Graphics---------------------------
		let hingeFront = GlobalFunc.calc_HardwareObjectInfo(hingeMapping.ObjectFront!);
		let hingeCarcase = GlobalFunc.calc_HardwareObjectInfo(hingeMapping.ObjectCarcase!);

		//---------------Set output values---------------------------
		HingeData.HingeType = m.mod_HingeType!;
		HingeData.MountingPlateType = m.mod_MountingPlateType!;
		HingeData.MountingPlateHeight = hingeDrillingDistance.MountingPlateHeight!;
		HingeData.CarcaseFrontAngle = FrontAngle;
		HingeData.FrontOverlay = FrontOverlay;
		HingeData.DrillingDistance = drillDistance;
		HingeData.FrontHardwareItem = hingeFront.HardwareItem;
		HingeData.FrontProcessingItem = hingeFront.ProcessingItem;
		HingeData.FrontGraphic=hingeFront.Graphics;
		HingeData.CarcaseHardwareItem = hingeCarcase.HardwareItem;
		HingeData.CarcaseProcessingItem = hingeCarcase.ProcessingItem;
		HingeData.CarcaseGraphic=hingeCarcase.Graphics;	
		HingeData.HingeGapCarcase=hingeMapping.HingeFrontGapCarcase!;
		HingeData.OpeningAngle=hingeMapping.OpeningAngle!;	
	}
	
	
	return HingeData;

}