ncout_LegDrill(elem: any, partSelf: any, part2: any, posRel: any){

	//--------------------Get data for drillings and rotation------------------------

	let drillings: any[] = [];
	let drills: any[] = [];
	let processings = GlobalFunc.find_ProcessingMapping(part2.pa_ProcessingId);
	let InsertionInfo = GlobalFunc.process_MachiningInsertionHelper('121',part2.pa_Model3DGroupName)
	let insertionX = 0;
	let insertionZ = 0;

	// Convert the insertion point
	insertionX = InsertionInfo.InsertionPointX;
	insertionZ = InsertionInfo.InsertionPointZ; 

	// Find alle the entries in the drilling table
	processings.forEach((processing) => {
	drills = GlobalFunc.find_HardwareDrillVertLibrary(processing.ProcessingId!, 'Shelf');
	drills.forEach((drill) => {
		drillings.push(drill);
	});
	});

	let rotation = part2.pa_Rotation;

	//--------------------For each drilling (insert the drillings)------------------------

	drillings.forEach(x => {

		// Calculate the position
		let posX:number;
		let posY:number;
		if (rotation == 0){
			posX = posRel.x + insertionX + x.XA;
			posY = posRel.z + insertionZ + x.YA;
		}
		else if (rotation == 180){
			posX = posRel.x - insertionX - x.XA;
			posY = posRel.z - insertionZ - x.YA;
		}
		else if (rotation == 90){
			posX = posRel.x - insertionX - x.XA;
			posY = posRel.z + insertionZ + x.YA;
		}
		else if (rotation == 270){
			posX = posRel.x + insertionX + x.XA;
			posY = posRel.z - insertionZ - x.YA;
		}
		else{
			posX = 0;
			posY = 0;
		}
		
		// Calculate the drilling depth
		let drillDepth = (x.TI <= 0) ? partSelf._dimy : x.TI;

		// Add Vertical Drill
		let DrillVert = elem.addncout_DrillVert();
		DrillVert.nc_TOOL="102";
		DrillVert.nc_XA=posX;
		DrillVert.nc_YA=partSelf._dimz - posY;
		DrillVert.nc_TI=drillDepth;
		DrillVert.nc_DU=x.DU;

		DrillVert.nc_BM = x.matrix_BM || "LS"
		DrillVert.nc_WI = x.matrix_WI ?? 0;
		DrillVert.nc_AB = x.matrix_AB ?? 1;
		DrillVert.nc_LA = x.matrix_LA ?? 0;
		DrillVert.nc_MI = x.matrix_MI ?? 0;
		DrillVert.nc_KO = x.matrix_KO || "00";
		DrillVert.nc_Side = "Btm";

		// Add drawing
		let drilling01 = partSelf.add3DElement('Drilling01', DrillVert, posX, 0, posY, x.DU, drillDepth, x.DU );
		drilling01.extrude('<svg><circle cx="' + 0 + '" cy="' + 0 + '" r="' + x.DU/2 + '" /></svg>', 'y');
	})
}