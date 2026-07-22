process_EdgebandBom(Elem: any, Part: any, ParentId:string, EdgeName: string){

	//========================================================
	// Constants
	//========================================================
	const edgeName = EdgeName;
	const bomElementType = 'Edge';

	//========================================================
	// Guards
	//========================================================
	if (!Elem || !Part) {
		return;
	}

	if (!Part._partId || !Part._id) {
		return;
	}

	//========================================================
	// Load master data
	//========================================================
	const edgeNumber = GlobalFunc.find_EdgeNumberSettings(Part._partId, edgeName);
	if (!edgeNumber) {
		return;
	}

	const edgeInfo = GlobalFunc.process_EdgeInfo(
		Part._partId,
		Part._thickness,
		Part.pa_EdgeFrontColor,
		Part.pa_EdgeLeftColor,
		Part.pa_EdgeBackColor,
		Part.pa_EdgeRightColor,
		Part.pa_EdgeFrontType,
		Part.pa_EdgeLeftType,
		Part.pa_EdgeBackType,
		Part.pa_EdgeRightType,
		Part.pa_EdgeJointType
	);
	if (!edgeInfo || !edgeInfo.EdgeLeftData) {
		return;
	}

	//========================================================
	// Read edge data
	//========================================================
	const edgeLeftData = edgeInfo.EdgeLeftData;

	const height = edgeLeftData.Height ?? 0;
	const thickness = edgeLeftData.Thickness ?? 0;
	const glueType = edgeLeftData.GlueType ?? '';
	const supplierArticleCode = edgeLeftData.SupplierArticleNumber ?? '';

	//========================================================
	// Output data
	//========================================================
	const Edge = Elem.addbomout_Edge();

	Edge.bom_Type = edgeNumber.BomEdgeType ?? '';
	Edge.bom_Name = edgeNumber.BomEdgeDescription ?? '';
	Edge.bom_EdgeId = edgeInfo.EdgeLeftCode ?? '';
	Edge.bom_PartId = Part._id;
	Edge.bom_Length = Part._depth ?? 0;
	Edge.bom_Width = height;
	Edge.bom_Thk = thickness;
	Edge.bom_EdgeJoint = edgeInfo.EdgeJointLeftBack ?? '';
	Edge.bom_GlueType = glueType;
	Edge.bom_EdgeNumber = edgeNumber.BomEdgeNumber ?? '';
	Edge.bom_Color = Part.pa_EdgeLeftColor ?? '';
	Edge.bom_SupplierArticle = supplierArticleCode;
	Edge.bom_ElementId = `${Part._id}_${edgeNumber.BomEdgeNumber ?? ''}`;
	Edge.bom_ParentId = ParentId;
	Edge.bom_ElementType = bomElementType;	
}