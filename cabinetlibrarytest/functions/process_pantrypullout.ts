process_PantryPullout(m: any, fsWidth: number, fsHeight: number, fsDepth: number): any {

	// Interface for 3D-Data
	interface Object3D {
		DimX: number;
		DimY: number;
		DimZ: number;
		PosX: number;
		PosY: number;
		PosZ: number;
		Model3D?: any;
		Color: string;
	}

	// Interface for the pantry pullout info
	interface PantryPulloutInfo {
		Frame: Object3D;
		SlideTop: Object3D;
		SlideBtm: Object3D;
		ConnectorTop: Object3D;
		ConnectorBtm: Object3D;
		ListBaskets: Object3D[];
		FixedShelfRequired: boolean;
		SpaceHeight: number;
		BomIdFrame: string;
		BomIdBasket: string;
		BasketQty: number;
		DrillId: string;
	}
	
	// Function to initialize the 3D-object
	function createObject3D(): Object3D {
		return {
			DimX: 0,
			DimY: 0,
			DimZ: 0,
			PosX: 0,
			PosY: 0,
			PosZ: 0,
			Model3D: undefined,	
			Color: '',		
		};
	}

	// Initialize return object
	const ppoInfo: PantryPulloutInfo = {
		Frame: createObject3D(),
		SlideTop: createObject3D(),
		SlideBtm: createObject3D(),
		ConnectorTop: createObject3D(),
		ConnectorBtm: createObject3D(),
		ListBaskets: [],
		FixedShelfRequired: false,
		SpaceHeight: 0,
		BomIdFrame: '',
		BomIdBasket: '',
		BasketQty: 0,
		DrillId: '',
	};

	// Variables
	let ppoColor = '';


	try {
		//---------------Manage the color-----------------------------------

		// Calculate color of the box
		if (m.mod_PantryPulloutColor == 'Automatic'){
			ppoColor = GlobalFunc.find_PantryPulloutColorMapping(m.mod_PantryPulloutType, m.mod_PantryPulloutDesign, m.mod_HardwareColor).PantryPulloutColor ?? 'None';
		}
		else {
			ppoColor = m.mod_PantryPulloutColor;
		}
		
		//---------------Mapping the pantryPullout--------------------------

		const ppoMapping = GlobalFunc.find_PantryPulloutMapping(m.mod_PantryPulloutType, m.mod_PantryPulloutDesign, ppoColor, fsWidth, fsDepth, fsHeight);
		if (!ppoMapping) {
			throw new Error('Pantry Pullout mapping not found');
		}

		//---------------Get the construction data--------------------------

		// Retrieve the construction data
		const ppoConstruction = GlobalFunc.find_PantryPulloutConstruction(ppoMapping.ConstructionId!);
		if (!ppoConstruction) {
			throw new Error('Pantry Pullout construction not found');
		}

		// Determine available height and whether a fixed shelf must be inserted
		const spaceHeight = Math.min(fsHeight, ppoConstruction.HardwareSpaceHeight!);
		const fixedShelf  = fsHeight > ppoConstruction.HardwareSpaceHeight!;
		ppoInfo.SpaceHeight = spaceHeight;
		ppoInfo.FixedShelfRequired = fixedShelf;

		// Basket positions
		const basketPositionList = GlobalFunc.process_Descriptor(ppoConstruction.BasketDescriptor!, spaceHeight);
		const qtyBaskets = basketPositionList.length;

		//---------------Run the hardware process---------------------------

		// Object mapping
		const frameObject = GlobalFunc.find_ObjectMapping(ppoMapping.ObjectFrame!);
		const basketObject = GlobalFunc.find_ObjectMapping(ppoMapping.ObjectBasket!);
		if(!frameObject || !basketObject) {
			throw new Error('Pantry Pullout object mapping not found');	
		}
		
		// BOM-Data and NC-Data
		ppoInfo.DrillId = frameObject.ProcessingItem!;
		ppoInfo.BomIdFrame = frameObject.HardwareItem!;
		ppoInfo.BomIdBasket = basketObject.HardwareItem!;
		ppoInfo.BasketQty = qtyBaskets;

		// 3D-Data for frame
		const frame3D = GlobalFunc.find_GraphicLibraryMapping(frameObject.GraphicItem!);
		frame3D.forEach((Item) => {

			const [GraphicInfo, FileInfo] = GlobalFunc.process_GraphicLibraryData(Item.Model3DGroupName!);
			if (!GraphicInfo || !FileInfo) {
				throw new Error('No graphic info found for pantry pullout frame');	
			}

			// Bottom slide
			if(GraphicInfo.Identifier === 'SlideBtm') {
				ppoInfo.SlideBtm.DimX = GraphicInfo.DimensionX!;
				ppoInfo.SlideBtm.DimY = GraphicInfo.DimensionY!;
				ppoInfo.SlideBtm.DimZ = GraphicInfo.DimensionZ!;				
				ppoInfo.SlideBtm.PosX = -GraphicInfo.DimensionX! / 2;
				ppoInfo.SlideBtm.PosY = 0;
				ppoInfo.SlideBtm.PosZ = -GraphicInfo.DimensionZ! - ppoConstruction.SlidePosDepth - m.mod_FrontGapCarcase;
				ppoInfo.SlideBtm.Model3D = FileInfo.Model3D;
				ppoInfo.SlideBtm.Color = GraphicInfo.ColorId!;
			}

			// Top slide
			if(GraphicInfo.Identifier === 'SlideTop') {
				ppoInfo.SlideTop.DimX = GraphicInfo.DimensionX!;
				ppoInfo.SlideTop.DimY = GraphicInfo.DimensionY!;
				ppoInfo.SlideTop.DimZ = GraphicInfo.DimensionZ!;				
				ppoInfo.SlideTop.PosX = -GraphicInfo.DimensionX! / 2;
				ppoInfo.SlideTop.PosY = spaceHeight - GraphicInfo.DimensionY!;
				ppoInfo.SlideTop.PosZ = -GraphicInfo.DimensionZ! - ppoConstruction.SlidePosDepth - m.mod_FrontGapCarcase;
				ppoInfo.SlideTop.Model3D = FileInfo.Model3D;
				ppoInfo.SlideTop.Color = GraphicInfo.ColorId!;
			}

			// Top connector
			if(GraphicInfo.Identifier === 'ConnectorTop') {	
				ppoInfo.ConnectorTop.DimX = GraphicInfo.DimensionX!;
				ppoInfo.ConnectorTop.DimY = GraphicInfo.DimensionY!;
				ppoInfo.ConnectorTop.DimZ = GraphicInfo.DimensionZ!;
				ppoInfo.ConnectorTop.PosX = -GraphicInfo.DimensionX! / 2;
				ppoInfo.ConnectorTop.PosY = spaceHeight - GraphicInfo.DimensionY! - ppoConstruction.ConnectorTopPosHeight;
				ppoInfo.ConnectorTop.PosZ = -GraphicInfo.DimensionZ!;	
				ppoInfo.ConnectorTop.Model3D = FileInfo.Model3D;
				ppoInfo.ConnectorTop.Color = GraphicInfo.ColorId!;
			}

			// Bottom connector
			if(GraphicInfo.Identifier === 'ConnectorBtm') {
				ppoInfo.ConnectorBtm.DimX = GraphicInfo.DimensionX!;
				ppoInfo.ConnectorBtm.DimY = GraphicInfo.DimensionY!;
				ppoInfo.ConnectorBtm.DimZ = GraphicInfo.DimensionZ!;				
				ppoInfo.ConnectorBtm.PosX = -GraphicInfo.DimensionX! / 2;
				ppoInfo.ConnectorBtm.PosY = ppoConstruction.ConnectorBtmPosHeight!;
				ppoInfo.ConnectorBtm.PosZ = -GraphicInfo.DimensionZ!;
				ppoInfo.ConnectorBtm.Model3D = FileInfo.Model3D;
				ppoInfo.ConnectorBtm.Color = GraphicInfo.ColorId!;
			}

			// Frame
			if(GraphicInfo.Identifier === 'Frame') {
				ppoInfo.Frame.DimX = GraphicInfo.DimensionX!;
				ppoInfo.Frame.DimY = spaceHeight - ppoConstruction.FrameReductionHeight!;
				ppoInfo.Frame.DimZ = GraphicInfo.DimensionZ!;				
				ppoInfo.Frame.PosX = -GraphicInfo.DimensionX! / 2;
				ppoInfo.Frame.PosY = ppoConstruction.FramePosHeight!;
				ppoInfo.Frame.PosZ = -GraphicInfo.DimensionZ!;
				ppoInfo.Frame.Model3D = FileInfo.Model3D;
				ppoInfo.Frame.Color = GraphicInfo.ColorId!;
			}
		});

		
		// 3D-Data for baskets
		const basket3D = GlobalFunc.find_GraphicLibraryMapping(basketObject.GraphicItem!);
		const [basketGraphicInfo, basektFileInfo] = GlobalFunc.process_GraphicLibraryData(basket3D[0].Model3DGroupName!);
		for (let i = 0; i < qtyBaskets; i++) {
			if(basketGraphicInfo && basektFileInfo && basketGraphicInfo.Identifier === 'Basket') {
				const basketObj: Object3D = createObject3D();
				basketObj.DimX = basketGraphicInfo.DimensionX!;
				basketObj.DimY = basketGraphicInfo.DimensionY!;
				basketObj.DimZ = basketGraphicInfo.DimensionZ!;				
				basketObj.PosX = -basketGraphicInfo.DimensionX! / 2;
				basketObj.PosY = basketPositionList[i];
				basketObj.PosZ = -basketGraphicInfo.DimensionZ!;
				basketObj.Model3D = basektFileInfo.Model3D;
				basketObj.Color = basketGraphicInfo.ColorId!;
				ppoInfo.ListBaskets.push(basketObj);
			}
		}
	} 

	//---------------Error handling-------------------------------------

	catch (error) {
		let Text = '';
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 40010',1)
		logError(ErrorMessage.Message(Text));
		return ppoInfo;
	}

	//---------------Return data to the module--------------------------
	return ppoInfo;
}