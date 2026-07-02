process_EdgeInfo(PartID:string, PartThickness:number, ColorFront:string, ColorLeft:string, ColorBack:string, ColorRight:string, EdgeFrontType:string, EdgeLeftType:string, EdgeBackType:string, EdgeRightType:string, EdgeJointType:string, AddInfo1:string = 'None') {

	let Program = 'All'

	//====================================================================
	// Get data from tables and local functions
	//====================================================================

	//---------------Get EdgeData-----------------
	let EdgeFrontData = getEdgeData(Program, EdgeFrontType, ColorFront, PartThickness);
	let EdgeLeftData = 	getEdgeData(Program, EdgeLeftType,	ColorLeft,	PartThickness);
	let EdgeBackData = 	getEdgeData(Program, EdgeBackType,	ColorBack,	PartThickness);
	let EdgeRightData = getEdgeData(Program, EdgeRightType,	ColorRight,	PartThickness);

	//---------------Get EdgeCode-----------------
	let EdgeFrontCode = EdgeFrontData 	? 	EdgeFrontData.EdgeId! 	: 	'NoEdge'; 
	let EdgeLeftCode = 	EdgeLeftData 	? 	EdgeLeftData.EdgeId! 	: 	'NoEdge';
	let EdgeBackCode = 	EdgeBackData 	? 	EdgeBackData.EdgeId! 	: 	'NoEdge';
	let EdgeRightCode = EdgeRightData 	? 	EdgeRightData.EdgeId! 	: 	'NoEdge';

	//---------------Get EdgeJoint-----------------
	let EdgeJointFrontLeft = 	getEdgeJoint(PartID, EdgeFrontCode, EdgeLeftCode, EdgeJointType, 'FrontLeft');
	let EdgeJointLeftBack = 	getEdgeJoint(PartID, EdgeLeftCode, EdgeBackCode, EdgeJointType, 'LeftBack');
	let EdgeJointBackRight = 	getEdgeJoint(PartID, EdgeBackCode, EdgeRightCode, EdgeJointType, 'BackRight');
	let EdgeJointRightFront = 	getEdgeJoint(PartID, EdgeRightCode, EdgeFrontCode, EdgeJointType, 'RightFront');

	//---------------Calculate EdgeTransition-----------------
	let EdgeTransition = calculateEdgeTransition(EdgeFrontCode, EdgeJointFrontLeft, EdgeJointRightFront);
	EdgeTransition += ':';
	EdgeTransition += calculateEdgeTransition(EdgeBackCode, EdgeJointBackRight, EdgeJointLeftBack);
	EdgeTransition += ':';
	EdgeTransition += calculateEdgeTransition(EdgeLeftCode, EdgeJointLeftBack, EdgeJointFrontLeft);
	EdgeTransition += ':';
	EdgeTransition += calculateEdgeTransition(EdgeRightCode, EdgeJointRightFront, EdgeJointBackRight);

	//---------------Calculate EdgeShape-----------------
	let EdgeShape: string = '';
	if (EdgeBackCode != 'NoEdge')
	{
		EdgeShape += EdgeJointLeftBack == 'S' ? 'N1' : 'N0';
	}
	if (EdgeLeftCode != 'NoEdge')
	{
		EdgeShape += EdgeJointFrontLeft == 'S' ? 'W1' : 'W0';
	}
	if (EdgeFrontCode != 'NoEdge')
	{
		EdgeShape += EdgeJointRightFront == 'S' ? 'S1' : 'S0';
	}
	if (EdgeRightCode != 'NoEdge')
	{
		EdgeShape += EdgeJointBackRight == 'S' ? 'E1' : 'E0';
	}

	// Insert Separators in EdgeShape
	if (EdgeShape.length>3)
	{
		const matches = EdgeShape.match(/.{1,2}/g);
		EdgeShape = matches!.join('_');
	}

	//====================================================================
	// Define Output
	//====================================================================

	let EdgeInfo = {
	// Create EdgeInfo with values to return
	EdgeFrontCode     : EdgeFrontCode,
	EdgeLeftCode 			: EdgeLeftCode,
	EdgeBackCode 			: EdgeBackCode,
	EdgeRightCode			: EdgeRightCode,
	EdgeFrontData			: EdgeFrontData,
	EdgeLeftData			: EdgeLeftData,
	EdgeBackData			: EdgeBackData,
	EdgeRightData			: EdgeRightData,
	EdgeJointFrontLeft		: EdgeJointFrontLeft,
	EdgeJointLeftBack		  : EdgeJointLeftBack,
	EdgeJointBackRight		: EdgeJointBackRight,
	EdgeJointRightFront	  : EdgeJointRightFront,
	EdgeTransition			  : EdgeTransition,
	EdgeShape				      : EdgeShape,

	OverdimensionFront    :	EdgeFrontData	?  getPartOverdimension(EdgeFrontType, EdgeFrontData.Thickness!)	: 0,
	OverdimensionLeft     :	EdgeLeftData	?  getPartOverdimension(EdgeLeftType, EdgeLeftData.Thickness!)	: 0,
	OverdimensionBack     :	EdgeBackData	?  getPartOverdimension(EdgeBackType, EdgeBackData.Thickness!)	: 0,
	OverdimensionRight    :	EdgeRightData	?  getPartOverdimension(EdgeRightType, EdgeRightData.Thickness!)	: 0,

	}

	return EdgeInfo;

	//====================================================================
	// Local Functions (local functions were created to avoid repeting code - tipically, once per edge)
	//====================================================================

	//---------------Function getEdgeJoint-----------------
	function getEdgeJoint (partID: string, edgeCode: string, edgeNeighbourCode: string, edgeType: string, edge:string): string {
		if (edgeCode == 'NoEdge')
		{
			return 'E'
		}
		else if (edgeCode != 'NoEdge' && edgeNeighbourCode == 'NoEdge')
		{
			return 'S'
		}

		let partSettings = GlobalFunc.find_PartSettings(partID, AddInfo1);
		
		let e = GlobalFunc.find_EdgeJointSettings(partSettings.PartGroup!,edgeType)!;
		if (edge=="FrontLeft")  return e.EdgeJointFrontLeft!; 
		if (edge=="LeftBack")  return e.EdgeJointLeftBack!; 
		if (edge=="BackRight")  return e.EdgeJointBackRight!; 
		if (edge=="RightFront")  return e.EdgeJointRightFront!; 
		
		logError('Wrong parameter passed for getEdgeJoint:' + edge);
		return 'ERROR';
	};

	//---------------Function getEdgeData-----------------
	function getEdgeData(Program: string, edgeType: string, color: string, partthickness: number): ICT_tab_EdgeLibrary | undefined {

	if (edgeType != 'NOE') 
	{
		let edgeSettings = GlobalFunc.find_EdgeClassSettings(edgeType); 
		let edgeMapping = GlobalFunc.find_EdgeMapping(Program, edgeSettings.EdgeClass!, color, partthickness);
		if (!edgeMapping) {
			return undefined;
		}
		else if (edgeMapping.EdgeObject! == 'NoEdge')
			{
				return undefined;
			}
		else
			{
			let edgeLibrary = GlobalFunc.find_EdgeLibrary(edgeMapping.EdgeObject!);
			
				return edgeLibrary;
			}			
		}
		return undefined;
	};

	//---------------Function calculateEdgeTransition-----------------
	function calculateEdgeTransition (edgeCode: string, edgeJointL: string, edgeJointR: string): string {
		let edgeTransition: string ='';
		if (edgeCode != 'NoEdge') {
			edgeTransition = '0';
			edgeTransition += (edgeJointL == 'L') ? '1' : '0';
			edgeTransition += (edgeJointR == 'L' || edgeJointR == 'E') ? '0' : '1';
		}
		return edgeTransition;
	};

	//---------------Function getPartOverdimension-----------------
	function getPartOverdimension(edgeType: string, edgethickness: number): number {
		
		if (edgeType != 'NOE' && GlobalFunc.find_PartOverdimensionSettings(edgethickness)!) 
		{
			return GlobalFunc.find_PartOverdimensionSettings(edgethickness).Overdimension;
		}
		
		return 0;
	};
}