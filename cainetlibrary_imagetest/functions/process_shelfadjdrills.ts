process_ShelfadjDrills(obj: any) {

	//---------------Variables---------------------------
	let drillData: any;
	let drilling: any;
	let insertionpoint: any = {
		X: 0,
		Y: 0,
		Z: 0
		};

	// Only if there is an object
	if (obj !== 'N/a') {

		//---------------Return drilling information---------------------------

		// Retrieve the ProcessingId
		let objDrill = GlobalFunc.find_ObjectMapping(obj);
		let ProcessingItems = GlobalFunc.find_ProcessingMapping(objDrill.ProcessingItem!);
		ProcessingItems.forEach(drill => {
		drilling = drill;
		});

		// Process the drills and return the drill information
		let DrillLib = GlobalFunc.find_HardwareDrillVertLibrary(drilling.ProcessingId, 'Side')    
		DrillLib.forEach((drill) => {
		drillData = drill;
		});

		//---------------Return the insertion point---------------------------

		let GraphicItems = GlobalFunc.find_GraphicLibraryMapping(objDrill.GraphicItem!);
		GraphicItems.forEach(item =>{
		let grapicItem = GlobalFunc.find_GraphicLibrary(item.Model3DGroupName!);
		insertionpoint.X = grapicItem.InsertionPointX;
		insertionpoint.Y = grapicItem.InsertionPointY;
		insertionpoint.Z = grapicItem.InsertionPointZ;
		})	  
	}

	//---------------Return the values---------------------------

	let drillInfos: any = {};
	drillInfos.drill = drillData;
	drillInfos.insertionPoint = insertionpoint;
	return drillInfos;

}