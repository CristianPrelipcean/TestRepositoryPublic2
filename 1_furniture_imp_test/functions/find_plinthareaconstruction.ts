find_PlinthAreaConstruction(BasePoint:number, MatrixPositionType:number, Rotation:number):ICT_tab_PlinthAreaConstruction{
	let retEntry = ct_tab_PlinthAreaConstruction.find(p=> p.in_BasePoint == BasePoint && p.in_MatrixPositionType == MatrixPositionType && p.in_RotationMin <= Rotation && p.in_RotationMax >= Rotation)!;
	if (retEntry == undefined) {
		let Text = BasePoint + ' - ' + MatrixPositionType;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 11005',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
	}