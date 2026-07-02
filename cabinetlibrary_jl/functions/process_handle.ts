process_Handle(m: IFuncParents_mc_Handle01) {

	// Interface for the handle data
	interface HandleData {
		Model3D?: any;
		Model3DGroupName: string;
		ColorId: string;
		Length: number,
		Depth: number,
		Thickness: number,
		Weight: number,
		Rotation: number;
		PosVertical: number;
		PosHorizontal: number;
		ProcessingId: string;
		HardwareId: string;
	}

	// Initialize the object
	let retHandle: HandleData = {
		Model3D: undefined,
		Model3DGroupName: "",
		ColorId: "",
		Length: 0,
		Depth: 0,
		Thickness: 0,
		Weight: 0,
		Rotation: 0,
		PosVertical: 0,
		PosHorizontal: 0,
		ProcessingId: "",
		HardwareId: ""
	}

	// Initialize internal variables
	let HandleLength = 0;
	let HandleRotation = 0;
	let HardwareInfo: ICT_tab_HardwareLibrary | undefined;
	let GraphicInfo: ICT_tab_GraphicLibrary | undefined;
	let GraphicFile: ICT_tab_GraphicFileLibrary | undefined;

	//========================================================================
	// Call user exit for customization
	//========================================================================

	if (m.mod_HandlePosLogic == 'Custom') {

		// Call the user exit
		let retValUe = GlobalFunc.ue_Handle(m);

		// Set the values
		retHandle.Model3D = retValUe.Model3D;
		retHandle.Model3DGroupName = retValUe.Model3DGroupName;
		retHandle.ColorId = retValUe.ColorId;
		retHandle.Length = retValUe.Length;
		retHandle.Depth = retValUe.Depth;
		retHandle.Thickness = retValUe.Thickness;
		retHandle.Weight = retValUe.Weight;
		retHandle.Rotation = retValUe.Rotation;
		retHandle.ProcessingId = retValUe.ProcessingId;
		retHandle.HardwareId = retValUe.HardwareId;
		retHandle.PosVertical = retValUe.PosVertical;
		retHandle.PosHorizontal = retValUe.PosHorizontal;

		// Return the values
		return retHandle;
	}

	//========================================================================
	// Standard Library Solution
	//========================================================================

	else {

		//---------------Find PartGroup from tab_PartSettings-----------------

		let retPartSettings = GlobalFunc.find_PartSettings(m.mod_FrontType, m.mod_PartInfo);
		let PartGroup = retPartSettings.PartGroup;
		let OpeningDirection = retPartSettings.OpeningDirection;

		//---------------Find position in tab_HandleSettings------------------

		let retHandleSetting = GlobalFunc.find_HandleSettings(m.mod_HandlePosType, PartGroup!);

		//---------------Define the column from HandlePosType-----------------

		let PosType = retHandleSetting.HandleOrientation;

		//---------------Calculate handle length------------------------------

		let retHandleConstruction = ct_tab_HandleConstruction.find(p => p.in_FrontType == PartGroup && p.in_PosType == PosType);
		if (retHandleConstruction == undefined) {
			logError('Can not find entry in table tab_HandleConstruction for:' + PartGroup + ' - ' + PosType);
		}
		else {
			HandleRotation = retHandleConstruction?.Rotation ?? 0;
			if (OpeningDirection === "Right" && HandleRotation !== 0 && HandleRotation !== 180) {
				HandleRotation = (HandleRotation + 180) % 360;
			}
		}

		if (m.mod_HandleDesign_matrix.HandleLength == 'Attribute') {
			HandleLength = m.mod_HandleLength
		}
		else if (m.mod_HandleDesign_matrix.HandleLength == 'FrontDimension') {
			if (HandleRotation == 0) {
				let retHandleLen = GlobalFunc.find_HandleLengthMapping(m.mod_HandleDesign, m.mod_Width)
				HandleLength = retHandleLen.HandleLength
			}
			else {
				let retHandleLen = GlobalFunc.find_HandleLengthMapping(m.mod_HandleDesign, m.mod_Height)
				HandleLength = retHandleLen.HandleLength
			}
		}

		//---------------Handle mapping----------------------------------------

		let ColRelevant = false;
		let LenRelevant = false;

		if (m.mod_HandleDesign_matrix.HandleLength == 'Fixed') { LenRelevant = false }
		else if (m.mod_HandleDesign_matrix.HandleLength == 'Attribute') { LenRelevant = true }
		else if (m.mod_HandleDesign_matrix.HandleLength == 'FrontDimension') { LenRelevant = true }

		if (m.mod_HandleDesign_matrix.HandleColor == 'Attribute') { ColRelevant = true }
		else if (m.mod_HandleDesign_matrix.HandleColor == 'Fixed') { ColRelevant = false }

		let retHandleMapping = GlobalFunc.find_HandleMapping(m.mod_HandleDesign, m.mod_HandleColor, m.mod_HandlePosType, HandleLength!, LenRelevant, m.mod_HandleDesign_matrix.HandlePosTypeRelevant, ColRelevant);

		//---------------Mapping from tab_ObjectMapping-----------------------

		let retObjectMapping = GlobalFunc.find_ObjectMapping(retHandleMapping.Object!);

		//---------------Find data from tab_GraphicLibraryMapping-------------

		let retGraphicMapping = GlobalFunc.find_GraphicLibraryMapping(retObjectMapping.GraphicItem!);

		//---------------Find data from tab_GraphicLibrary--------------------

		if (retGraphicMapping.length > 0) {
			const firstItem = retGraphicMapping[0];
			[GraphicInfo, GraphicFile] = GlobalFunc.process_GraphicLibraryData(firstItem.Model3DGroupName!);

			if (retGraphicMapping.length > 1) {
				logError('There is more than 1 graphic item in the table tab_GraphicLibraryMapping for the handle! This was not expected!');
			}
		}

		//---------------Find data from tab_HardwareLibrary-------------------

		// Filter function to get all the hardware elements for the handle
		let HardwareElements = GlobalFunc.find_HardwareLibraryMapping(retObjectMapping.HardwareItem!);

		// Cycle to add all hardware elements to the BOM
		HardwareElements.forEach(info => {
			let HandleBOMInfo = GlobalFunc.find_HardwareLibrary(info.SupplierArticleNumber!, info.Supplier!);
			if (HandleBOMInfo.Category == 'Handle') {
				HardwareInfo = HandleBOMInfo;
			}
		});

		// Error message if there is no item found in the hardware library
		if (HardwareInfo == undefined) {
			logError('There is no handle found in the hardware library. Make sure that there is an item from category Handle.')
		}

		//---------------Calculate the DrillDistance--------------------------

		let minValue = 9999;
		let maxValue = 0;
		let processings = GlobalFunc.find_ProcessingMapping(retObjectMapping.ProcessingItem!);

		processings.forEach((processing) => {
			let drills = GlobalFunc.find_HardwareDrillVertLibrary(processing.ProcessingId!, 'Front');
			drills.forEach((drill) => {
				if (drill.XA < minValue) { minValue = drill.XA }
				if (drill.XA > maxValue) { maxValue = drill.XA }
			});
		});

		let DrillDistance = maxValue - minValue;

		//---------------Find sector for the handle---------------------------

		let SectorVert: string;
		let SectorHor: string;

		// Calculate HandleLine and height position of insertion
		let InsertionHeight = m.mod_HeightPosInsertion + m.mod_FrontPosStart;
		let tmpHandleLine = m.mod_HandleLine - InsertionHeight;

		// Via Attribut 
		if (m.mod_HandlePosLogic == 'Matrix') {
			SectorVert = m.mod_HandlePosMatrix_matrix.PosY;
			SectorHor = m.mod_HandlePosMatrix_matrix.PosX;
			tmpHandleLine = m.mod_Height / 2;
		}

		// Via HandleLine
		else if (m.mod_HandlePosLogic == 'HandleLine') {

			//---------------vertical sector

			if (PartGroup == 'Door') {
				if (PosType == 'HandleHorMiddle' || PosType == 'HandleHorMiddleInverse' || PosType == 'HandleVertMiddle' || PosType == 'HandleVertMiddleInverse') {
					SectorHor = 'Center'
				}
				else {
					SectorHor = OpeningDirection == 'Left' ? 'Right' : 'Left';
				}
			}
			else {
				SectorHor = 'Center'
			}

			//---------------horizontal sector

			// Exceptions for special PartGroups
			if (PartGroup == 'Drawer' || PartGroup == 'Dishwasher') {
				SectorVert = 'Up';
			}

			else if (PartGroup == 'Fliplift') {
				SectorVert = OpeningDirection == 'Down' ? 'Up' : 'Down';
			}

			// Standard setting the sector based on the handle line
			else {

				// Find handle position Up
				let retHandleUp = GlobalFunc.find_HandleConstruction(PartGroup!, SectorHor!, 'Up', PosType!, retHandleSetting.ReferencePointX!, retHandleSetting.ReferencePointY!)
				let tmpPosUp = retHandleUp.PosY1(m, retHandleSetting.DistanceY, HardwareInfo!.Length, HardwareInfo!.Thickness, DrillDistance, tmpHandleLine);

				// Find handle position Center
				let retHandleCenter = GlobalFunc.find_HandleConstruction(PartGroup!, SectorHor!, 'Center', PosType!, retHandleSetting.ReferencePointX!, retHandleSetting.ReferencePointY!)
				let tmpPosCenter = retHandleCenter.PosY1(m, retHandleSetting.DistanceY, HardwareInfo!.Length, HardwareInfo!.Thickness, DrillDistance, tmpHandleLine);

				// Find handle position Down
				let retHandleDown = GlobalFunc.find_HandleConstruction(PartGroup!, SectorHor!, 'Down', PosType!, retHandleSetting.ReferencePointX!, retHandleSetting.ReferencePointY!)
				let tmpPosDown = retHandleDown.PosY1(m, retHandleSetting.DistanceY, HardwareInfo!.Length, HardwareInfo!.Thickness, DrillDistance, tmpHandleLine);

				// Compare the positions and decide the sector
				if (tmpPosCenter < tmpPosDown) { SectorVert = 'Down'; }
				else if (tmpPosCenter > tmpPosUp) { SectorVert = 'Up'; }
				else { SectorVert = 'Center'; }
			}
		}

		//---------------Find information in tab_HandleConstruction-----------

		let retHandleConstr = GlobalFunc.find_HandleConstruction(PartGroup!, SectorHor!, SectorVert!, PosType!, retHandleSetting.ReferencePointX!, retHandleSetting.ReferencePointY!);

		//---------------Check if handle length fit to the front dimension----

		HandleLength = GraphicInfo?.DimensionX ?? 0;

		if (HandleRotation == 0 || HandleRotation == 180) {
			if (m.mod_Width <= HandleLength) {
				logError('The handle dimension is bigger than the front dimension!')
			}
		}
		else {
			if (m.mod_Height <= HandleLength) {
				logError('The handle dimension is bigger than the front dimension!')
			}
		}

		//---------------Return information to module-------------------------

		// Set the values
		retHandle.Model3D = GraphicFile?.Model3D;
		retHandle.Model3DGroupName = GraphicInfo?.in_Model3DGroupName ?? '';
		retHandle.ColorId = GraphicInfo?.ColorId ?? '';
		retHandle.Length = GraphicInfo?.DimensionX ?? 0;
		retHandle.Depth = GraphicInfo?.DimensionZ ?? 0;
		retHandle.Thickness = GraphicInfo?.DimensionY ?? 0;
		retHandle.Weight = HardwareInfo?.Weight ?? 0;
		retHandle.Rotation = HandleRotation ?? 0;
		retHandle.ProcessingId = retObjectMapping?.ProcessingItem ?? '';
		retHandle.HardwareId = retObjectMapping?.HardwareItem ?? '';
		retHandle.PosVertical = retHandleConstr?.PosX1?.(
			m,
			retHandleSetting?.DistanceX ?? 0,
			GraphicInfo?.DimensionX ?? 0,
			GraphicInfo?.DimensionY ?? 0,
			DrillDistance,
			tmpHandleLine
		) ?? 0;

		retHandle.PosHorizontal = retHandleConstr?.PosY1?.(
			m,
			retHandleSetting?.DistanceY ?? 0,
			GraphicInfo?.DimensionX ?? 0,
			GraphicInfo?.DimensionY ?? 0,
			DrillDistance,
			tmpHandleLine
		) ?? 0;

		return retHandle;
	}
}
