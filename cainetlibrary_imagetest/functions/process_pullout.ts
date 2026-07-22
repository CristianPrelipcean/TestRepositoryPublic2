process_Pullout(m:IFuncParents_mc_PulloutHardware01) { 
		// Interfaces
	interface PulloutData {
		Basket: Object3D;
		Slide: Object3D;
		ColorId?: undefined;
		EdgeTypeFront: string;
		EdgeTypeBack: string;
		EdgeTypeLeft: string;
		EdgeTypeRight: string;
		EdgeJointType: string;
		EdgeJointFrontLeft: string;
		EdgeColor: string;
		BoardColor: string;
		BoardGrainId: string;
		Grain: string;
		ProcessingId: string;
		HardwareId: string;
		HardwareId2: string;
		HardwareId3: string;
		HardwareId4: string;
	}

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

	function create3DObject(): Object3D{
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
	


	//Initialize return object
	const processedPullout: PulloutData = {
		Basket: create3DObject(),
		Slide: create3DObject(),
		ColorId: undefined,
		EdgeTypeFront: 'None',
		EdgeTypeBack: 'None',
		EdgeTypeLeft: 'None',
		EdgeTypeRight: 'None',
		EdgeJointType: 'None',
		EdgeJointFrontLeft: 'None',
		EdgeColor: 'None',
		BoardColor: 'None',
		BoardGrainId: 'NoGrain',
		Grain: 'None',
		ProcessingId: 'None',
		HardwareId: 'None',
		HardwareId2: 'None',
		HardwareId3: 'None',
		HardwareId4: 'None',

	}

	let pulloutColor = '';

	//Pullout Color Mapping
	if (m.mod_PulloutElementColor == 'Automatic') {
		pulloutColor = GlobalFunc.find_PulloutElementColorMapping(m.mod_PulloutElementColor, m.mod_PulloutType, m.mod_PulloutDesign).PullOutColor!;
	}
	else {
		pulloutColor = m.mod_PulloutElementColor;
		processedPullout.EdgeColor =  m.mod_PulloutElementColor;
		processedPullout.BoardColor = m.mod_PulloutElementColor;

	}

	let dbObject = GlobalFunc.find_PulloutMapping(m.mod_PulloutType, m.mod_PulloutDesign, pulloutColor, m.mod_PulloutConnectionPosition, m.mod_OpeningType);


	try {
		if (!dbObject) {
			return undefined;
		}
		const dbObjectMapping = GlobalFunc.find_ObjectMapping(dbObject.Object!);

		// graphic item processing
		let retGraphicMapping = GlobalFunc.find_GraphicLibraryMapping(dbObjectMapping.GraphicItem!);
		retGraphicMapping.forEach((Item) => {
			let [retGraphicLib, graphicFile] = GlobalFunc.process_GraphicLibraryData(Item.Model3DGroupName!);
			if (retGraphicLib && graphicFile) {

				if(retGraphicLib.Identifier == 'Basket'){
					
					processedPullout.Basket.Model3D = graphicFile.Model3D;
					processedPullout.Basket.Color = retGraphicLib.ColorId!;
					processedPullout.Basket.DimX = retGraphicLib.DimensionX!;
					processedPullout.Basket.DimY = retGraphicLib.DimensionY!;
					processedPullout.Basket.DimZ = retGraphicLib.DimensionZ!;
					processedPullout.Basket.PosX = retGraphicLib.InsertionPointX!;
					processedPullout.Basket.PosY = retGraphicLib.InsertionPointY!;
					processedPullout.Basket.PosZ = retGraphicLib.InsertionPointZ!;
				}
				else if(retGraphicLib.Identifier == 'Slides'){
					processedPullout.Slide.Model3D = graphicFile.Model3D;
					processedPullout.Slide.Color = retGraphicLib.ColorId!;
					processedPullout.Slide.DimX = retGraphicLib.DimensionX!;
					processedPullout.Slide.DimY = retGraphicLib.DimensionY!;
					processedPullout.Slide.DimZ = retGraphicLib.DimensionZ!;
					processedPullout.Slide.PosX = retGraphicLib.InsertionPointX!;
					processedPullout.Slide.PosY = retGraphicLib.InsertionPointY!;
					processedPullout.Slide.PosZ = retGraphicLib.InsertionPointZ!;
				}

			} else throw new Error('No Graphic Found');
		});
	// HardwareElements
		processedPullout.HardwareId = dbObjectMapping.HardwareItem!;
		// Drillingelements
		processedPullout.ProcessingId = dbObjectMapping.ProcessingItem!;

	} catch {
		return processedPullout;
	}

	return processedPullout;

}
