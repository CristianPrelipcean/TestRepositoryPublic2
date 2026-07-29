process_Drawerbox(m: IFuncParents_mc_DrawerBox01) {

	// Interface for the sections
	interface Section3D {
		Model3D?: any;
		ColorId?: string;
		DimX: number;
		DimY: number;
		DimZ: number;
		PosX: number;
		PosY: number;
		PosZ: number;
		arrPosX: number[];
		BoxProcessingId: string;
		BoxHardwareId: string;
		ConProcessingId: string;
		ConHardwareId: string;
		BotConProcessingId: string;
		BotConHardwareId: string
	}

	// Interface for the Boardsections
	interface SectionBoard {
		DimX: number;
		DimY: number;
		DimZ: number;
		PosX: number;
		PosY: number;
		PosZ: number;
		EdgeTypeFront: string;
		EdgeTypeBack: string;
		EdgeTypeLeft: string;
		EdgeTypeRight: string;			
		EdgeTypeJoint: string;
		EdgeColor: string;
		BoardColor: string;
		BoardGrainId: string;
		Grain: string;
		ProcessingId: string;
		HardwareId: string
	}

	// Function to set the attributes
	function setValuesSection3D(): Section3D {
		let updatedSection: Section3D = {
			Model3D: undefined,
			ColorId: 'None',
			DimX: 0,
			DimY: 0,
			DimZ: 0,
			PosX: 0,
			PosY: 0,
			PosZ: 0,
			arrPosX: [],
			BoxProcessingId: 'None',
			BoxHardwareId: 'None',
			ConProcessingId: 'None',
			ConHardwareId: 'None',
			BotConProcessingId: 'None',
			BotConHardwareId: 'None'
		};
		return updatedSection;
	}

	// Function to set the attributes
	function setValuesSectionBoard(): SectionBoard {
		let updatedSection: SectionBoard = {
			DimX: 0,
			DimY: 0,
			DimZ: 0,
			PosX: 0,
			PosY: 0,
			PosZ: 0,
			EdgeTypeFront: 'None',
			EdgeTypeBack: 'None',
			EdgeTypeLeft: 'None',
			EdgeTypeRight: 'None',			
			EdgeTypeJoint: 'None',
			EdgeColor: 'None',
			BoardColor: 'None',
			BoardGrainId: 'NoGrain',
			Grain: 'None',
			ProcessingId: 'None',
			HardwareId: 'None'
		};
		return updatedSection;
	}
	
	// Interface for the return object
	interface DrawerBoxInfo {
		SideLeft: Section3D;
		SideRight: Section3D;
		SlideLeft: Section3D;
		SlideRight: Section3D;
		BottomShelf: SectionBoard;
		Backwall: SectionBoard;
		DrillArea: Section3D;
		BomElement: Section3D;
		BottomShelfConnector: Section3D;
		Synchronization: Section3D
	}
	
	// Initialize the object
	let retDrawerBoxInfo: DrawerBoxInfo = {
		SideLeft: setValuesSection3D(),
		SideRight: setValuesSection3D(),
		SlideLeft: setValuesSection3D(),
		SlideRight: setValuesSection3D(),
		BottomShelf: setValuesSectionBoard(),
		Backwall: setValuesSectionBoard(),
		DrillArea: setValuesSection3D(),
		BomElement: setValuesSection3D(),
		BottomShelfConnector: setValuesSection3D(),
		Synchronization: setValuesSection3D()
	}
	
	// Variables
	let dbHeight= '';
	let dbDepth= '';
	let dbWeight= '';
	let dbColor = '';
	let dbSideDepth = 0;

	//========================================================================
	// Call user exit for customization
	//========================================================================

	if(m.mod_DrawerBoxLogic == 'Custom'){

	}

	//========================================================================
	// Standard Library Solution
	//========================================================================

	else{

		//---------------Data from tables or attributes---------------

		// Calculate color of the box
		if (m.mod_DrawerBoxColor == 'Automatic'){
			dbColor = GlobalFunc.find_DrawerBoxColorMapping(m.mod_HardwareColor).DrawerBoxColor!;
		}
		else{
			dbColor = m.mod_DrawerBoxColor;
		}

		// Calculate depth of the box
		let DimensionInfo = GlobalFunc.find_DrawerBoxDimensionMapping(m.mod_DrawerBoxDesign, m.mod_DrawerBoxProgram, dbColor, m.mod_Depth, m.mod_Height)
		if (m.mod_DrawerBoxDepthType == 'Automatic'){ 
			dbDepth = DimensionInfo.DepthType!;
		}
		else{
			dbDepth = m.mod_DrawerBoxDepthType;
		}

		// Calculate height of the box
		if (m.mod_DrawerBoxHeightType == 'Automatic'){ 
			dbHeight = DimensionInfo.HeightType!;
		}
		else{
			dbHeight = m.mod_DrawerBoxHeightType;
		}
		
		// Calculate weight of the box
		if (m.mod_DrawerBoxWeightType == 'Automatic'){
			dbWeight = GlobalFunc.find_DrawerBoxWeightTypeSettings( m.mod_TypeElement, m.mod_FrontWidth, m.mod_FrontHeight, dbDepth, dbHeight, m.mod_PartgroupDrawerWeight).DrawerBoxWeightType!;
		}
		else{
			dbWeight = m.mod_DrawerBoxWeightType;
		}
		
		//---------------Mapping and reading data from tables---------------

		// DrawerBoxMapping
		let dbObject = GlobalFunc.find_DrawerBoxMapping(m.mod_DrawerBoxDesign, m.mod_DrawerBoxProgram, dbColor, dbDepth, dbHeight, dbWeight, m.mod_OpeningType);

		// DrawerBox Construction
		let dbConstruction = GlobalFunc.find_DrawerBoxConstruction(dbObject.ConstructionId!)
		let dbDistanceSide = (m.mod_Width - dbConstruction.ObjWidth(m.mod_Width))/2;

		// Bottom Shelf
		retDrawerBoxInfo.BottomShelf.DimX=dbConstruction.BotShelfWidth(m.mod_Width);
		retDrawerBoxInfo.BottomShelf.DimY=dbConstruction.BotShelfThickness;
		retDrawerBoxInfo.BottomShelf.DimZ=dbConstruction.BotShelfDepthBwWood;
		retDrawerBoxInfo.BottomShelf.PosX=-dbConstruction.BotShelfWidth(m.mod_Width)/2;
		retDrawerBoxInfo.BottomShelf.PosY=dbConstruction.BotShelfPosHeight;
		retDrawerBoxInfo.BottomShelf.PosZ=-dbConstruction.BotShelfDepthBwWood;

		let dbBoardInfo = GlobalFunc.find_DrawerBoxColorMappingBoardInfo(dbColor);
		retDrawerBoxInfo.BottomShelf.EdgeTypeFront=dbBoardInfo.EdgeTypeShelfFront!;
		retDrawerBoxInfo.BottomShelf.EdgeTypeBack=dbBoardInfo.EdgeTypeShelfBack!;
		retDrawerBoxInfo.BottomShelf.EdgeTypeLeft=dbBoardInfo.EdgeTypeShelfLeft!;
		retDrawerBoxInfo.BottomShelf.EdgeTypeRight=dbBoardInfo.EdgeTypeShelfRight!;		
		retDrawerBoxInfo.BottomShelf.EdgeTypeJoint=dbBoardInfo.EdgeJointTypeShelf!;
		retDrawerBoxInfo.BottomShelf.EdgeColor=dbBoardInfo.DrawerBoxBoardColor!;
		retDrawerBoxInfo.BottomShelf.BoardColor = dbBoardInfo.DrawerBoxBoardColor!;
		retDrawerBoxInfo.BottomShelf.BoardGrainId = dbBoardInfo.DrawerBoxGrainGroupId!;
		retDrawerBoxInfo.BottomShelf.Grain='Horizontal';

		// Backwall
		retDrawerBoxInfo.Backwall.DimX=dbConstruction.BackwallWidth(m.mod_Width);
		retDrawerBoxInfo.Backwall.DimY=dbConstruction.BackwallHeight;
		retDrawerBoxInfo.Backwall.DimZ=dbConstruction.BackwallThickness;
		retDrawerBoxInfo.Backwall.PosX=-dbConstruction.BackwallWidth(m.mod_Width)/2;
		retDrawerBoxInfo.Backwall.PosY=dbConstruction.BackwallPosHeight;
		retDrawerBoxInfo.Backwall.PosZ=-dbConstruction.BackwallPosDepth;

		retDrawerBoxInfo.Backwall.EdgeTypeFront=dbBoardInfo.EdgeTypeBackwallFront!;
		retDrawerBoxInfo.Backwall.EdgeTypeBack=dbBoardInfo.EdgeTypeBackwallBack!;
		retDrawerBoxInfo.Backwall.EdgeTypeLeft=dbBoardInfo.EdgeTypeBackwallLeft!;
		retDrawerBoxInfo.Backwall.EdgeTypeRight=dbBoardInfo.EdgeTypeBackwallRight!;		
		retDrawerBoxInfo.Backwall.EdgeTypeJoint=dbBoardInfo.EdgeJointTypeBackwall!;
		retDrawerBoxInfo.Backwall.EdgeColor=dbBoardInfo.DrawerBoxBoardColor!;
		retDrawerBoxInfo.Backwall.BoardColor = dbBoardInfo.DrawerBoxBoardColor!;
		retDrawerBoxInfo.Backwall.BoardGrainId = dbBoardInfo.DrawerBoxGrainGroupId!;
		retDrawerBoxInfo.Backwall.Grain='Horizontal';
		retDrawerBoxInfo.Backwall.ProcessingId='Processing_Legrabox_Backwall_' + dbHeight;

		// DrillArea
		retDrawerBoxInfo.DrillArea.DimX=m.mod_Width;
		retDrawerBoxInfo.DrillArea.DimY=dbConstruction.BlockSpaceHeight;
		retDrawerBoxInfo.DrillArea.DimZ=dbConstruction.BlockSpaceDepth;
		retDrawerBoxInfo.DrillArea.PosX=-m.mod_Width/2;
		retDrawerBoxInfo.DrillArea.PosY=dbConstruction.BlockSpacePosHeight;
		retDrawerBoxInfo.DrillArea.PosZ=-dbConstruction.BlockSpaceDepth;

		// BomElement
		retDrawerBoxInfo.BomElement.DimX=m.mod_Width;
		retDrawerBoxInfo.BomElement.DimY=dbConstruction.BlockSpaceHeight;
		retDrawerBoxInfo.BomElement.DimZ=dbConstruction.BlockSpaceDepth;
		retDrawerBoxInfo.BomElement.PosX=-m.mod_Width/2;
		retDrawerBoxInfo.BomElement.PosY=dbConstruction.BlockSpacePosHeight;
		retDrawerBoxInfo.BomElement.PosZ=-dbConstruction.BlockSpaceDepth;

		// ObjectMapping
		const dbObjectMapping = GlobalFunc.find_ObjectMapping(dbObject.ObjectBox!)
		const dbObjectMappingCon = GlobalFunc.find_ObjectMapping(dbObject.ObjectFrontConnector!)

		// GraphicLibrary
		let retGraphicMapping = GlobalFunc.find_GraphicLibraryMapping(dbObjectMapping.GraphicItem!);

		retGraphicMapping.forEach((Item) => {
			let [retGraphicLib, graphicFile] = GlobalFunc.process_GraphicLibraryData(Item.Model3DGroupName!);

			if (retGraphicLib && graphicFile) {
				// Left Side
				if (retGraphicLib.Identifier == 'BoxLeft') {
					retDrawerBoxInfo.SideLeft.Model3D = graphicFile.Model3D;
					retDrawerBoxInfo.SideLeft.ColorId = retGraphicLib.ColorId;
					retDrawerBoxInfo.SideLeft.DimX = retGraphicLib.DimensionX;
					retDrawerBoxInfo.SideLeft.DimY = retGraphicLib.DimensionY;
					retDrawerBoxInfo.SideLeft.DimZ = retGraphicLib.DimensionZ;
					retDrawerBoxInfo.SideLeft.PosZ = -retGraphicLib.DimensionZ;
					retDrawerBoxInfo.SideLeft.PosY = dbConstruction.ObjPosHeight;
					retDrawerBoxInfo.SideLeft.PosX = -m.mod_Width / 2 + dbDistanceSide;
					dbSideDepth = retGraphicLib.DimensionZ;
				}

				// Right Side
				if (retGraphicLib.Identifier == 'BoxRight') {
					retDrawerBoxInfo.SideRight.Model3D = graphicFile.Model3D;
					retDrawerBoxInfo.SideRight.ColorId = retGraphicLib.ColorId;
					retDrawerBoxInfo.SideRight.DimX = retGraphicLib.DimensionX;
					retDrawerBoxInfo.SideRight.DimY = retGraphicLib.DimensionY;
					retDrawerBoxInfo.SideRight.DimZ = retGraphicLib.DimensionZ;
					retDrawerBoxInfo.SideRight.PosZ = -retGraphicLib.DimensionZ;
					retDrawerBoxInfo.SideRight.PosY = dbConstruction.ObjPosHeight;
					retDrawerBoxInfo.SideRight.PosX = m.mod_Width / 2 - dbDistanceSide - retGraphicLib.DimensionX;
				}

				// Left drawer slide
				if (retGraphicLib.Identifier == 'SlideLeft') {
					retDrawerBoxInfo.SlideLeft.Model3D = graphicFile.Model3D;
					retDrawerBoxInfo.SlideLeft.ColorId = retGraphicLib.ColorId;
					retDrawerBoxInfo.SlideLeft.DimX = retGraphicLib.DimensionX;
					retDrawerBoxInfo.SlideLeft.DimY = retGraphicLib.DimensionY;
					retDrawerBoxInfo.SlideLeft.DimZ = retGraphicLib.DimensionZ;
					retDrawerBoxInfo.SlideLeft.PosX = -m.mod_Width / 2;
					retDrawerBoxInfo.SlideLeft.PosY = dbConstruction.ObjPosHeight + dbConstruction.SlidePosHeight;
					retDrawerBoxInfo.SlideLeft.PosZ = -retGraphicLib.DimensionZ - dbConstruction.SlidePosDepth;
				}

				// Right drawer slide
				if (retGraphicLib.Identifier == 'SlideRight') {
					retDrawerBoxInfo.SlideRight.Model3D = graphicFile.Model3D;
					retDrawerBoxInfo.SlideRight.ColorId = retGraphicLib.ColorId;
					retDrawerBoxInfo.SlideRight.DimX = retGraphicLib.DimensionX;
					retDrawerBoxInfo.SlideRight.DimY = retGraphicLib.DimensionY;
					retDrawerBoxInfo.SlideRight.DimZ = retGraphicLib.DimensionZ;
					retDrawerBoxInfo.SlideRight.PosX = m.mod_Width / 2 - retGraphicLib.DimensionX;
					retDrawerBoxInfo.SlideRight.PosY = dbConstruction.ObjPosHeight + dbConstruction.SlidePosHeight;
					retDrawerBoxInfo.SlideRight.PosZ = -retGraphicLib.DimensionZ - dbConstruction.SlidePosDepth;
				}			
			}
		});
		
		// HardwareLibrary
		retDrawerBoxInfo.BomElement.BoxHardwareId=dbObjectMapping.HardwareItem!;
		retDrawerBoxInfo.BomElement.ConHardwareId=dbObjectMappingCon.HardwareItem!;

		// DrillingLibrary
		retDrawerBoxInfo.DrillArea.BoxProcessingId=dbObjectMapping.ProcessingItem!;
		retDrawerBoxInfo.DrillArea.ConProcessingId=dbObjectMappingCon.ProcessingItem!;

		//---------------Drawer Box Extra Items---------------

		// Read the table tab_DrawerBoxExtraItemSettings
		let ExtraItems = GlobalFunc.find_DrawerBoxExtraItemSettings(m.mod_FrontProgram, m.mod_OpeningType, m.mod_Width, m.mod_Depth);
		let BotShelfCon = 'None';
		let BotShelfDescriptor = 'None';
		let SynchroUnit = 'None';

		ExtraItems.forEach(ExtraItem => {
			if (ExtraItem.FrontToBottomConnectorId !== 'None' && ExtraItem.FrontToBottomConnectorId !== null) {
				BotShelfCon = ExtraItem.FrontToBottomConnectorId!;
				BotShelfDescriptor = ExtraItem.FrontToBottomConnectorDescriptor!;
			}
			if (ExtraItem.SyncronizationId !== 'None' && ExtraItem.SyncronizationId !== null) {
				SynchroUnit = ExtraItem.SyncronizationId!;
			}
		});

		// Bottom shelf connector
		if(BotShelfCon != 'None'){

			// Process the descriptor to get the positions of the connectors
			let Positions = GlobalFunc.process_Descriptor(BotShelfDescriptor!, m.mod_Width)
			Positions.forEach(Position => {
				retDrawerBoxInfo.BottomShelfConnector.arrPosX.push(Math.round(Position));
			});

			// ObjectMapping
			let ObjectMapping = GlobalFunc.find_ObjectMapping(BotShelfCon)

			// GraphicLibrary
			retGraphicMapping = GlobalFunc.find_GraphicLibraryMapping(ObjectMapping.GraphicItem!);
			retGraphicMapping.forEach((Item) => {
				let [retGraphicLib, graphicFile] = GlobalFunc.process_GraphicLibraryData(Item.Model3DGroupName!);

				if (retGraphicLib && graphicFile) {
					retDrawerBoxInfo.BottomShelfConnector.Model3D = graphicFile.Model3D;
					retDrawerBoxInfo.BottomShelfConnector.ColorId = retGraphicLib.ColorId;
					retDrawerBoxInfo.BottomShelfConnector.DimX = retGraphicLib.DimensionX;
					retDrawerBoxInfo.BottomShelfConnector.DimY = retGraphicLib.DimensionY;
					retDrawerBoxInfo.BottomShelfConnector.DimZ = retGraphicLib.DimensionZ + retGraphicLib.PartOffsetZ;
					retDrawerBoxInfo.BottomShelfConnector.PosX = -retGraphicLib.DimensionX / 2;
					retDrawerBoxInfo.BottomShelfConnector.PosY = dbConstruction.BotShelfPosHeight - retGraphicLib.DimensionY;
					retDrawerBoxInfo.BottomShelfConnector.PosZ = -retGraphicLib.DimensionZ;
				}
			});

			// HardwareLibrary
			retDrawerBoxInfo.BottomShelfConnector.BotConHardwareId = ObjectMapping.HardwareItem!;

			// DrillingLibrary
			retDrawerBoxInfo.BottomShelfConnector.BotConProcessingId = ObjectMapping.ProcessingItem!;
		}

		// Synchronization unit
		if(SynchroUnit != 'None'){

			// ObjectMapping
			let ObjectMapping = GlobalFunc.find_ObjectMapping(SynchroUnit)

			// GraphicLibrary
			retGraphicMapping = GlobalFunc.find_GraphicLibraryMapping(ObjectMapping.GraphicItem!);
			retGraphicMapping.forEach((Item) => {
				let [retGraphicLib, graphicFile] = GlobalFunc.process_GraphicLibraryData(Item.Model3DGroupName!);

				if (retGraphicLib && graphicFile) {
					if (retGraphicLib.Identifier == "DrawerBoxSynchroBar") {
						retDrawerBoxInfo.Synchronization.Model3D = graphicFile.Model3D;
						retDrawerBoxInfo.Synchronization.ColorId = retGraphicLib.ColorId;
						retDrawerBoxInfo.Synchronization.DimX = m.mod_Width + retGraphicLib.PartOffsetX;
						retDrawerBoxInfo.Synchronization.DimY = retGraphicLib.DimensionY;
						retDrawerBoxInfo.Synchronization.DimZ = retGraphicLib.DimensionZ;
						retDrawerBoxInfo.Synchronization.PosX = -(m.mod_Width + retGraphicLib.PartOffsetX) / 2;
						retDrawerBoxInfo.Synchronization.PosY = retGraphicLib.InsertionPointY;
						retDrawerBoxInfo.Synchronization.PosZ = retGraphicLib.InsertionPointZ;
					}
					else {
						retDrawerBoxInfo.Synchronization.Model3D = graphicFile.Model3D;
						retDrawerBoxInfo.Synchronization.ColorId = retGraphicLib.ColorId;
						retDrawerBoxInfo.Synchronization.DimX = m.mod_Width + retGraphicLib.PartOffsetX;
						retDrawerBoxInfo.Synchronization.DimY = retGraphicLib.DimensionY;
						retDrawerBoxInfo.Synchronization.DimZ = dbSideDepth + retGraphicLib.PartOffsetZ;
						retDrawerBoxInfo.Synchronization.PosX = -(m.mod_Width + retGraphicLib.PartOffsetX) / 2;
						retDrawerBoxInfo.Synchronization.PosY = retGraphicLib.InsertionPointY;
						retDrawerBoxInfo.Synchronization.PosZ = -dbSideDepth - retGraphicLib.PartOffsetZ;
					}
				}
			});

			// HardwareLibrary
			retDrawerBoxInfo.Synchronization.ConHardwareId = ObjectMapping.HardwareItem!;

			// DrillingLibrary
			retDrawerBoxInfo.Synchronization.ConProcessingId = ObjectMapping.ProcessingItem!;
		}
	}

	//---------------Return data to the module---------------

	return retDrawerBoxInfo;
}