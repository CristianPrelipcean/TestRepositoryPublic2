process_MachiningInsertionHelper(tecConfigReferencePoint:string, Model3DGroupName:string):any{
	
	// Initialize Variables
	let retEntry: any = {
		InsertionPointX: 0,
		InsertionPointY: 0,
		InsertionPointZ: 0
		};

	//Get data from table GraphicsLibrary
	let graphicLib = this.find_GraphicLibrary(Model3DGroupName);
	let supplierRefPoint = graphicLib.ReferencePointXYZ!;

retEntry.GraphicLibrary = graphicLib;

	// Get ReferencePoints
	let tecConfigX = Number(tecConfigReferencePoint.substring(0,1));
	let tecConfigY = Number(tecConfigReferencePoint.substring(1,2));
	let tecConfigZ = Number(tecConfigReferencePoint.substring(2,3));
	
	let supplierX = Number(supplierRefPoint.substring(0,1));
	let supplierY = Number(supplierRefPoint.substring(1,2));
	let supplierZ = Number(supplierRefPoint.substring(2,3));
	
	//Calculate InsertionPointX
	switch (tecConfigX - supplierX)
	{
		case -2:
			retEntry.InsertionPointX = graphicLib.DimensionX + graphicLib.InsertionPointX;
			break;
		case -1:
			retEntry.InsertionPointX = graphicLib.DimensionX/2 + graphicLib.InsertionPointX;
			break;
		case 0:
			retEntry.InsertionPointX = 0 + graphicLib.InsertionPointX;
			break;
		case 1:
			retEntry.InsertionPointX = -graphicLib.DimensionX/2 + graphicLib.InsertionPointX;
			break;
		case 2:
			retEntry.InsertionPointX = -graphicLib.DimensionX + graphicLib.InsertionPointX;
			break;
	}

	//Calculate InsertionPointY
	switch (tecConfigY - supplierY)
	{
		case -2:
			retEntry.InsertionPointY = graphicLib.DimensionY + graphicLib.InsertionPointY;
			break;
		case -1:
			retEntry.InsertionPointY = graphicLib.DimensionY/2 + graphicLib.InsertionPointY;
			break;
		case 0:
			retEntry.InsertionPointY = 0 + graphicLib.InsertionPointY;
			break;
		case 1:
			retEntry.InsertionPointY = -graphicLib.DimensionY/2 + graphicLib.InsertionPointY;
			break;
		case 2:
			retEntry.InsertionPointY = -graphicLib.DimensionY + graphicLib.InsertionPointY;
			break;
	}

	//Calculate InsertionPointZ
	switch (tecConfigZ - supplierZ)
	{
		case -2:
			retEntry.InsertionPointZ = graphicLib.DimensionZ + graphicLib.InsertionPointZ;
			break;
		case -1:
			retEntry.InsertionPointZ = graphicLib.DimensionZ/2 + graphicLib.InsertionPointZ;
			break;
		case 0:
			retEntry.InsertionPointZ = 0 + graphicLib.InsertionPointZ;
			break;
		case 1:
			retEntry.InsertionPointZ = -graphicLib.DimensionZ/2 + graphicLib.InsertionPointZ;
			break;
		case 2:
			retEntry.InsertionPointZ = -graphicLib.DimensionZ + graphicLib.InsertionPointZ;
			break;
	}

	return retEntry!;
}