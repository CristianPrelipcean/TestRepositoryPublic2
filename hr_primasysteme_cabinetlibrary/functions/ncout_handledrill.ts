ncout_HandleDrill(elem: any, partSelf: any, part2: any, posRel: any){

	//--------------------Get data for drillings and rotation------------------------

	let rotation = part2.pa_Rotation;
	let drillings: any[] = [];
	let drills: any[] = [];
	let millings: any[] = [];
	let mills: any[] = [];
	let InsertionInfo = GlobalFunc.process_MachiningInsertionHelper('110',part2.pa_Model3DGroupName)
	let processings = GlobalFunc.find_ProcessingMapping(part2.pa_ProcessingId);

	processings.forEach((processing) => {
		if (processing.ProcessingLibrary == "DrillVertical") {
			drills = GlobalFunc.find_HardwareDrillVertLibrary(processing.ProcessingId!, 'Front');
			drills.forEach((drill) => {
				drillings.push(drill);
			});
		}
		if (processing.ProcessingLibrary == "Milling") {
			mills = GlobalFunc.find_HardwareMilingLibrary(processing.ProcessingId!, 'Front');
			mills.forEach((mill) => {
				millings.push(mill);
			});
		}
	});

	//--------------------For each drilling (insert the drillings)------------------------

	drillings.forEach(x => 
	{

		// Calculate the offset	
		let offsetX = InsertionInfo.InsertionPointX;
		let offsetY = InsertionInfo.InsertionPointY;

		// Calculate the position
		let posX = 0;
		let posY = 0;
		if (rotation == 0){   
			posX = posRel.x + x.XA + offsetX;
			posY = posRel.y + x.YA + offsetY;
		}
		else if (rotation == 90){
			posY = posRel.y - (x.XA + offsetX);
			posX = posRel.x + x.YA - offsetY;
		}
		else if (rotation == 270){
			posY = posRel.y - (x.XA + offsetX);
			posX = posRel.x + x.YA + offsetY;
		}
		else if (rotation == 180){
			posX = posRel.x + x.XA + offsetX;
			posY = posRel.y + x.YA - offsetY;
		}
		
		// Add Vertical Drill
		let DrillVert = elem.addncout_DrillVert();
		DrillVert.nc_TOOL="102";
		DrillVert.nc_XA=posX;
		DrillVert.nc_YA=partSelf._dimy - posY;
		DrillVert.nc_TI=partSelf._dimz;
		DrillVert.nc_DU=x.DU;

		DrillVert.nc_BM = x.matrix_BM || "LS"
		DrillVert.nc_WI = x.matrix_WI ?? 0;
		DrillVert.nc_AB = x.matrix_AB ?? 1;
		DrillVert.nc_LA = x.matrix_LA ?? 0;
		DrillVert.nc_MI = x.matrix_MI ?? 0;
		DrillVert.nc_KO = x.matrix_KO || "00";
    DrillVert.nc_Side = "Btm";

		// Add drawing
		let drilling01 = partSelf.add3DElement('Drilling01', DrillVert, posX, posY, 0, x.DU, x.DU, partSelf._dimz );
		drilling01.extrude('<svg><circle cx="' + 0 + '" cy="' + 0 + '" r="' + x.DU/2 + '" /></svg>', 'z');
	})

		//--------------------For each milling (insert the millings)------------------------

	millings.forEach(x => 
	{

		// Calculate the offset	
		let offsetX = InsertionInfo.InsertionPointX;
		let offsetY = InsertionInfo.InsertionPointY;

		// Calculate the position
		let posX = 0;
		let posY = 0;
		let xa=x.XA(0,partSelf, part2, posRel);
		let ya=x.YA(0,partSelf, part2, posRel);
		let millLengthX = 0;
		let millLengthY = 0;

		if (rotation == 0){   
			posX = posRel.x + xa + offsetX;
			posY = posRel.y + ya + offsetY;
			millLengthX = x.BR(0, partSelf, part2, posRel);
			millLengthY = x.LA(0, partSelf, part2, posRel);
		}
		else if (rotation == 90){
			posY = posRel.y - (xa + offsetX);
			posX = posRel.x + ya - offsetY;
			millLengthY = x.BR(0, partSelf, part2, posRel);
			millLengthX = x.LA(0, partSelf, part2, posRel);
		}
		else if (rotation == 270){
			posY = posRel.y - (xa + offsetX);
			posX = posRel.x + ya + offsetY;
			millLengthY = x.BR(0, partSelf, part2, posRel);
			millLengthX = x.LA(0, partSelf, part2, posRel);
		}
		else if (rotation == 180){
			posX = posRel.x + xa + offsetX;
			posY = posRel.y + ya - offsetY;
			millLengthX = x.BR(0, partSelf, part2, posRel);
			millLengthY = x.LA(0, partSelf, part2, posRel);
		}

		let posZ = 0;

		// Calculate Depth
		let tmpDimZ: number = x.TI(0, partSelf, part2, posRel);
		if (tmpDimZ == 0)
		{
			tmpDimZ = partSelf._dimz;
		}
		
		// Add Milling
		let Milling = elem.addncout_Pocket();
		Milling.nc_TOOL="112";
		Milling.nc_Side=x.Side;
		Milling.nc_XA = posX;
		Milling.nc_YA = partSelf._dimy - posY;
		Milling.nc_LA = millLengthX;
		Milling.nc_BR = millLengthY;
		Milling.nc_TI = tmpDimZ;
		let rd = x.matrix_RD || 0
		Milling.nc_RD=rd;
		Milling.nc_KO=x.matrix_KO || "00";
		Milling.nc_T_='101';
	
	
		// Add drawing
		let drilling01 = partSelf.add3DElement('Milling01', Milling, posX - millLengthX/2, posY - millLengthY/2, posZ, millLengthX, millLengthY, tmpDimZ);
		drilling01.extrude('<svg><rect x="' + 0 + '" y="' + 0 + '" width="' + millLengthX + '" height="' + millLengthY + '" rx="' + (rd) + '" ry="' + (rd) + '" /></svg>', 'z');
	})
}