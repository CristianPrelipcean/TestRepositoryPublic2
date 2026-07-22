process_Touch(PartLong: string, PartLongDimx:number, PartLongDimy:number, PartLongDimz:number, PartLongxAbs:number, PartLongyAbs:number,PartLongzAbs:number, PartShort:string, PartShortDimx:number, PartShortDimy:number, PartShortDimz:number, PartShortxAbs:number, PartShortyAbs:number,PartShortzAbs:number,TouchSide:string )
{

//---------------Declare Variables-----------------
let TouchLength: number = 0;
let TouchWidth: number = 0;

//---------------Calculate Touch Dimensions-----------------
if (TouchSide == 'FromRight')
{
	if ( (PartLongxAbs + PartLongDimx) == PartShortxAbs)
		{
			let Front = Math.min (PartLongzAbs + PartLongDimz,PartShortzAbs + PartShortDimz);
			let Back = Math.max (PartLongzAbs,PartShortzAbs);
			TouchLength = Front - Back;
			let Top = Math.min (PartLongyAbs + PartLongDimy, PartShortyAbs + PartShortDimy);
			let Bottom = Math.max (PartLongyAbs, PartShortyAbs);
			TouchWidth = Top - Bottom;
		}
		else 
		{
			logError('Error 40001: The PartShort ' +  PartShort + ' does not touch ' + TouchSide + ' the PartLong ' + PartLong);
		}
}
else if (TouchSide == 'FromLeft')
{
	if ( (PartShortxAbs + PartShortDimx) == PartLongxAbs)
		{
			let Front = Math.min (PartLongzAbs + PartLongDimz,PartShortzAbs + PartShortDimz);
			let Back = Math.max (PartLongzAbs,PartShortzAbs);
			TouchLength = Front - Back;
			let Top = Math.min (PartLongyAbs + PartLongDimy, PartShortyAbs + PartShortDimy);
			let Bottom = Math.max (PartLongyAbs, PartShortyAbs);
			TouchWidth = Top - Bottom;
		}
		else 
		{
			logError('Error 40001: The PartShort ' +  PartShort + ' does not touch ' + TouchSide + ' the PartLong ' + PartLong);
		}
}
else if (TouchSide == 'FromBottom')
{
	if ( (PartShortyAbs + PartShortDimy) == PartLongyAbs)
		{
			let Front = Math.min (PartLongzAbs + PartLongDimz,PartShortzAbs + PartShortDimz);
			let Back = Math.max (PartLongzAbs,PartShortzAbs);
			TouchLength = Front - Back;
			let Left = Math.max (PartLongxAbs, PartShortxAbs);
			let Right = Math.min (PartLongxAbs + PartLongDimx, PartShortxAbs + PartShortDimx);
			TouchWidth = Right - Left;
		}
		else 
		{
			logError('Error 40001: The PartShort ' +  PartShort + ' does not touch ' + TouchSide + ' the PartLong ' + PartLong);
		}
}
else if (TouchSide == 'FromTop')
{
	if ( (PartLongyAbs + PartLongDimy) == PartShortyAbs)
		{
			let Front = Math.min (PartLongzAbs + PartLongDimz,PartShortzAbs + PartShortDimz);
			let Back = Math.max (PartLongzAbs,PartShortzAbs);
			TouchLength = Front - Back;
			let Left = Math.max (PartLongxAbs, PartShortxAbs);
			let Right = Math.min (PartLongxAbs + PartLongDimx, PartShortxAbs + PartShortDimx);
			TouchWidth = Right - Left;
		}
		else 
		{
			logError('Error 40001: The PartShort ' +  PartShort + ' does not touch ' + TouchSide + ' the PartLong ' + PartLong);
		}
}
else if (TouchSide == 'FromFront')
{
	if ( (PartLongzAbs + PartLongDimz) == PartShortzAbs)
		{
			let Top = Math.min (PartLongyAbs + PartLongDimy, PartShortyAbs + PartShortDimy);
			let Bottom = Math.max (PartLongyAbs, PartShortyAbs);
			TouchLength = Top - Bottom;
			let Left = Math.max (PartLongxAbs, PartShortxAbs);
			let Right = Math.min (PartLongxAbs + PartLongDimx, PartShortxAbs + PartShortDimx);
			TouchWidth = Right - Left;
		}
		else 
		{
			logError('Error 40001: The PartShort ' +  PartShort + ' does not touch ' + TouchSide + ' the PartLong ' + PartLong);
		}
}
else if (TouchSide == 'FromBehind')
{
	if ( (PartShortzAbs + PartShortDimz) == PartLongzAbs)
		{
			let Top = Math.min (PartLongyAbs + PartLongDimy, PartShortyAbs + PartShortDimy);
			let Bottom = Math.max (PartLongyAbs, PartShortyAbs);
			TouchLength = Top - Bottom;
			let Left = Math.max (PartLongxAbs, PartShortxAbs);
			let Right = Math.min (PartLongxAbs + PartLongDimx, PartShortxAbs + PartShortDimx);
			TouchWidth = Right - Left;
		}
		else 
		{
			logError('Error 40001: The PartShort ' +  PartShort + ' does not touch ' + TouchSide + ' the PartLong ' + PartLong);
		}
}
else
{
	logError('Error 40002: The TouchSide defined between PartLong ' + PartLong + ' and PartShort ' + PartShort + ' is not valid ');
}

	let Touch = 
	{
		Length					: TouchLength,
		Width 					: TouchWidth,
	}
return Touch;

}