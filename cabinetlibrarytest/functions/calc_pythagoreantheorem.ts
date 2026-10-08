calc_pythagoreanTheorem(Angle: number, AdjacentSide: number, OppositeSide: number, Hypotenuse: number ) {
	//====================================================================
	//Interface to provide the data
  	//====================================================================

  	interface pythagoreanTheorem {
		Angle: number;
		AdjacentSide: number;
		OppositeSide: number;
		Hypotenuse: number;
  	}

  	//---------------Initialize the object-----------------
  	let pythagoreanTheorem: pythagoreanTheorem = {
		Angle: 0,
		AdjacentSide: 0,
		OppositeSide: 0,
		Hypotenuse: 0
  	};
	
	
	if (Angle != 0 && AdjacentSide != 0 && OppositeSide == 0 && Hypotenuse == 0) {
		OppositeSide = AdjacentSide * Math.tan(Angle * (Math.PI / 180));
		Hypotenuse = AdjacentSide / Math.cos(Angle * (Math.PI / 180));
	}
	else if (Angle != 0 && AdjacentSide == 0 && OppositeSide != 0 && Hypotenuse == 0) {
		AdjacentSide = OppositeSide / Math.tan(Angle * (Math.PI / 180));
		Hypotenuse = OppositeSide / Math.sin(Angle * (Math.PI / 180));
	}
	else if (Angle != 0 && AdjacentSide == 0 && OppositeSide == 0 && Hypotenuse != 0) {
		AdjacentSide = Hypotenuse * Math.cos(Angle * (Math.PI / 180));
		OppositeSide = Hypotenuse * Math.sin(Angle * (Math.PI / 180));
	}
	else if (Angle == 0 && AdjacentSide != 0 && OppositeSide != 0 && Hypotenuse == 0) {
		Angle = (Math.atan(OppositeSide / AdjacentSide)) * (180 / Math.PI);
		Hypotenuse = Math.sqrt(AdjacentSide * AdjacentSide + OppositeSide * OppositeSide);
	}
	else if (Angle == 0 && AdjacentSide != 0 && OppositeSide == 0 && Hypotenuse != 0) {
		Angle = (Math.acos(AdjacentSide / Hypotenuse)) * (180 / Math.PI);
		OppositeSide = Math.sqrt(Hypotenuse * Hypotenuse - AdjacentSide * AdjacentSide);
	}
	else if (Angle == 0 && AdjacentSide == 0 && OppositeSide != 0 && Hypotenuse != 0) {
		Angle = (Math.asin(OppositeSide / Hypotenuse)) * (180 / Math.PI);
		AdjacentSide = Math.sqrt(Hypotenuse * Hypotenuse - OppositeSide * OppositeSide);
	}
  
	return [Angle, AdjacentSide, OppositeSide, Hypotenuse];
  }