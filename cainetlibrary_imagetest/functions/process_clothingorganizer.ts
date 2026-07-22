process_ClothingOrganizer(m: any): {
  IsComplete: boolean;
  HasExtraItem: boolean;

  BoardInfo: {
    Width: number;
    Depth: number;
    Thickness: number;
	PosX: number;
    PosY: number;
    PosZ: number;
    Color: string;
  };

  Hardware: {
	BomId: string;	
	Graphics: {
		DimX: number;
		DimY: number;
		DimZ: number;
		PosX: number;
		PosY: number;
		PosZ: number;
		Color: string | null;
		Model3D: unknown | null;
	}[];
  };

  Processing: {
		Side: 'Left' | 'Right' | 'Top' | 'Bottom';
		RefPosX: number;
		RefPosY: number;
		RefPosZ: number;
		ProcessingId: string;
  }[]
}{

  // -------------------- Initialize --------------------

  const createDefaultResult = () => ({
	IsComplete: false,
	HasExtraItem: false,

	BoardInfo: {
		Width: 0,
		Depth: 0,
		Thickness: 0,
		PosX: 0,
		PosY: 0,
		PosZ: 0,
		Color: '',
	},

	Hardware: {
		BomId: '',
		Graphics: [] as {
		DimX: number;
		DimY: number;
		DimZ: number;
		PosX: number;
		PosY: number;
		PosZ: number;
		Color: string | null;
		Model3D: unknown | null;
		}[],
	},

	Processing: [] as {
		Side: 'Left' | 'Right' | 'Top' | 'Bottom';
		RefPosX: number;
		RefPosY: number;
		RefPosZ: number;
		ProcessingId: string;
	}[],
  });

	const clothingOrganizerInfo = createDefaultResult();

	
	//--------------- Early return to exit the function if type or Design are None ---------------
	if (m.mod_ClothingOrganizerType === "None" || m.mod_ClothingOrganizerDesign === "None") {
		return clothingOrganizerInfo;
	}

	//--------------- Check if carcase clear dimensions fit to lift dimensions ---------------
	//--------------- Implementation missing using the right insertation point in height for checking if there is enough space------------ 
	const carcaseClearWidth = m.mod_Width;
	const carcaseClearDepth = m.mod_Depth;
	const carcaseClearHeight = m.mod_Height;

	const clothingOrganizerDimensions = GlobalFunc.find_ClothingOrganizerInstallationDimensions(m.mod_ClothingOrganizerDesign);

	if (!clothingOrganizerDimensions) {
	  return clothingOrganizerInfo;
	}

	const organizerMinWidth = clothingOrganizerDimensions?.ClothingOrganizerInstallationMinWidth ?? 0;
	const organizerMaxWidth = clothingOrganizerDimensions?.ClothingOrganizerInstallationMaxWidth ?? 0;
	const organizerMinDepth = clothingOrganizerDimensions?.ClothingOrganizerInstallationMinDepth ?? 0;
	const organizerMinHeight = clothingOrganizerDimensions?.ClothingOrganizerInstallationMinHeight ?? 0;


	if (organizerMinWidth > carcaseClearWidth ||
		organizerMaxWidth < carcaseClearWidth ||
		organizerMinDepth > carcaseClearDepth ||
		organizerMinHeight > carcaseClearHeight) {
		return clothingOrganizerInfo;
	}


	
  try {
    //--------------- Manage the colors -----------------------------------
    
	// Default we take the color from the attribute
	let elementColor = m.mod_ClothingOrganizerColor;

	// If the user selected 'Automatic' we search in the table
    if (elementColor === 'Automatic') {
	  const mappedColor = GlobalFunc.find_ClothingOrganizerColorMapping(m.mod_HardwareColor, m.mod_ClothingOrganizerType, m.mod_ClothingOrganizerDesign);
      elementColor = mappedColor?.MappedColor ?? 'None';
    }

	//--------------- Get the positionZ of hardware -----------------------------------

	let positionZ = 0;
	const descriptorAttribute = m.mod_ClothingOrganizerDepthPosition;
	const positionSettings = GlobalFunc.find_ClothingOrganizerDepthPosition(m.mod_ClothingOrganizerType, m.mod_ClothingOrganizerDesign);
		
	const descriptor = descriptorAttribute && descriptorAttribute !== '' ? descriptorAttribute : positionSettings?.DescriptorDepthPosition;

	if (descriptor) {
		const descriptorResult = GlobalFunc.process_Descriptor(descriptor, m.mod_Depth);
		positionZ = descriptorResult?.[0] ?? 0;
	}

	

  //--------------- 3D data for hardware -----------------------------------

	// Retrieve the hardwareId
	const hardwareMapping = GlobalFunc.find_ClothingOrganizerMapping(m.mod_ClothingOrganizerType, m.mod_ClothingOrganizerDesign, elementColor, m.mod_ClothingOrganizerConnectionPosition);
		if (!hardwareMapping) {
			throw new Error('No clothing organizer mapping found.');	
		}


	// Retrieve the Id's for BOM / Processing / Graphic
	const objectMapping = GlobalFunc.find_ObjectMapping(hardwareMapping.Object!);
	if (!objectMapping) {
		throw new Error('No object mapping found for clothing organizer.');
	}


	// Retrieve the graphic data
	const graphicLibraryEntries = GlobalFunc.find_GraphicLibraryMapping(objectMapping.GraphicItem!);
	if (!graphicLibraryEntries || graphicLibraryEntries.length === 0) {
		throw new Error('No graphic library entries found for clothing organizer.');
	}

	for (const graphicLibraryEntry of graphicLibraryEntries) {

		// Retrieve the data from the tables incl. guard
		const [graphicInfo, fileInfo] = GlobalFunc.process_GraphicLibraryData(graphicLibraryEntry.Model3DGroupName!);
		if (!graphicInfo || !fileInfo) {
			throw new Error('No graphic data found for clothing organizer.');
		}

		// Check if DimX of 3DModel is bigger then the clearWidthMax, then Downscale the Model
		let model3DWidth = 0
		const model3DGraphicDimensionX = graphicInfo.DimensionX

		if (model3DGraphicDimensionX > m.mod_Width) {
			model3DWidth = m.mod_Width - ((graphicInfo.PartOffsetX ?? 0) * 2);
		} else if (model3DGraphicDimensionX < 0){
			model3DWidth = 0;
		} else if (model3DGraphicDimensionX >= 0 && model3DGraphicDimensionX <= m.mod_Width){
			model3DWidth = graphicInfo.DimensionX;
		}

		// Set Position of 3DModel based on Clothing Organizer Connection Position

		let model3D_XPos = 0;

		if (m.mod_ClothingOrganizerConnectionPosition === 'Right') {
			model3D_XPos = (m.mod_Width - model3DWidth - (graphicInfo.PartOffsetX ?? 0))
		} else if (m.mod_ClothingOrganizerConnectionPosition === 'Left') {
			model3D_XPos = (graphicInfo.PartOffsetX ?? 0)
		} else if (m.mod_ClothingOrganizerConnectionPosition === 'Left&Right') {
			model3D_XPos = ((graphicInfo.PartOffsetX ?? 0) * 2)
		}

		let model3D_YPos = 0;
		if (m.mod_ClothingOrganizerHeightPosition) {
			model3D_YPos = m.mod_ClothingOrganizerHeightPosition + graphicInfo.InsertionPointY
		} else {
			model3D_YPos = graphicInfo.InsertionPointY
		}

		

		// Set the valid data to the returned object
		clothingOrganizerInfo.Hardware.Graphics.push({
			Model3D: fileInfo.Model3D ?? null,
			DimX: model3DWidth,
			DimY: graphicInfo.DimensionY ?? 0,
			DimZ: graphicInfo.DimensionZ ?? 0,
			PosX: model3D_XPos,
			//PosY: m.mod_ClothingOrganizerHeightPosition,
			PosY: model3D_YPos,
			PosZ: positionZ,
			Color: graphicInfo.ColorId ?? '',
		});
		

		//--------------- Processings and BOM ----------------------------------

		// Add all the needed processings (Call the helper)
		const processings = createProcessingsForGraphic(m, graphicInfo, objectMapping.ProcessingItem ?? '', model3D_YPos/*m.mod_ClothingOrganizerHeightPosition*/, positionZ);
		clothingOrganizerInfo.Processing.push(...processings);
	}

	// Add the BOM id
	clothingOrganizerInfo.Hardware.BomId = objectMapping.HardwareItem ?? '';
  }

  //--------------- Catch the errors ----------------------------------

  catch (error) {

	let text = '';
	if (error instanceof Error) {
		text = error.message;
	} 
	else if (typeof error === 'string') {
		text = error;
	}

	const errorMessage = GlobalFunc.find_ErrorList('Error 40011', 1);
	logError(errorMessage.Message(text));
	return clothingOrganizerInfo;
  }

  //--------------- Return the data -----------------------------------

  clothingOrganizerInfo.IsComplete = true;
  return clothingOrganizerInfo;

  	//--------------- Processing helper ----------------------------------
	function createProcessingsForGraphic(m: any, graphicInfo: any, processingId: string, heightPos: number, depthPos: number): {
		Side: 'Left' | 'Right' | 'Top' | 'Bottom';
		RefPosX: number;
		RefPosY: number;
		RefPosZ: number;
		ProcessingId: string;
	}[] {

		// Create the return object, but empty
		const result: {
			Side: 'Left' | 'Right' | 'Top' | 'Bottom';
			RefPosX: number;
			RefPosY: number;
			RefPosZ: number;
			ProcessingId: string;
		}[] = [];

		// Read the connection side
		const drillSide = m.mod_ClothingOrganizerConnectionPosition;
		// Hardware which touches left and right sidepanel
		if (drillSide === 'Left&Right' && graphicInfo.Identifier === 'ClothingOrganizer_LR') {
			result.push({
			Side: 'Left',
			RefPosX: 0,
			RefPosY: (graphicInfo.InsertionPointY ?? 0) + heightPos,
			RefPosZ: (graphicInfo.InsertionPointZ ?? 0) + depthPos,
			ProcessingId: processingId,
			});

			result.push({
			Side: 'Right',
			RefPosX: m.mod_Width,
			RefPosY: (graphicInfo.InsertionPointY ?? 0) + heightPos,
			RefPosZ: (graphicInfo.InsertionPointZ ?? 0) + depthPos,
			ProcessingId: processingId,
			});
		}

		// Return the result
		return result;
	}
}