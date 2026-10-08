process_HandlestripPos(m: parent){

	// Initialize output variable
	let retHandle: any = {};
/*
	

	//========================================================================
	// Call user exit for customization
	//========================================================================

	//---------------Find PartGroup from tab_PartSettings-----------------

	//let PartGroup = GlobalFunc.find_PartSettings(PartInfo).PartGroup;

	//---------------Map the handle to tab_HardwareLibrary----------------

	let ColRelevant = true;
	let LenRelevant = true;	
	let HandlePosTypeRelevant = true;	
	let HandleW = 0;
	let HandlePosType = 'None';
	HandleW = m.mod_FrontWidth-m.mod_FrontGapVert;
	if (m.mod_ModuleName == "mc_Door01"){HandlePosType = m.mod_HandlePosType_matrix.PosTypeDoor}
	else if (m.mod_ModuleName == "mc_Drawer01"){HandlePosType = m.mod_HandlePosType_matrix.PosTypeDrawer}
	else if (m.mod_ModuleName == "mc_FlipLift01"){HandlePosType = m.mod_HandlePosType_matrix.PosTypeFliplift}
	if (m.mod_HandleDesign_matrix.HandleColor == 'Attribute') { ColRelevant = true }
	let retHandleMapping = GlobalFunc.find_HandleMapping(m.mod_HandleDesign, m.mod_HandleColor, HandlePosType, HandleW!, true, HandlePosTypeRelevant, ColRelevant);
	//---------------Find handle in tab_HardwareLibrary-------------------
	let retHandleInfo = GlobalFunc.find_HardwareLibrary(retHandleMapping.SupplierArticleNumber!, retHandleMapping.Supplier!)
	retHandle.HandleW=retHandleInfo.Length;
	retHandle.HandleH=retHandleInfo.Width;
	retHandle.HandleD=retHandleInfo.Thickness;
	retHandle.Mod3D=retHandleInfo.Model3D;
	retHandle.SupplierCode=retHandleMapping.SupplierArticleNumber;
	retHandle.Supplier=retHandleMapping.Supplier;
	retHandle.FrontReduction=retHandleInfo.FrontReduction;
*/
	return retHandle;
}