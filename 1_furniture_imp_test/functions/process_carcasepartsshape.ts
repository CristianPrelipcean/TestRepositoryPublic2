process_CarcasePartsShape(m: parent, Part:string, Fingergrip:string, AdditionalInfo01:string, AdditionalInfo02:string, AdditionalInfo03:string, AdditionalInfo04:string){

	//====================================================================
	// Initialize variables
	//====================================================================
	interface ishapeInfo {
		SvgPath?: string;
    ExtrudeDirection?: string;
	}

  let shapeInfo: ishapeInfo = {
    SvgPath: undefined,
    ExtrudeDirection: undefined
  };


	//====================================================================
	// Find the Shape
	//====================================================================
	let carcasePartsShape = GlobalFunc.find_CarcasePartsShape(Part, Fingergrip, AdditionalInfo01, AdditionalInfo02, AdditionalInfo03, AdditionalInfo04).sort((a, b) => {
		return a.Sequence! - b.Sequence!;
	});

	//====================================================================
	// Create svgPath
	//====================================================================
	let i: number = 0;
	carcasePartsShape.forEach(cps =>
	{
		if (i == 0) { shapeInfo.SvgPath = '' }
		i++
		shapeInfo.SvgPath += cps.SvgPath(m) + ' ';
		shapeInfo.ExtrudeDirection = cps.ExtrudeDirection;
	});

	// Return result
  return shapeInfo;
}