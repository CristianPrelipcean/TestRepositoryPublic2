calc_FrontOverlay(m: parent, Width: number, Height: number, WidthPos:number, HeightPos: number, FrontOrientation: string) {

	//====================================================================
	// Initialize variables
	//====================================================================
interface IFrontOverlay {
		Bottom?: number;
		BottomThk?: number;
		Left?: number;
		LeftThk?: number;
		Top?: number;
		TopThk?: number;
		Right?: number;
		RightThk?: number;
	}

	let FrontOverlay: IFrontOverlay = {
		Bottom: undefined,
		BottomThk: undefined,
		Left: undefined,
		LeftThk: undefined,
		Top: undefined,
		TopThk: undefined,
		Right: undefined,
		RightThk: undefined
	};

	// Get the Information of the Carcase Parts Info
	let carcasePartInfo: any;
	if (m.mod_CarcasePartInfo[0] != undefined) {
		carcasePartInfo = JSON.parse(m.mod_CarcasePartInfo[0]);
	}
	else {
		FrontOverlay.Left = 0,
		FrontOverlay.LeftThk = 0,
		FrontOverlay.Right = 0,
		FrontOverlay.RightThk = 0,
		FrontOverlay.Top = 0,
		FrontOverlay.TopThk = 0,
		FrontOverlay.Bottom = 0,
		FrontOverlay.BottomThk = 0;
		return FrontOverlay;
	}
	
	//====================================================================
	// Calculate FrontOverlay
	//====================================================================

	if (carcasePartInfo.VerticalPartsType[0] != 'NoVertDivider' && carcasePartInfo.VerticalPartsType[0] != 'Cleat'){ //Left
		if (FrontOrientation == 'FromFront') {
			FrontOverlay.Left = carcasePartInfo.VerticalPartsPosX[0] + carcasePartInfo.VerticalPartsDimX[0] - WidthPos;
			FrontOverlay.LeftThk = carcasePartInfo.VerticalPartsDimX[0];
		}
		else if (FrontOrientation == 'FromRight') {
			FrontOverlay.Left = WidthPos + Width - carcasePartInfo.VerticalPartsPosZ[0];
			FrontOverlay.LeftThk = carcasePartInfo.VerticalPartsDimX[0];
		}
	}
	if (carcasePartInfo.VerticalPartsType[1] != 'NoVertDivider' && carcasePartInfo.VerticalPartsType[1] != 'Cleat'){ //Right
		if (FrontOrientation == 'FromFront') {
			FrontOverlay.Right = WidthPos + Width - carcasePartInfo.VerticalPartsPosX[1];
			FrontOverlay.RightThk = carcasePartInfo.VerticalPartsDimX[1];
		}
		else if (FrontOrientation == 'FromRight') {
			FrontOverlay.Right = carcasePartInfo.VerticalPartsPosZ[1] + carcasePartInfo.VerticalPartsDimX[1] - WidthPos;
			FrontOverlay.RightThk = carcasePartInfo.VerticalPartsDimX[1];
		}
	}
	if (carcasePartInfo.HorizontalPartsType[1] != 'NoFixedShelf') { //Top
		FrontOverlay.Top = HeightPos + Height - carcasePartInfo.HorizontalPartsPosY[1];
		FrontOverlay.TopThk = carcasePartInfo.HorizontalPartsDimY[1];
	}
	if (carcasePartInfo.HorizontalPartsType[0] != 'NoFixedShelf') { //Bottom
		FrontOverlay.Bottom = carcasePartInfo.HorizontalPartsPosY[0] + carcasePartInfo.HorizontalPartsDimY[0] - HeightPos;
		FrontOverlay.BottomThk = carcasePartInfo.HorizontalPartsDimY[0];
	}
	
	return FrontOverlay;
}