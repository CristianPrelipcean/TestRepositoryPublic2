process_StorageunitSidepanelShape(m: parent, Part:string){

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
  // Declare variables for the function find_CarcasePartsShape
  //====================================================================
  let part = Part;
  let fingergrip = 'All'
  let additionalInfo01 = m.mod_SlopeAngle != 0 ? 'SlopedCeiling' : 'All';
  let additionalInfo02 = m.mod_SlopeAngle != 0 ? m.mod_SlopedCeilingConstruction : 'All';
  let additionalInfo03 = m.mod_SlopeAngle != 0 ? m.mod_CarcaseConnectionLeftTop : 'All';
  let additionalInfo04 = m.mod_SlopeAngle != 0 ? 'All' : 'All';


  //====================================================================
  // Find the Shape for Cabinets without Angles and (with fingergrip middle or fingergrip top)
  // or
  // For Cabinets with Angles -with or without fingergrip-
  //====================================================================
  let Shape;
  if ((m.mod_SlopeAngle == 0 && (m.mod_FingergripQtyMiddle > 0 || m.mod_FingergripTop == true)) || m.mod_SlopeAngle != 0) {

    //--------------- Get the generic Shape-----------------
    Shape = GlobalFunc.find_CarcasePartsShape(part, fingergrip, additionalInfo01, additionalInfo02, additionalInfo03, additionalInfo04).sort((a, b) => {
      return a.Sequence! - b.Sequence!;
    });

    //--------------- If there's fingergrip on top, get the Shape of the fingergrip on top-----------------
    if (m.mod_FingergripTop == true) {

      let FingergripTop = GlobalFunc.find_CarcasePartsShape(part, 'Top', additionalInfo01, additionalInfo02, additionalInfo03, additionalInfo04).sort((a, b) => {
        return a.Sequence! - b.Sequence!;
      });

      // push results to Shape
      FingergripTop.forEach(element => {
        Shape.push(element);
      });
    }

    //--------------- If there's fingergrip in the middle, get the Shape of the fingergrip middle as many times as needed -----------------
    if (m.mod_FingergripQtyMiddle > 0) {

      for (let i = 1; i <= m.mod_FingergripQtyMiddle; i++) {
        let FingergripMiddle = GlobalFunc.find_CarcasePartsShape(part, 'Middle' + i, additionalInfo01, additionalInfo02, additionalInfo03, additionalInfo04).sort((a, b) => {
          return a.Sequence! - b.Sequence!;
        });

        // push results to Shape
        FingergripMiddle.forEach(element => {
          Shape.push(element);
        });
      }
    }
  }

	//====================================================================
	// Create svgPath
	//====================================================================
	let i: number = 0;
  if (Shape != undefined && Shape.length > 0) {

    //--------------- Sort the Shape Array-----------------
    let ShapeSorted = Shape.sort((a, b) => {
      return a.Sequence! - b.Sequence!;
    });

    //--------------- Create complete string-----------------
    ShapeSorted.forEach(cps =>
    {
      if (i == 0) { shapeInfo.SvgPath = '' }
      i++
      shapeInfo.SvgPath += cps.SvgPath(m) + ' ';
      shapeInfo.ExtrudeDirection = cps.ExtrudeDirection;
    });
  }
	
  //====================================================================
  // Return result
  //====================================================================
  return shapeInfo;
}