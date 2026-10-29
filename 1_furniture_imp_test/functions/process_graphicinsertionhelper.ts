process_GraphicInsertionHelper(ModuleReferencePoint:string, Model3DGroupName:string, DimensionX: number, DimensionY: number, DimensionZ: number):any{
	
	//--------------------Initialize Variables------------------------

	interface RetEntry {
		InsertionPointX: number;
		InsertionPointY: number;
		InsertionPointZ: number;
		OffsetX: number;
		OffsetY: number;
		OffsetZ: number;
		OversizeX: number;
		OversizeY: number;
		OversizeZ: number;
		DimensionX: number;
		DimensionY: number;
		DimensionZ: number;
		GraphicLibrary?: ICT_tab_GraphicLibrary;
	}

	const retEntry: RetEntry = {
		InsertionPointX: 0,
		InsertionPointY: 0,
		InsertionPointZ: 0,
		OffsetX: 0,
		OffsetY: 0,
		OffsetZ: 0,
		OversizeX: 0,
		OversizeY: 0,
		OversizeZ: 0,
		DimensionX: 0,
		DimensionY: 0,
		DimensionZ: 0,
		GraphicLibrary: undefined
	};

	//--------------------Get data from table GraphicsLibrary------------------------

	let graphicLib = GlobalFunc.find_GraphicLibrary(Model3DGroupName);

	//--------------------Check where the dimensions are coming from------------------------

	let DimX = (DimensionX <= 0) ? graphicLib.DimensionX : DimensionX;
	let DimY = (DimensionY <= 0) ? graphicLib.DimensionY : DimensionY;
	let DimZ = (DimensionZ <= 0) ? graphicLib.DimensionZ : DimensionZ;
	retEntry.GraphicLibrary = graphicLib;
	retEntry.DimensionX = DimX;
	retEntry.DimensionY = DimY;
	retEntry.DimensionZ = DimZ;

	//--------------------Handle the PartOffset------------------------

	// X-Offset
	if (graphicLib.PartOffsetX < 0){
		retEntry.OversizeX = graphicLib.PartOffsetX * -1;
		retEntry.OffsetX =  graphicLib.PartOffsetX;
	}
	else{
		retEntry.OversizeX = graphicLib.PartOffsetX;
	}

	// Y-Offset
	if (graphicLib.PartOffsetY < 0){
		retEntry.OversizeY = graphicLib.PartOffsetY * -1;
		retEntry.OffsetY =  graphicLib.PartOffsetY;
	}
	else{
		retEntry.OversizeY = graphicLib.PartOffsetY;
	}

	// Z-Offset
	if (graphicLib.PartOffsetZ < 0){
		retEntry.OversizeZ = graphicLib.PartOffsetZ * -1;
		retEntry.OffsetZ =  graphicLib.PartOffsetZ;
	}
	else{
		retEntry.OversizeZ = graphicLib.PartOffsetZ;
	}

	//--------------------Calculate InsertionPointX------------------------

	if (ModuleReferencePoint.substring(0,1) == "0") 
	{
		retEntry.InsertionPointX = 0;
	}
	else if (ModuleReferencePoint.substring(0,1) == "1")
	{
		retEntry.InsertionPointX = -DimX/2;
	}
	else if (ModuleReferencePoint.substring(0,1) == "2")
	{
		retEntry.InsertionPointX = -DimX;
	}

	//--------------------Calculate InsertionPointY------------------------

	if (ModuleReferencePoint.substring(1,2) == "0") 
	{
		retEntry.InsertionPointY = 0;
	}
	else if (ModuleReferencePoint.substring(1,2) == "1")
	{
		retEntry.InsertionPointY = -DimY/2;
	}
	else if (ModuleReferencePoint.substring(1,2) == "2")
	{
		retEntry.InsertionPointY = -DimY;
	}

	//--------------------Calculate InsertionPointZ------------------------

	if (ModuleReferencePoint.substring(2,3) == "0") 
	{
		retEntry.InsertionPointZ = 0;
	}
	else if (ModuleReferencePoint.substring(2,3) == "1")
	{
		retEntry.InsertionPointZ = -DimZ/2;
	}
	else if (ModuleReferencePoint.substring(2,3) == "2")
	{
		retEntry.InsertionPointZ = -DimZ;
	}

	//--------------------Return the value------------------------

	return retEntry!;
}