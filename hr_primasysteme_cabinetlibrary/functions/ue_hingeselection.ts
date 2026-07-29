ue_HingeSelection(m: parent, iFrontOverlay: any) {

//---------------Initialize output variable---------------------------
let HingeSelection: any = {};

// Get the Information of the Carcase Parts Info
let carcasePartInfo = JSON.parse(m.mod_CarcasePartInfo[0]);

// Get the Information of the Frontconstruction
let retFrontConstruction = JSON.parse(m.mod_Information);

//---------------Calculate FrontOverlay---------------------------

	let FrontOverlay: number = 0;
	let FrontAngle: number = 0;

	if (m.mod_ModuleName == 'mc_Door01')
	{
		if (m.mod_DoorDirection == 'Left'){
			FrontOverlay = iFrontOverlay.Left;
			FrontAngle = carcasePartInfo.VerticalPartsFrontAngle[0];
		}
		else if (m.mod_DoorDirection == 'Right'){
			FrontOverlay = iFrontOverlay.Right;
			FrontAngle = carcasePartInfo.VerticalPartsFrontAngle[1];
		}
	}
	else if (m.mod_ModuleName == 'mc_Fliplift01')
	{
		if (m.mod_FrontType == 'FlipliftDown'){
			FrontOverlay = iFrontOverlay.Bottom;
			FrontAngle = carcasePartInfo.HorizontalPartsFrontAngle[0];
		}
		else if (m.mod_FrontType == 'FlipliftUp'){
			FrontOverlay = iFrontOverlay.Top;
			FrontAngle = carcasePartInfo.HorizontalPartsFrontAngle[1];
		}
	}

//---------------Get data from table HingeSettings---------------------------
	let hingeSettings: any;
	if (m.mod_ModuleName == 'mc_Door01') {
		hingeSettings = GlobalFunc.find_HingeSettings(m.mod_TypeElement, 'Doors', 'All', 'All', retFrontConstruction.retFrontConstruction.FrontConstructionId, m.mod_FrontThk, FrontAngle, m.mod_InteriorEquipmentHinge);
	}
	else if (m.mod_ModuleName == 'mc_Fliplift01') {
		hingeSettings = GlobalFunc.find_HingeSettings(m.mod_TypeElement, m.mod_FrontType, m.mod_FlipliftType, m.mod_FlipliftHardwareType, retFrontConstruction.retFrontConstruction.FrontConstructionId, m.mod_FrontThk, FrontAngle, m.mod_InteriorEquipmentHinge);
	}

//---------------Get data from table DrillingDistance---------------------------
let hingeDrillingDistance = GlobalFunc.find_HingeDrillingDistance(hingeSettings.HingeType!,FrontOverlay,hingeSettings.HingeDrillingsType!);
let drillDistance = 0;
if(hingeDrillingDistance.in_DrillingDistanceType == 'CalculationBasedMin')
{
drillDistance = FrontOverlay - hingeDrillingDistance.in_FrontOverlayMin! + hingeDrillingDistance.DrillingDistance!;
}
else if(hingeDrillingDistance.in_DrillingDistanceType == 'CalculationBasedMax')
{
drillDistance = hingeDrillingDistance.DrillingDistance! - hingeDrillingDistance.in_FrontOverlayMax! + FrontOverlay;
}
else //(hingeDrillingDistance.in_DrillingDistanceType == 'Fixed')
{
drillDistance = hingeDrillingDistance.DrillingDistance!;
}

//---------------Get data from table HingeMapping---------------------------
let hingeMapping = GlobalFunc.find_HingeMapping(hingeSettings.HingeType!,hingeDrillingDistance.Application!, hingeSettings.MountingPlateType!, hingeDrillingDistance.MountingPlateHeight!,m.mod_OpeningType,m.mod_HingeColor);

//---------------Get Data related with HardwareItem, Processings and Graphics---------------------------
let hingeFront = GlobalFunc.calc_HardwareObjectInfo(hingeMapping.ObjectFront!);
let hingeCarcase = GlobalFunc.calc_HardwareObjectInfo(hingeMapping.ObjectCarcase!);

//---------------Set output values---------------------------
HingeSelection.HingeType = hingeSettings.HingeType!;
HingeSelection.MountingPlateType = hingeSettings.MountingPlateType!;
HingeSelection.MountingPlateHeight = hingeDrillingDistance.MountingPlateHeight!;
HingeSelection.CarcaseFrontAngle = FrontAngle;
HingeSelection.DrillingDistance = drillDistance;
HingeSelection.FrontHardwareItem = hingeFront.HardwareItem;
HingeSelection.FrontProcessingItem = hingeFront.ProcessingItem;
HingeSelection.FrontGraphic=hingeFront.Graphics;
HingeSelection.CarcaseHardwareItem = hingeCarcase.HardwareItem;
HingeSelection.CarcaseProcessingItem = hingeCarcase.ProcessingItem;
HingeSelection.CarcaseGraphic=hingeCarcase.Graphics;
HingeSelection.HingeGapCarcase=hingeMapping.HingeFrontGapCarcase!;
HingeSelection.OpeningAngle=hingeMapping.OpeningAngle!;


return HingeSelection;


}
