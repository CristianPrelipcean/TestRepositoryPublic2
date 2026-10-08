ue_HingePositioning(m: parent){

	//---------------Initialize output variable---------------------------
	let HingePos: any = {};

	// Get the Information of the Frontconstruction
	let retFrontConstruction = JSON.parse(m.mod_Information);

	//---------------Get data from table HingePosition---------------------------
	let retHingePos: any;
	if (m.mod_ModuleName == 'mc_Door01')
		{
			retHingePos= GlobalFunc.find_HingePosition(m.mod_TypeElement, retFrontConstruction.retFrontConstruction.FrontConstructionId, 'All','All', m.mod_FrontHeight, m.mod_FrontWidth, 0, m.mod_FingergripTopType, m.mod_FingergripBtmType, m.mod_HandleDesign, m.mod_HandlePosLogic); ////////////////////////////////// CALCULATION OF WEIGHT PENDING!!!!!!!!!
		}
		else if (m.mod_ModuleName == 'mc_Fliplift01')
		{
			retHingePos = GlobalFunc.find_HingePosition(m.mod_TypeElement, retFrontConstruction.retFrontConstruction.FrontConstructionId, m.mod_FlipliftType, m.mod_FlipliftHardwareType, m.mod_FrontHeight, m.mod_FrontWidth, 0, m.mod_FingergripTopType, m.mod_FingergripBtmType, m.mod_HandleDesign, m.mod_HandlePosLogic); ////////////////////////////////// CALCULATION OF WEIGHT PENDING!!!!!!!!!
		}

	//---------------Set output value---------------------------
	HingePos.Descriptor = retHingePos.Descriptor!;

	return HingePos;
}